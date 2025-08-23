import {
	CompanionInputFieldCheckbox,
	CompanionInputFieldDropdown,
	CompanionInputFieldNumber,
} from '@companion-module/base'

export const CLACTION: CompanionInputFieldDropdown = {
	type: 'dropdown',
	label: 'Action',
	id: 'cuelistaction',
	default: 'Play',
	choices: [
		{ label: 'Go', id: 'Play' },
		{ label: 'Go Back', id: 'GoBack' },
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
	label: 'On/Off',
	id: 'playbackaction',
	default: 'on',
	choices: [
		{ label: 'On', id: 'on' },
		{ label: 'Off', id: 'off' },
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

export const AUTOFIRE: CompanionInputFieldCheckbox = {
	type: 'checkbox',
	label: 'Fire next cue automatically',
	tooltip: 'If checked the next cue will be selected then fired',
	id: 'af',
	default: true,
}

export const ADV_DECR: CompanionInputFieldDropdown = {
	type: 'dropdown',
	label: 'Action',
	id: 'adv_decr',
	default: 'AdvanceNextStep',
	choices: [
		{ label: 'Next', id: 'AdvanceNextStep' },
		{ label: 'Previous', id: 'DecrementNextStep' },
	],
}
