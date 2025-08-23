import type { ModuleInstance } from './main.js'
import * as fields from './fields.js'

export function UpdateActions(self: ModuleInstance): void {
	self.setActionDefinitions({
		playbackAtPercentage: {
			name: 'Playback @ Percentage',
			options: [fields.USERNUMBER, fields.PERCENTAGE, fields.ALWAYSREFIRE],
			callback: async (action): Promise<void> => {
				const percentage = action.options.percentage ?? 100 / 100
				await self.sendCommand(
					`script/2/Playbacks/FirePlaybackAtLevel?handle_userNumber=${action.options.un}&level_level=${percentage}&alwaysRefire=${action.options.refire ?? true}`,
				)
			},
		},
		playbackFlash: {
			name: 'Playback Flash',
			options: [fields.USERNUMBER, fields.PLAYBACKACTION, fields.ALWAYSREFIRE],
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
			options: [fields.USERNUMBER, fields.PLAYBACKACTION],
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
			options: [fields.USERNUMBER, fields.CLACTION],
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
			options: [fields.USERNUMBER, fields.CUENUMBER],
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
			options: [fields.USERNUMBER, fields.FADETIME, fields.USERMASTERFADETIME],
			callback: async (action): Promise<void> => {
				await self.sendCommand(
					`script/2/Playbacks/ReleasePlayback?handle_userNumber=${action.options.un}&fadeTime=${action.options.ft}&useMasterReleaseTime=${action.options.masterft}`,
				)
			},
		},
		releaseAllPlaybacks: {
			name: 'Release all playbacks',
			options: [fields.FADETIME, fields.USERMASTERFADETIME],
			callback: async (action): Promise<void> => {
				await self.sendCommand(
					`script/2/Playbacks/ReleaseAllPlaybacks?fadeTime=${action.options.ft}&useMasterReleaseTime=${action.options.masterft}`,
				)
			},
		},
		recallMacro: {
			name: 'Recall macro',
			options: [fields.USERNUMBER],
			callback: async (action): Promise<void> => {
				await self.sendCommand(`script/2/UserMacros/RecallMacro?handle_userNumber=${action.options.un}`)
			},
		},
		blackoutDesk: {
			name: 'Blackout desk',
			options: [fields.BOSTATE],
			callback: async (action): Promise<void> => {
				await self.sendCommand(`script/2/Masters/BlackOutDesk?deskBlackOutState=${action.options.bo}`)
			},
		},
		setGrandMasterFaderLevel: {
			name: 'Set grand master fader level',
			options: [fields.PERCENTAGE],
			callback: async (action): Promise<void> => {
				await self.sendCommand(`script/2/Masters/SetGrandMasterFaderLevel?oldValue=&value=${action.options.percentage}`)
				console.log(`script/2/Masters/SetGrandMasterFaderLevel?oldValue=&value=${action.options.percentage}`)
			},
		},
	})
}
