module.exports = {
	initActions: function () {
		let self = this;
		let actions = {};

		// Playback at Percentage
		actions.playbackAtPercentage = {
			name: 'Playback @ Percentage',
			options: [
				{
					type: 'number',
					label: 'User Number',
					id: 'un',
					default: 1,
					min: 1,
					max: 9999
				},
				{
					type: 'number',
					label: 'Percentage (0-100)',
					id: 'percentage',
					default: 100,
					min: 0,
					max: 100
				},
				{
					type: 'checkbox',
					label: 'Always Refire',
					id: 'refire',
					default: true
				}
			],
			callback: async function (action) { 
				let percentage = action.options.percentage / 100;
				await self.sendCommand(`script/2/Playbacks/FirePlaybackAtLevel?handle_userNumber=${action.options.un}&level_level=${percentage}&alwaysRefire=${action.options.refire ?? true}`); 
			}
		};

		// Playback Flash
		actions.playbackFlash = {
			name: 'Playback Flash',
			options: [
				{
					type: 'number',
					label: 'User Number',
					id: 'un',
					default: 1,
					min: 1,
					max: 9999
				},
				{
					type: 'dropdown',
					label: 'ON/OFF',
					id: 'playbackaction',
					default: '0',
					choices: [
						{ label: 'ON', id: '0' },
						{ label: 'OFF', id: '1' }
					]
				},
				{
					type: 'checkbox',
					label: 'Always Refire',
					id: 'refire',
					default: true
				}
			],
			callback: async function (action) {
				let percentage = action.options.playbackaction === '1' ? "0" : "1";
				await self.sendCommand(`script/2/Playbacks/FirePlaybackAtLevel?handle_userNumber=${action.options.un}&level_level=${percentage}&alwaysRefire=${action.options.refire ?? true}`); 
			}
		};

		// Playback Swop
		actions.playbackSwop = {
			name: 'Playback Swop',
			options: [
				{
					type: 'number',
					label: 'User Number',
					id: 'un',
					default: 1,
					min: 1,
					max: 9999
				},
				{
					type: 'dropdown',
					label: 'Action',
					id: 'playbackaction',
					default: '0',
					choices: [
						{ label: 'Swop', id: '0' },
						{ label: 'Clear Swop', id: '1' }
					]
				}
			],
			callback: async function (action) {
				let playbackaction = action.options.playbackaction === '1' ? "ClearSwopPlayback" : "SwopPlayback";
				await self.sendCommand(`script/2/Playbacks/${playbackaction}?handle_userNumber=${action.options.un}`);
			}
		};

		// Cuelist Go / Back
		actions.cuelistGo = {
			name: 'Cuelist GO / BACK',
			options: [
				{
					type: 'number',
					label: 'User Number',
					id: 'un',
					default: 1,
					min: 1,
					max: 9999
				},
				{
					type: 'dropdown',
					label: 'Action',
					id: 'cuelistaction',
					default: '0',
					choices: [
						{ label: 'GO', id: '0' },
						{ label: 'GO BACK', id: '1' }
					]
				}
			],
			callback: async function (action) {
				let cuelistaction = action.options.cuelistaction === '1' ? "GoBack" : "Play";
				await self.sendCommand(`script/2/CueLists/${cuelistaction}?handle_userNumber=${action.options.un}`); 
			}
		};

		// Cuelist Go to Cue
		actions.cuelistGoto = {
			name: 'Cuelist Go to cue',
			options: [
				{
					type: 'number',
					label: 'User Number',
					id: 'un',
					default: 1,
					min: 1,
					max: 9999
				},
				{
					type: 'number',
					label: 'Cue Number',
					id: 'cn',
					default: 1,
					min: 1,
					max: 9999
				}
			],
			callback: async function (action) {
				let success = await self.sendCommand(`script/2/CueLists/SetNextCue?handle_userNumber=${action.options.un}&stepNumber=${action.options.cn}`);
				if (success === true) {
					await self.sendCommand(`script/2/CueLists/Play?handle_userNumber=${action.options.un}`);
				}
			}
		};

		self.setActionDefinitions(actions);
	},

};
