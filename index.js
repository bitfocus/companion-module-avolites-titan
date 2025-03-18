const { InstanceBase, InstanceStatus, runEntrypoint } = require('@companion-module/base');
const UpgradeScripts = require('./src/upgrades');

const config = require('./src/config');
const actions = require('./src/actions');
const feedbacks = require('./src/feedbacks');
const variables = require('./src/variables');
const presets = require('./src/presets');
const utils = require('./src/utils');

/**
 * Companion instance class for Avolites Titan.
 *
 * @since 1.0.0
 * @author Nijs Jonas
 * @author yyy898
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 * @author Marcus Berntzen Johansen <marberjoh07@gmail.com>
 */
class titanInstance extends InstanceBase {
	constructor(internal) {
		super(internal);

		Object.assign(this, {
			...config,
			...actions,
			...feedbacks,
			...variables,
			...presets,
			...utils,
		})
	};

	async destroy() {
		try {
			this.log('debug', 'Destroying instance...');
			if (this.pollInterval !== undefined) {
				clearInterval(this.pollInterval);
			}
		} catch (error) {
			this.log('error', `Error during destroy: ${error.message}`);
		}
	}

	async init(config) {
		try {
			if (!config) {
				throw new Error('Config is undefined in init()');
			}

			this.log('debug', `Initializing with config: ${JSON.stringify(config)}`);
			await this.configUpdated(config);
		} catch (error) {
			this.log('error', `Initialization failed: ${error.message}`);
			this.updateStatus(InstanceStatus.Error, error.message); 
		}
	}

	async configUpdated(config) {
		try {
			if (!config) {
				throw new Error('Config is undefined in configUpdated()');
			}

			this.config = config;
			this.log('debug', `Config updated: ${JSON.stringify(config)}`);

			this.sendCommand("get/System/SoftwareVersion");

			this.initActions();
			this.initFeedbacks();
			this.initVariables();
			this.initPresets();

			this.log('info', 'Instance successfully updated');

			if (this.config.precision) {
				this.precision = parseInt(this.config.precision);
				if (isNaN(this.precision)) {
					throw new Error('Invalid precision value');
				}
				this.log('debug', `Precision set to: ${this.precision}`);
			}
		} catch (error) {
			this.log('error', `Config update failed: ${error.message}`);
			this.updateStatus(InstanceStatus.Error, error.message);
		}
	}
}

runEntrypoint(titanInstance, UpgradeScripts);
