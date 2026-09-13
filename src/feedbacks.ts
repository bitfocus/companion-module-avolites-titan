import type { ModuleInstance } from './main.js'
import { USERNUMBER } from './fields.js'
import { combineRgb, type CompanionFeedbackDefinitions } from '@companion-module/base'
import { booleanProperties } from './state.js'

export function UpdateFeedbacks(self: ModuleInstance): void {
	const states: CompanionFeedbackDefinitions = {}
	for (const [id, property] of Object.entries(booleanProperties)) {
		states[id] = {
			type: 'boolean',
			name: property.name,
			description:
				'Uses the state reported by Titan. Updates approximately every 5 seconds, depending on response time.',
			defaultStyle: { color: combineRgb(255, 255, 255), bgcolor: combineRgb(180, 0, 0) },
			options: [{ type: 'checkbox', id: 'active', label: 'Active (unchecked = inactive)', default: true }],
			callback: (feedback) =>
				self.connected &&
				self.state[id as keyof typeof self.state] !== undefined &&
				self.state[id as keyof typeof self.state] === (feedback.options.active ?? true),
		}
	}
	self.setFeedbackDefinitions({
		...states,
		image: {
			type: 'advanced',
			name: 'Get image legend of playback',
			description: 'Updates the keys image to the image legend on your console',
			options: [USERNUMBER],
			callback: (feedback) => {
				if (self.imageList[feedback.options.un as any] !== undefined) {
					return {
						png64: self.imageList[feedback.options.un as any],
					}
				} else {
					return {
						png64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
					}
				}
			},
		},
	})
}
