import { InstanceBase, InstanceStatus, runEntrypoint, SomeCompanionConfigField } from '@companion-module/base'
import { GetConfigFields, type ModuleConfig } from './config.js'
import { UpdateVariableDefinitions } from './variables.js'
import { getUpgradeScripts } from './upgrades.js'
import { UpdateActions } from './actions.js'
import { UpdateFeedbacks } from './feedbacks.js'

export class ModuleInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig // Setup in init()
	imageList: { [key: string]: string } = {}
	pollInterval: NodeJS.Timeout | null = null

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.updateStatus(InstanceStatus.Ok)

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

	updateVariableDefinitions(): void {
		UpdateVariableDefinitions(this)
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
