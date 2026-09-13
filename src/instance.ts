import { InstanceBase, InstanceStatus, type SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { type Handle } from './Interfaces/Handle.js'
import { UpdatePresets } from './presets.js'
import { TitanClient } from './api/client.js'
import { booleanProperties, readBoolean, type BooleanState } from './state.js'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig
	handles: Handle[] = []
	imageList: Record<string, string> = {}
	state: BooleanState = {}
	connected = false
	softwareVersion = ''
	pollInterval: NodeJS.Timeout | null = null
	private client?: TitanClient
	private icons = new Map<string, { data: string; expires: number }>()

	async init(config: ModuleConfig): Promise<void> {
		this.updateActions()
		this.updateFeedbacks()
		this.updateVariableDefinitions()
		await this.configUpdated(config)
	}

	async destroy(): Promise<void> {
		this.stop()
	}

	private stop(): void {
		if (this.pollInterval) clearTimeout(this.pollInterval)
		this.pollInterval = null
		this.client?.abort()
		this.client = undefined
	}

	private publishState(): void {
		this.setVariableValues({
			connected: this.connected ? 1 : 0,
			software_version: this.softwareVersion,
			...Object.fromEntries(
				Object.keys(booleanProperties).map((key) => [
					key,
					this.state[key as keyof BooleanState] === undefined
						? 'unknown'
						: this.state[key as keyof BooleanState]
							? 1
							: 0,
				]),
			),
		})
		this.checkFeedbacks()
	}

	private invalidate(): void {
		this.connected = false
		this.state = {}
		this.softwareVersion = ''
		this.imageList = {}
		this.handles = []
		this.icons.clear()
		this.updatePresets()
		this.publishState()
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.stop()
		this.config = config
		this.invalidate()
		if (!config.host?.trim()) {
			this.updateStatus(InstanceStatus.BadConfig, 'Enter a target IP address')
			return
		}
		const client = new TitanClient(config.host.trim())
		this.client = client
		this.updateStatus(InstanceStatus.Connecting)
		await this.refresh(client)
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}
	updateActions(): void {
		UpdateActions(this)
	}
	updateFeedbacks(): void {
		UpdateFeedbacks(this)
	}
	updatePresets(): void {
		UpdatePresets(this)
	}
	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
	}

	async sendCommands(paths: string[]): Promise<boolean> {
		const client = this.client
		if (!client) return false
		try {
			await client.commands(paths)
			return this.client === client
		} catch (error) {
			if (this.client === client) {
				this.log('error', error instanceof Error ? error.message : String(error))
				this.invalidate()
				this.updateStatus(InstanceStatus.ConnectionFailure, 'Command failed; see log')
			}
			return false
		}
	}

	async sendCommand(path: string): Promise<boolean> {
		return this.sendCommands([path])
	}

	private async refresh(client: TitanClient): Promise<void> {
		try {
			const version = await client.read('get/2/System/SoftwareVersion')
			const response = await client.read('handles')
			if (!Array.isArray(response)) throw new Error('Invalid Titan handles response')
			const handles = response.filter((value: unknown): value is Handle => {
				if (!value || typeof value !== 'object') return false
				const handle = value as Partial<Handle>
				return (
					typeof handle.titanId === 'number' &&
					typeof handle.legend === 'string' &&
					typeof handle.type === 'string' &&
					!!handle.userNumber &&
					['string', 'number'].includes(typeof handle.userNumber.hashCode)
				)
			})
			const state: BooleanState = {}
			for (const [key, property] of Object.entries(booleanProperties)) {
				try {
					state[key as keyof BooleanState] = readBoolean(
						await client.read(`get/2/${property.member.replaceAll('.', '/')}`),
					)
				} catch {
					// An unavailable property is unknown, not a false state or a desk disconnect.
				}
			}
			if (this.client !== client) return
			const handlesChanged = JSON.stringify(this.handles) !== JSON.stringify(handles)
			this.handles = handles
			this.state = state
			this.softwareVersion = typeof version === 'string' || typeof version === 'number' ? String(version) : ''
			this.connected = true
			if (handlesChanged) this.updatePresets()
			this.updateStatus(InstanceStatus.Ok)
			this.publishState()
			const images: Record<string, string> = {}
			const icons = new Map<string, { data: string; expires: number }>()
			for (const handle of handles) {
				if (typeof handle.icon !== 'string' || !handle.icon) continue
				try {
					let icon = icons.get(handle.icon) ?? this.icons.get(handle.icon)
					if (!icon || icon.expires <= Date.now())
						icon = { data: await client.image(handle.icon), expires: Date.now() + 30000 }
					icons.set(handle.icon, icon)
					images[String(handle.userNumber.hashCode)] = icon.data
				} catch {
					// One broken picture must not prevent state updates for the whole desk.
				}
			}
			if (this.client !== client) return
			this.icons = icons
			this.imageList = images
			this.checkFeedbacks('image')
		} catch (error) {
			if (this.client !== client) return
			this.invalidate()
			this.updateStatus(InstanceStatus.ConnectionFailure, error instanceof Error ? error.message : String(error))
		} finally {
			if (this.client === client) {
				// Schedule after completion so slow requests cannot overlap the next poll.
				this.pollInterval = setTimeout(() => {
					void this.refresh(client)
				}, 5000)
			}
		}
	}
}
