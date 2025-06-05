import type { ModuleInstance } from './main.js'
import { combineRgb, CompanionPresetDefinitions } from '@companion-module/base'

export function UpdatePresets(self: ModuleInstance): void {
	const presets: CompanionPresetDefinitions = {}

	for (const handle of self.handles) {
		switch (handle.type) {
			case 'cueListHandle':
				presets[`cueListGo-${handle.titanId}`] = {
					style: {
						text: `${handle.legend} GO`,
						size: 'auto',
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
					feedbacks: [],
					type: 'button',
					category: 'CueList GO',
					name: `${handle.legend} GO`,
					options: {},
					steps: [
						{
							down: [
								{
									actionId: 'cuelistGo',
									options: {
										un: handle.userNumber.hashCode,
										cuelistaction: '0',
									},
								},
							],
							up: [],
						},
					],
				}

				presets[`cueListBack-${handle.titanId}`] = {
					style: {
						text: `${handle.legend} BACK`,
						size: 'auto',
						color: combineRgb(255, 255, 255),
						bgcolor: combineRgb(255, 0, 0),
					},
					feedbacks: [],
					type: 'button',
					category: 'CueList BACK',
					name: `${handle.legend} BACK`,
					options: {},
					steps: [
						{
							down: [
								{
									actionId: 'cuelistGo',
									options: {
										un: handle.userNumber.hashCode,
										cuelistaction: '1',
									},
								},
							],
							up: [],
						},
					],
				}
				break
		}
	}

	self.setPresetDefinitions(presets)
}
