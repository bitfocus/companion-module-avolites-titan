import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	info: string
	host: string
	port: number
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value:
				'This module communicates with Titan using the HTTP WebAPI. This WebAPI is available on consoles and on Titan PC with a T2 or above.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 8,
			regex: Regex.IP,
			default: '127.0.0.1',
			required: true,
		},
		{
			type: 'number',
			id: 'port',
			label: 'Target Port',
			width: 4,
			default: 4430,
			min: 1,
			max: 65535,
			step: 1,
			required: true,
		},
	]
}
