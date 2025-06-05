import { InstanceBase, InstanceStatus, runEntrypoint, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { getUpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'
import { Handle } from './Interfaces/Handle.js'
import { UpdatePresets } from './presets.js'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()
	handles: Handle[] = []
	imageList: { [key: string]: string } = {}
	pollInterval: NodeJS.Timeout | null = null

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)

		await this.configUpdated(config)

		this.updateActions() // export actions
		this.updateFeedbacks() // export feedbacks
		this.updateVariableDefinitions() // export variable definitions
	}
	// When module gets deleted
	async destroy(): Promise<void> {
		this.log('debug', 'destroy')
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config

		if (this.pollInterval) {
			clearInterval(this.pollInterval)
		}

		await this.sendCommand('get/System/SoftwareVersion')
		this.handles = await this.getInfo('handles')

		this.log('debug', JSON.stringify(this.handles))
		this.updatePresets()
	}

	// Return config fields for web config
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

	async getInfo(path: string): Promise<any> {
		this.log('debug', 'test')
		if (this.config.host !== undefined && path !== undefined) {
			const fullUrl = `http://${this.config.host}:4430/titan/${path}`

			this.log('debug', fullUrl)

			try {
				const response = await fetch(fullUrl)
				if (!response.ok) {
					this.updateStatus(InstanceStatus.ConnectionFailure, `Response code: ${response.status}`)
					return null
				} else {
					this.updateStatus(InstanceStatus.Ok)

					return await response.json()
				}
			} catch {
				this.updateStatus(InstanceStatus.ConnectionFailure)
			}
		} else {
			this.updateStatus(InstanceStatus.BadConfig)
		}

		return null
	}

	async sendCommand(path: string): Promise<boolean> {
		if (this.config.host !== undefined && path !== undefined) {
			const fullUrl = `http://${this.config.host}:4430/titan/${path}`

			try {
				const response = await fetch(fullUrl)
				if (!response.ok) {
					this.updateStatus(InstanceStatus.ConnectionFailure, `Response code: ${response.status}`)
					return false
				} else {
					this.updateStatus(InstanceStatus.Ok)

					if (!this.pollInterval) {
						// eslint-disable-next-line @typescript-eslint/no-misused-promises
						this.pollInterval = setInterval(this.pollImages.bind(this), 5000)
					}

					return true
				}
			} catch {
				this.updateStatus(InstanceStatus.ConnectionFailure)
			}
		}

		this.updateStatus(InstanceStatus.BadConfig)
		return false
	}

	async downloadImage(iconUrl: string): Promise<string> {
		const response = await fetch(iconUrl)

		if (!response.ok) {
			throw new Error()
		}

		const buffer = await response.arrayBuffer()
		return Buffer.from(buffer).toString('base64')
	}

	async pollImages(): Promise<void> {
		const handlesResponse = await fetch(`http://${this.config.host}:4430/titan/handles`)

		if (!handlesResponse.ok) {
			return
		}
		const handles: any = await handlesResponse.json()
		for (const handle of handles) {
			if (handle['icon'] !== null) {
				const userNumber = handle['userNumber']['hashCode']
				this.imageList[userNumber] = await this.downloadImage(handle['icon'])
			}
		}

		this.checkFeedbacks('image')
	}
}

runEntrypoint(ModuleInstance, getUpgradeScripts())
