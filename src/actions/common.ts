import type {
	CompanionActionDefinitions,
	CompanionOptionValues,
	SomeCompanionActionInputField,
} from '@companion-module/base'
import type { ModuleInstance } from '../main.js'
import { finiteNumber, handleParams, scriptPath, type Query } from '../api/commands.js'

type Options = CompanionOptionValues
type Command = { member: string; params?: Query }
type Definition = {
	id: string
	name: string
	options?: SomeCompanionActionInputField[]
	handle?: boolean
	commands: (options: Options) => Command[]
}

const number = (id: string, label: string, value: number, min = 0, max = 9999): SomeCompanionActionInputField => ({
	type: 'number',
	id,
	label,
	default: value,
	min,
	max,
})
const checkbox = (id: string, label: string, value = false): SomeCompanionActionInputField => ({
	type: 'checkbox',
	id,
	label,
	default: value,
})
const text = (id: string, label: string, value: string): SomeCompanionActionInputField => ({
	type: 'textinput',
	id,
	label,
	default: value,
	useVariables: true,
})
const dropdown = (id: string, label: string, choices: [string, string][]): SomeCompanionActionInputField => ({
	type: 'dropdown',
	id,
	label,
	default: choices[0][0],
	choices: choices.map(([id, label]) => ({ id, label })),
})
const level = number('level', 'Level (%)', 100, 0, 100)
const fade = number('fade', 'Fade time (seconds)', 0)
const handleFields: SomeCompanionActionInputField[] = [
	dropdown('handleMode', 'Identify by', [
		['userNumber', 'User number'],
		['titanId', 'Titan ID'],
		['location', 'Location'],
	]),
	text('handle', 'Handle (user number, Titan ID or location such as playback_2_1)', '1'),
]
const n = (o: Options, id: string, min = 0, max = 9999): number => finiteNumber(o[id], min, max)
const b = (o: Options, id: string): boolean => {
	if (typeof o[id] !== 'boolean') throw new Error(`Invalid ${id}`)
	return o[id]
}
const choice = (o: Options, id: string, values: string[]): string => {
	const value = String(o[id])
	if (!values.includes(value)) throw new Error(`Invalid ${id}`)
	return value
}
const one = (member: string, params?: Query): Command[] => [{ member, params }]
const handle = (o: Options): Query => handleParams(o.handleMode, o.handle)
const fixed = (id: string, name: string, member: string, withHandle = false): Definition => ({
	id,
	name,
	handle: withHandle,
	commands: (o) => one(member, withHandle ? handle(o) : {}),
})

