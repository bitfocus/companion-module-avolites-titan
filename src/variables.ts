import type { ModuleInstance } from './main.js'
import { booleanProperties } from './state.js'

export function UpdateVariableDefinitions(self: ModuleInstance): void {
	self.setVariableDefinitions([
		{ variableId: 'connected', name: 'Connected (1/0)' },
		{ variableId: 'software_version', name: 'Titan software version' },
		...Object.entries(booleanProperties).map(([variableId, property]) => ({
			variableId,
			name: `${property.name} (1/0/unknown)`,
		})),
	])
}
