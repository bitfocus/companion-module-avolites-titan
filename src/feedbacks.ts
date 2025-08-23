import type { ModuleInstance } from './main.js'
import { USERNUMBER } from './fields.js'

export function UpdateFeedbacks(self: ModuleInstance): void {
	self.setFeedbackDefinitions({
		image: {
			type: 'advanced',
			name: 'Get picture legend of playback',
			description: 'Updates the keys image to the image on your console',
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
