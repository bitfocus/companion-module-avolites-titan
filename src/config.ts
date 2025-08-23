import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	info: string
	host: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value:
				"This module comunicates with Avolites Titan through it's HTTP WebAPI. The desk needs to be running version 14.0 or higher for the module to fully work.",
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 8,
			regex: Regex.IP,
		},
	]
}
