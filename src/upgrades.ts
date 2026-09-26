import type { CompanionStaticUpgradeResult, CompanionStaticUpgradeScript } from '@companion-module/base'
import type { ModuleConfig } from './config.js'

const upgradeV2_0_0: CompanionStaticUpgradeScript<ModuleConfig> = (
	_context,
	props,
): CompanionStaticUpgradeResult<ModuleConfig> => {
	const config: any = props.config

	if (config?.IP) {
		config.host = config.IP
		delete config.IP
	}

	const changes: CompanionStaticUpgradeResult<ModuleConfig> = {
		updatedConfig: config,
		updatedActions: [],
		updatedFeedbacks: [],
	}

	return changes
}

export const getUpgradeScripts = (): CompanionStaticUpgradeScript<ModuleConfig>[] => {
	return [upgradeV2_0_0, upgradeCueListPresets, upgradeConfigPort, upgradeCueNumberVariables]
}

// Repair saved buttons created by the old GO/BACK presets without changing IDs.
const upgradeCueListPresets: CompanionStaticUpgradeScript<ModuleConfig> = (_context, props) => {
	const updatedActions = props.actions.filter(
		(action) => action.actionId === 'cuelistGo' && ['0', '1'].includes(String(action.options.cuelistaction)),
	)
	for (const action of updatedActions) {
		action.options.cuelistaction = String(action.options.cuelistaction) === '0' ? 'Play' : 'GoBack'
	}
	return { updatedConfig: null, updatedActions, updatedFeedbacks: [] }
}

const upgradeConfigPort: CompanionStaticUpgradeScript<ModuleConfig> = (_context, props) => {
	const config = props.config
	if (config) {
		config.port ??= 4430
	}
	return { updatedConfig: config, updatedActions: [], updatedFeedbacks: [] }
}

const upgradeCueNumberVariables: CompanionStaticUpgradeScript<ModuleConfig> = (_context, props) => {
	const updatedActions = props.actions.filter(
		(action) => action.actionId === 'cuelistSetNextCue' && typeof action.options.cn === 'number',
	)
	for (const action of updatedActions) action.options.cn = String(action.options.cn)
	return { updatedConfig: null, updatedActions, updatedFeedbacks: [] }
}
