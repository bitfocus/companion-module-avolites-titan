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
				'This module communicates with Titan using the HTTP WebAPI on port 4430. Original controls target Titan 14.0+. New common console controls are mapped against the 19.2 API; see the module help for availability and validation details.',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 8,
			regex: Regex.IP,
			default: '127.0.0.1',
		},
	]
}
