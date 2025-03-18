const { combineRgb } = require('@companion-module/base');

module.exports = {
	initPresets: function () {
		let self = this;
		let presets = [];

		// Playback at 100%
		presets.push({
			type: 'button',
			category: 'Playback',
			name: 'Playback @ 100%',
			style: {
				text: 'Playback 100%',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 128, 0)
			},
			steps: [
				{
					down: [
						{
							actionId: 'playbackAtPercentage', 
							options: {
								un: 1,
								percentage: 100,
								refire: true
							}
						}
					],
					up: []
				}
			],
			feedbacks: []
		});

		// Playback Flash ON
		presets.push({
			type: 'button',
			category: 'Playback',
			name: 'Playback Flash ON',
			style: {
				text: 'Flash ON',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(255, 0, 0)
			},
			steps: [
				{
					down: [
						{
							actionId: 'playbackFlash', 
							options: {
								un: 1,
								playbackaction: '0',
								refire: true
							}
						}
					],
					up: []
				}
			],
			feedbacks: []
		});

		// Playback Flash OFF
		presets.push({
			type: 'button',
			category: 'Playback',
			name: 'Playback Flash OFF',
			style: {
				text: 'Flash OFF',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(128, 0, 0)
			},
			steps: [
				{
					down: [
						{
							actionId: 'playbackFlash', 
							options: {
								un: 1,
								playbackaction: '1',
								refire: true
							}
						}
					],
					up: []
				}
			],
			feedbacks: []
		});

		// Cuelist GO
		presets.push({
			type: 'button',
			category: 'Cuelist',
			name: 'Cuelist GO',
			style: {
				text: 'Cuelist GO',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 255)
			},
			steps: [
				{
					down: [
						{
							actionId: 'cuelistGo', 
							options: {
								un: 1,
								cuelistaction: '0'
							}
						}
					],
					up: []
				}
			],
			feedbacks: []
		});

		// Cuelist GO BACK
		presets.push({
			type: 'button',
			category: 'Cuelist',
			name: 'Cuelist GO BACK',
			style: {
				text: 'Cuelist BACK',
				size: '14',
				color: combineRgb(255, 255, 255),
				bgcolor: combineRgb(0, 0, 128)
			},
			steps: [
				{
					down: [
						{
							actionId: 'cuelistGo', 
							options: {
								un: 1,
								cuelistaction: '1'
							}
						}
					],
					up: []
				}
			],
			feedbacks: []
		});
		
		self.setPresetDefinitions(presets);
	}
};
