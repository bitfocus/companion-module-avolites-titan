import {
	CompanionInputFieldCheckbox,
	CompanionInputFieldDropdown,
	CompanionInputFieldNumber,
} from '@companion-module/base'

export const CLACTION: CompanionInputFieldDropdown = {
	type: 'dropdown',
	label: 'Action',
	id: 'cuelistaction',
	default: '0',
	choices: [
		{ label: 'GO', id: '0' },
		{ label: 'GO BACK', id: '1' },
	],
}

export const CUENUMBER: CompanionInputFieldNumber = {
	type: 'number',
	label: 'CueNumber',
	id: 'cn',
	default: 1,
	min: 1,
	max: 9999,
}

export const FADETIME: CompanionInputFieldNumber = {
	type: 'number',
	label: 'FadeTime',
	id: 'ft',
	default: 0,
	min: 0,
	max: 9999,
	tooltip: "Will be ignored if 'Use master fade time' is ticked",
}

export const USERMASTERFADETIME: CompanionInputFieldCheckbox = {
	type: 'checkbox',
	label: 'Use master fade time',
	id: 'masterft',
	default: true,
}

export const PERCENTAGE: CompanionInputFieldNumber = {
	type: 'number',
	label: 'Percentage (0->100)',
	id: 'percentage',
	default: 100,
	min: 0,
	max: 100,
}

export const PLAYBACKACTION: CompanionInputFieldDropdown = {
	type: 'dropdown',
	label: 'ON/OFF',
	id: 'playbackaction',
	default: '0',
	choices: [
		{ label: 'ON', id: '0' },
		{ label: 'OFF', id: '1' },
	],
}

export const USERNUMBER: CompanionInputFieldNumber = {
	type: 'number',
	label: 'UserNumber',
	id: 'un',
	default: 1,
	min: 1,
	max: 9999,
}

export const ALWAYSREFIRE: CompanionInputFieldCheckbox = {
	type: 'checkbox',
	label: 'Always Refire',
	id: 'refire',
	default: true,
}

export const BOSTATE: CompanionInputFieldCheckbox = {
	type: 'checkbox',
	label: 'Blackout state',
	tooltip: 'If checked blackout will be enabled',
	id: 'bo',
	default: true,
}