export const commonActions: Definition[] = [
	{
		id: 'programmerClear',
		name: 'Programmer: Clear all fixtures and selection',
		options: [
			checkbox('presets', 'Also zero preset faders'),
			checkbox('allProgrammers', 'Also clear other users / remote programmers'),
		],
		commands: (o) =>
			one('Programmer.Editor.ClearAll', { presets: b(o, 'presets'), allProgrammers: b(o, 'allProgrammers') }),
	},
	fixed('selectionClear', 'Fixtures: Deselect all (keep programmer values)', 'Programmer.Editor.Selection.Clear'),
	fixed('fixtureSelect', 'Fixtures: Select fixture', 'Programmer.Editor.Selection.SelectFixture', true),
	fixed('groupRecall', 'Groups: Recall group selection', 'Group.RecallGroup', true),
	{
		id: 'fixtureLocate',
		name: 'Fixtures: Locate selected fixtures',
		options: [checkbox('allAttributes', 'Locate all attributes (ignore locate mask)', true)],
		commands: (o) => one('Programmer.Editor.Fixtures.LocateSelectedFixtures', { allAttributes: b(o, 'allAttributes') }),
	},
	fixed(
		'fixtureLocateDimmer',
		'Fixtures: Locate dimmer only',
		'Programmer.Editor.Fixtures.LocateSelectedFixturesDimmer',
	),
	fixed(
		'fixtureLocateBlack',
		'Fixtures: Locate without light (Locate Black)',
		'Programmer.Editor.Fixtures.LocateBlack',
	),
	{
		id: 'fixtureDimmer',
		name: 'Fixtures: Set selected fixture intensity',
		options: [level],
		commands: (o) => one('Programmer.Editor.Fixtures.SetDimmerLevel', { level: n(o, 'level', 0, 100) }),
	},
	fixed('fixtureHighlight', 'Fixtures: Toggle Highlight', 'Programmer.Editor.Fixtures.ToggleHighlight'),
	{
		id: 'fixturePattern',
		name: 'Fixtures: Next / previous / all in selection',
		options: [
			dropdown('operation', 'Selection', [
				['PatternNext', 'Next'],
				['PatternPrevious', 'Previous'],
				['ClearPatternSelect', 'All (clear pattern)'],
				['InvertPattern', 'Invert pattern'],
			]),
		],
		commands: (o) =>
			one(
				`Programmer.Editor.Selection.${choice(o, 'operation', ['PatternNext', 'PatternPrevious', 'ClearPatternSelect', 'InvertPattern'])}`,
			),
	},
	{
		id: 'fixtureAttribute',
		name: 'Fixtures: Set selected attribute value',
		options: [text('attribute', 'Titan attribute ID (for example PAN)', 'PAN'), text('value', 'Display value', '0')],
		commands: (o: Options): Command[] => {
			const attributeId = String(o.attribute).trim()
			const stringValue = String(o.value).trim()
			if (!attributeId || !stringValue) throw new Error('Attribute and value are required')
			return one('Programmer.Editor.Fixtures.SetSelectedAttributesValue', { attributeId, stringValue })
		},
	},
	{
		id: 'programmerBlind',
		name: 'Programmer: Set Blind / Live',
		options: [
			checkbox('enabled', 'Blind mode', true),
			checkbox('setChangesLive', 'Send blind changes live on exit'),
			fade,
			number('overlap', 'Fixture overlap (%)', 100, 0, 100),
		],
		commands: (o) =>
			one('Programmer.SetBlind', {
				enabled: b(o, 'enabled'),
				setChangesLive: b(o, 'setChangesLive'),
				fadeTime: n(o, 'fade'),
				fixtureOverlap: n(o, 'overlap', 0, 100),
			}),
	},
	{
		id: 'paletteRecall',
		name: 'Palettes: Recall palette',
		handle: true,
		options: [checkbox('usePaletteTimes', 'Use recorded palette times', true)],
		commands: (o) => one('Palette.ApplyPalette', { ...handle(o), usePaletteTimes: b(o, 'usePaletteTimes') }),
	},
	{
		id: 'paletteQuick',
		name: 'Palettes: Fire quick palette (busking)',
		handle: true,
		options: [checkbox('usePaletteTimes', 'Use recorded palette times', true)],
		commands: (o) => one('Palette.ApplyQuickPalette', { ...handle(o), usePaletteTimes: b(o, 'usePaletteTimes') }),
	},
	{
		id: 'paletteTimed',
		name: 'Palettes: Recall palette with fade time',
		handle: true,
		options: [fade],
		commands: (o) => [
			...one('Palette.SetFadeTimeFromFloat', { value: n(o, 'fade') }),
			...one('Palette.ApplyTimedPalette', handle(o)),
		],
	},
	{
		id: 'chaseControl',
		name: 'Chases: Play / back / step / snap back',
		handle: true,
		options: [
			dropdown('operation', 'Operation', [
				['Play', 'Play'],
				['GoBack', 'Go back'],
				['NextStep', 'Next step'],
				['CutNextCueToLive', 'Cut next cue to live'],
				['SnapBack', 'Snap back'],
			]),
		],
		commands: (o) =>
			one(
				`Chases.${choice(o, 'operation', ['Play', 'GoBack', 'NextStep', 'CutNextCueToLive', 'SnapBack'])}`,
				handle(o),
			),
	},
	{
		id: 'chasePause',
		name: 'Chases: Pause',
		handle: true,
		options: [checkbox('goBackIfPaused', 'Go back if already paused')],
		commands: (o) => one('Chases.Pause', { ...handle(o), goBackIfPaused: b(o, 'goBackIfPaused') }),
	},
	{
		id: 'chaseSetNextCue',
		name: 'Chases: Set next step',
		handle: true,
		options: [number('step', 'Step number', 1, 1)],
		commands: (o) => one('Chases.SetNextCue', { ...handle(o), stepNumber: n(o, 'step', 1) }),
	},
	{
		id: 'chaseCrossfade',
		name: 'Chases: Set crossfade',
		handle: true,
		options: [number('crossfade', 'Crossfade (%)', 100, 0, 100)],
		commands: (o) => one('Chases.SetXFade', { ...handle(o), crossfade: n(o, 'crossfade', 0, 100) / 100 }),
	},
	fixed('chaseTapConnected', 'Chases: Tap tempo of connected chase', 'Chases.ConnectedChaseTap'),
	{
		id: 'cuelistPause',
		name: 'Cue lists: Pause',
		handle: true,
		options: [checkbox('goBackIfPaused', 'Go back if already paused')],
		commands: (o) => one('CueLists.Pause', { ...handle(o), goBackIfPaused: b(o, 'goBackIfPaused') }),
	},
	{
		id: 'cuelistResume',
		name: 'Cue lists: Resume with fade time',
		handle: true,
		options: [fade],
		commands: (o) => one('CueLists.Resume', { ...handle(o), time: n(o, 'fade') }),
	},
	{
		id: 'cuelistGoWithTime',
		name: 'Cue lists: Go with override fade time',
		handle: true,
		options: [fade],
		commands: (o) => one('CueLists.PlayWithTime', { ...handle(o), time: n(o, 'fade') }),
	},
	fixed('cuelistCut', 'Cue lists: Cut next cue to live', 'CueLists.CutNextCueToLive', true),
	fixed('cuelistReset', 'Cue lists: Reset next step', 'CueLists.ResetNextStep', true),
	fixed('playbackConnect', 'Playbacks: Connect playback to console controls', 'ConnectedPlayback.Connect', true),
	fixed('playbackDisconnect', 'Playbacks: Disconnect console controls', 'ConnectedPlayback.Disconnect'),
	fixed('playbackBlind', 'Playbacks: Toggle blind playback', 'Playbacks.ToggleBlindPlayback', true),
	{
		id: 'playbackEffectSpeed',
		name: 'Playbacks: Set effect speed multiplier',
		handle: true,
		options: [number('multiplier', 'Multiplier (1 = normal)', 1, 0, 100)],
		commands: (o) => one('Playbacks.SetEffectSpeedMultiplier', { ...handle(o), level: n(o, 'multiplier', 0, 100) }),
	},
	{
		id: 'masterLevel',
		name: 'Masters: Set master level',
		handle: true,
		options: [level],
		commands: (o) => one('Masters.SetMaster', { ...handle(o), value_level: n(o, 'level', 0, 100) / 100 }),
	},
	{
		id: 'masterSpeed',
		name: 'Masters: Set speed master value',
		handle: true,
		options: [number('speed', 'Speed (direct value in the master’s units)', 120, 0, 1000)],
		commands: (o) => one('Masters.SetSpeed', { ...handle(o), value: n(o, 'speed', 0, 1000) }),
	},
	{
		id: 'masterMultiply',
		name: 'Masters: Double / halve speed multiplier',
		handle: true,
		options: [checkbox('doubling', 'Double (unchecked = halve)', true)],
		commands: (o) => one('Masters.DoubleOrHalfSpeedMultiplier', { ...handle(o), doubling: b(o, 'doubling') }),
	},
	fixed('masterResetMultiplier', 'Masters: Reset speed multiplier', 'Masters.ResetSpeedMultiplier', true),
	fixed('masterReset', 'Masters: Reset master', 'Masters.ResetMaster', true),
	fixed('workspaceRecall', 'Workspaces: Recall saved workspace', 'Workspace.ApplyRecordedRecallBehaviour', true),
	{
		id: 'playbackPage',
		name: 'Pages: Set playback roller page (1–10)',
		options: [text('group', 'Handle group', 'Playbacks'), number('page', 'Page', 1, 1, 10)],
		commands: (o: Options): Command[] => {
			const group = String(o.group).trim()
			const page = n(o, 'page', 1, 10)
			if (!group || !Number.isInteger(page)) throw new Error('Enter a handle group and whole page number')
			return one('Handles.ChangePlaybackPage', { group, level: page })
		},
	},
	fixed('showAutosave', 'Show: Save an autosave copy now', 'Show.SaveAutoSave'),
]

export function getCommonActions(self: ModuleInstance): CompanionActionDefinitions {
	return Object.fromEntries(
		commonActions.map((definition) => [
			definition.id,
			{
				name: definition.name,
				options: [...(definition.handle ? handleFields : []), ...(definition.options ?? [])],
				callback: async (action) => {
					try {
						const options = { ...action.options }
						for (const field of [...(definition.handle ? handleFields : []), ...(definition.options ?? [])]) {
							if ('default' in field) options[field.id] ??= field.default
							if (field.type === 'textinput')
								options[field.id] = await self.parseVariablesInString(String(options[field.id] ?? ''))
						}
						await self.sendCommands(
							definition.commands(options).map(({ member, params }) => scriptPath(member, params)),
						)
					} catch (error) {
						self.log('error', `${definition.name}: ${error instanceof Error ? error.message : String(error)}`)
					}
				},
			},
		]),
	)
}
