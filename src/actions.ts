import type { ModuleInstance } from './main.js'
import {
	CompanionInputFieldCheckbox,
	CompanionInputFieldDropdown,
	CompanionInputFieldNumber,
} from '@companion-module/base'

export const FIELD_CLACTION: CompanionInputFieldDropdown = {
	type: 'dropdown',
	label: 'Action',
	id: 'cuelistaction',
	default: '0',
	choices: [
		{ label: 'GO', id: '0' },
		{ label: 'GO BACK', id: '1' },
	],
}

export const FIELD_CUENUMBER: CompanionInputFieldNumber = {
	type: 'number',
	label: 'CueNumber',
	id: 'cn',
	default: 1,
	min: 1,
	max: 9999,
}

export const FIELD_FADETIME: CompanionInputFieldNumber = {
	type: 'number',
	label: 'FadeTime',
	id: 'ft',
	default: 0,
	min: 0,
	max: 9999,
	tooltip: "Will be ignored if 'Use master fade time' is ticked",
}

export const FIELD_USERMASTERFADETIME: CompanionInputFieldCheckbox = {
	type: 'checkbox',
	label: 'Use master fade time',
	id: 'masterft',
	default: true,
}

export const FIELD_PERCENTAGE: CompanionInputFieldNumber = {
	type: 'number',
	label: 'Percentage (0->100)',
	id: 'percentage',
	default: 100,
	min: 0,
	max: 100,
}

export const FIELD_PLAYBACKACTION: CompanionInputFieldDropdown = {
	type: 'dropdown',
	label: 'ON/OFF',
	id: 'playbackaction',
	default: '0',
	choices: [
		{ label: 'ON', id: '0' },
		{ label: 'OFF', id: '1' },
	],
}

export const FIELD_USERNUMBER: CompanionInputFieldNumber = {
	type: 'number',
	label: 'UserNumber',
	id: 'un',
	default: 1,
	min: 1,
	max: 9999,
}

export const FIELD_ALWAYSREFIRE: CompanionInputFieldCheckbox = {
	type: 'checkbox',
	label: 'Always Refire',
	id: 'refire',
	default: true,
}

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		playbackAtPercentage: {
			name: 'Playback @ Percentage',
			options: [FIELD_USERNUMBER, FIELD_PERCENTAGE, FIELD_ALWAYSREFIRE],
			callback: async (action): Promise<void> => {
				const percentage = action.options.percentage ?? 100 / 100
				await self.sendCommand(
					`script/2/Playbacks/FirePlaybackAtLevel?handle_userNumber=${action.options.un}&level_level=${percentage}&alwaysRefire=${action.options.refire ?? true}`,
				)
			},
		},
		playbackFlash: {
			name: 'Playback Flash',
			options: [FIELD_USERNUMBER, FIELD_PLAYBACKACTION, FIELD_ALWAYSREFIRE],
			callback: async (action) => {
				let percentage = '1'
				if (action.options.playbackaction == '1') {
					percentage = '0'
				}
				await self.sendCommand(
					`script/2/Playbacks/FirePlaybackAtLevel?handle_userNumber=${action.options.un}&level_level=${percentage}&alwaysRefire=${action.options.refire ?? true}`,
				)
			},
		},
		playbackSwop: {
			name: 'Playback Swop',
			options: [FIELD_USERNUMBER, FIELD_PLAYBACKACTION],
			callback: async (action) => {
				let playbackaction = 'SwopPlayback'
				if (action.options.playbackaction == '1') {
					playbackaction = 'ClearSwopPlayback'
				}
				await self.sendCommand(`script/2/Playbacks/${playbackaction}?handle_userNumber=${action.options.un}`)
			},
		},
		cuelistGo: {
			name: 'Cuelist GO / BACK',
			options: [FIELD_USERNUMBER, FIELD_CLACTION],
			callback: async (action) => {
				let cuelistaction = 'Play'
				if (action.options.cuelistaction == '1') {
					cuelistaction = 'GoBack'
				}
				await self.sendCommand('script/2/CueLists/' + cuelistaction + '?handle_userNumber=' + action.options.un)
			},
		},
		cuelistGoto: {
			name: 'Cuelist Go to cue',
			options: [FIELD_USERNUMBER, FIELD_CUENUMBER],
			callback: async (action) => {
				const success = await self.sendCommand(
					`script/2/CueLists/SetNextCue?handle_userNumber=${action.options.un}&stepNumber=${action.options.cn}`,
				)

				if (success) {
					await self.sendCommand(`script/2/CueLists/Play?handle_userNumber=${action.options.un}`)
				}
			},
		},
		releasePlayback: {
			name: 'Release playback',
			options: [FIELD_USERNUMBER, FIELD_FADETIME, FIELD_USERMASTERFADETIME],
			callback: async (action): Promise<void> => {
				await self.sendCommand(
					`script/2/Playbacks/ReleasePlayback?handle_userNumber=${action.options.un}&fadeTime=${action.options.ft}&useMasterReleaseTime=${action.options.masterft}`,
				)
			},
		},
		releaseAllPlaybacks: {
			name: 'Release all playbacks',
			options: [FIELD_FADETIME, FIELD_USERMASTERFADETIME],
			callback: async (action): Promise<void> => {
				await self.sendCommand(
					`script/2/Playbacks/ReleaseAllPlaybacks?fadeTime=${action.options.ft}&useMasterReleaseTime=${action.options.masterft}`,
				)
			},
		},
	})
}
