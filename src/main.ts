import { runEntrypoint } from '@companion-module/base'
import { ModuleInstance } from './instance.js'
import { getUpgradeScripts } from './upgrades.js'

export { ModuleInstance } from './instance.js'
runEntrypoint(ModuleInstance, getUpgradeScripts())
