import type { ModuleInstance } from './main.js'
import { combineRgb, CompanionPresetDefinitions } from '@companion-module/base'

export function UpdatePresets(self: ModuleInstance): void {
	const presets: CompanionPresetDefinitions = {}
	const common = [
		{ id: 'clear', text: 'CLEAR', actionId: 'programmerClear', options: {} },
		{ id: 'locate', text: 'LOCATE', actionId: 'fixtureLocate', options: {} },
		{ id: 'full', text: 'INTENSITY FULL', actionId: 'fixtureDimmer', options: { level: 100 } },
		{ id: 'zero', text: 'INTENSITY ZERO', actionId: 'fixtureDimmer', options: { level: 0 } },
		{ id: 'next', text: 'NEXT FIXTURE', actionId: 'fixturePattern', options: { operation: 'PatternNext' } },
		{ id: 'previous', text: 'PREV FIXTURE', actionId: 'fixturePattern', options: { operation: 'PatternPrevious' } },
		{ id: 'highlight', text: 'HIGHLIGHT', actionId: 'fixtureHighlight', options: {}, feedback: 'highlight' },
		{ id: 'blind', text: 'BLIND', actionId: 'programmerBlind', options: { enabled: true }, feedback: 'blind' },
		{ id: 'live', text: 'LIVE', actionId: 'programmerBlind', options: { enabled: false } },
		{ id: 'save', text: 'AUTOSAVE', actionId: 'showAutosave', options: {} },
	]
	for (const preset of common) {
		presets[`common-${preset.id}`] = {
			type: 'button',
			category: 'Common console controls',
			name: preset.text,
			style: { text: preset.text, size: 'auto', color: combineRgb(255, 255, 255), bgcolor: combineRgb(0, 0, 0) },
			steps: [{ down: [{ actionId: preset.actionId, options: preset.options }], up: [] }],
			feedbacks: preset.feedback
				? [{ feedbackId: preset.feedback, options: { active: true }, style: { bgcolor: combineRgb(180, 0, 0) } }]
				: [],
		}
	}

	if (self.handles) {
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
											cuelistaction: 'Play',
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
											cuelistaction: 'GoBack',
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
	}

	self.setPresetDefinitions(presets)
}
