export const booleanProperties = {
	blackout: { member: 'Masters.IsDeskBlackedOut', name: 'Desk blackout' },
	blind: { member: 'Programmer.BlindActive', name: 'Programmer blind mode' },
	highlight: { member: 'Programmer.Editor.Fixtures.Highlight', name: 'Fixture Highlight' },
} as const

export type BooleanState = Partial<Record<keyof typeof booleanProperties, boolean>>

// Do not turn an error envelope or the string "false" into a truthy feedback.
export function readBoolean(value: unknown): boolean | undefined {
	return typeof value === 'boolean' ? value : undefined
}
