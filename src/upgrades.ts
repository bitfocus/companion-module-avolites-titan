import type { CompanionStaticUpgradeResult, CompanionStaticUpgradeScript } from '@companion-module/base'
import type { ModuleConfig } from './config.js'

const upgradeV2_0_0: CompanionStaticUpgradeScript<ModuleConfig> = (
	_context,
	props,
): CompanionStaticUpgradeResult<ModuleConfig> => {
	const config: any = props.config

	if (config.IP) {
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
	return [upgradeV2_0_0]
}
