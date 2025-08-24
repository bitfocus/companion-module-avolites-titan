import {
	CompanionInputFieldCheckbox,
	CompanionInputFieldDropdown,
	CompanionInputFieldNumber,
	CompanionInputFieldTextInput,
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
	label: 'Cue number',
	id: 'cn',
	default: 1,
	min: 1,
	max: 9999,
}

export const FADETIME: CompanionInputFieldNumber = {
	type: 'number',
	label: 'Fade time',
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

export const ONOFF: CompanionInputFieldDropdown = {
	type: 'dropdown',
	label: 'On/Off',
	id: 'onoff',
	default: 'on',
	choices: [
		{ label: 'On', id: 'on' },
		{ label: 'Off', id: 'off' },
	],
}

export const USERNUMBER: CompanionInputFieldNumber = {
	type: 'number',
	label: 'User number',
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

export const BOSTATE: CompanionInputFieldDropdown = {
	type: 'dropdown',
	label: 'Blackout state',
	tooltip: 'If checked blackout will be enabled',
	id: 'bo',
	default: 'true',
	choices: [
		{ label: 'Enable', id: 'true' },
		{ label: 'Disable', id: 'false' },
	],
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

export const RESETIFPLAYING: CompanionInputFieldCheckbox = {
	type: 'checkbox',
	label: 'Reset if playing',
	tooltip: 'If checked the timeline will be reset if it is already playing',
	id: 'resetifplaying',
	default: true,
}

export const PASSWORD: CompanionInputFieldTextInput = {
	type: 'textinput',
	label: 'Password',
	id: 'password',
	default: '1234',
	tooltip: 'Master password is 68340. Use it if you want the unlock to work all the time.',
}

export const LOCK_ACTION: CompanionInputFieldDropdown = {
	type: 'dropdown',
	label: 'Lock action',
	id: 'lock_action',
	default: 'LockConsole',
	choices: [
		{ label: 'Lock', id: 'LockConsole' },
		{ label: 'Unlock', id: 'UnlockConsole' },
	],
}

export const TIMELINE_ACTION: CompanionInputFieldDropdown = {
	type: 'dropdown',
	label: 'Action',
	id: 'timeline_action',
	default: 'PlayTimeline',
	choices: [
		{ label: 'Play', id: 'PlayTimeline' },
		{ label: 'Play (reset)', id: 'PlayResetTimeline' },
		{ label: 'Pause', id: 'PauseTimeline' },
		{ label: 'Reset', id: 'ResetTimeline' },
		{ label: 'Stop', id: 'StopTimeline' },
		{ label: 'Release', id: 'ReleaseTimeline' },
	],
}

export const TIMECODE_SELECT: CompanionInputFieldDropdown = {
	type: 'dropdown',
	label: 'Select',
	id: 'tc_select',
	default: 'TimecodeOne',
	choices: [
		{ label: 'Timecode One', id: 'TimecodeOne' },
		{ label: 'Timecode Two', id: 'TimecodeTwo' },
		{ label: 'Timecode Three', id: 'TimecodeThree' },
		{ label: 'Timecode Four', id: 'TimecodeFour' },
	],
}

export const TIMECODE_ACTION: CompanionInputFieldDropdown = {
	type: 'dropdown',
	label: 'Action',
	id: 'tc_action',
	default: 'Play',
	choices: [
		{ label: 'Play', id: 'Play' },
		{ label: 'Pause', id: 'Pause' },
		{ label: 'Reset', id: 'Reset' },
	],
}

export const TIMECODE_SOURCE: CompanionInputFieldDropdown = {
	type: 'dropdown',
	label: 'Timecode Source',
	id: 'tc_source',
	default: 'Internal',
	choices: [
		{ label: 'Internal', id: 'Internal' },
		{ label: 'MIDI', id: 'UsbExpert' },
		{ label: 'Winamp', id: 'Winamp' },
		{ label: 'Clock', id: 'System' },
		{ label: 'SMPTE', id: 'Smpte' },
	],
}
