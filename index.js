var instance_skel = require('../../instance_skel');

/**
 * Companion instance class for Avolites Titan.
 *
 * @extends instance_skel
 * @since 1.0.0
 * @author Nijs Jonas
 * @author yyy898
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 */
class instance extends instance_skel {

	/**
	 * Create an instance of an Titan module.
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @param {string} id - the instance ID
	 * @param {Object} config - saved user configuration parameters
	 * @since 1.0.0
	 */
	constructor(system,id,config) {
		super(system,id,config);

		this.imageList = [];
		this.pollInterval;
		this.request = require('request').defaults({ encoding: null });

		this.FIELD_CLACTION = {
			type: 'dropdown',
			label: 'Action',
			id: 'cuelistaction',
			default: '0',
			choices: [
				{ label: 'GO', id: '0' },
				{ label: 'GO BACK', id: '1' }
			]
		};

		this.FIELD_CUENUMBER = {
			type: 'number',
			label: 'CueNumber',
			id: 'cn',
			default: 1,
			min: 1,
			max: 9999
		};

		this.FIELD_PERCENTAGE = {
			type: 'number',
			label: 'Percentage (0->100)',
			id: 'percentage',
			default: 100,
			min: 0,
			max: 100
		};

		this.FIELD_PLAYBACKACTION = {
			type: 'dropdown',
			label: 'ON/OFF',
			id: 'playbackaction',
			default: '0',
			choices: [
				{ label: 'ON', id: '0' },
				{ label: 'OFF', id: '1' }
			]
		};

		this.FIELD_USERNUMBER = {
			type: 'number',
			label: 'UserNumber',
			id: 'un',
			default: 1,
			min: 1,
			max: 9999
		};

		this.actions(); // export actions
		this.initFeedbacks();
	}

	/**
	 * Setup the actions.
	 *
	 * @param {EventEmitter} system - the brains of the operation
	 * @access public
	 * @since 1.0.0
	 */
	actions(system) {

		this.setActions({
			'playbackAtPercentage': {
				label: 'Playback @ Percentage',
				options: [
					this.FIELD_USERNUMBER,
					this.FIELD_PERCENTAGE
				],
				callback: (action) => {
					var percentage = action.options.percentage;
					percentage = percentage/100;
					this.sendCommand("script/2/Playbacks/FirePlaybackAtLevel?handle_userNumber=" + action.options.un + "&level_level=" + percentage + "&alwaysRefire=true");
				}
			},
			'playbackFlash': {
				label: 'Playback Flash',
				options: [
					this.FIELD_USERNUMBER,
					this.FIELD_PLAYBACKACTION
				],
				callback: (action) => {
					var percentage = "1";
					if (action.options.playbackaction == '1')
					{
						percentage = "0";
					}
					this.sendCommand("script/2/Playbacks/FirePlaybackAtLevel?handle_userNumber=" + action.options.un + "&level_level=" + percentage + "&alwaysRefire=true");
				}
			},
			'playbackSwop': {
				label: 'Playback Swop',
				options: [
					this.FIELD_USERNUMBER,
					this.FIELD_PLAYBACKACTION
				],
				callback: (action) => {
					var playbackaction = "SwopPlayback";
					if (action.options.playbackaction == '1')
					{
						playbackaction = "ClearSwopPlayback";
					}
					this.sendCommand("script/2/Playbacks/" + playbackaction + "?handle_userNumber=" + action.options.un);
				}
			},
			'cuelistGo': {
				label: 'Cuelist GO / BACK',
				options: [
					this.FIELD_USERNUMBER,
					this.FIELD_CLACTION
				],
				callback: (action) => {
					var cuelistaction = "Play";
					if (action.options.cuelistaction == '1')
					{
						cuelistaction = "GoBack";
					}
					this.sendCommand("script/2/CueLists/" + cuelistaction + "?handle_userNumber=" + action.options.un);
				}
			},
			'cuelistGoto': {
				label: 'Cuelist Go to cue',
				options: [
					this.FIELD_USERNUMBER,
					this.FIELD_CUENUMBER
				],
				callback: (action) => {
					var success = this.sendCommand("script/2/CueLists/SetNextCue?handle_userNumber=" + action.options.un + "&stepNumber=" + action.options.cn);

					if (success === true) {
						this.sendCommand("script/2/CueLists/Play?handle_userNumber=" + action.options.un);
					}
				}
			}
		});
	}

	/**
	 * Creates the configuration fields for web config.
	 *
	 * @returns {Array} the config fields
	 * @access public
	 * @since 1.0.0
	 */
	config_fields() {
		return [
			{
				type: 'text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module comunicates to avolites titan desks thru the webapi protocol, the desk needs to be running version 10.0 or higher for this to work, some features might only work with higher software versions so make sure your avolites desk is always up to date'
			},
			{
				type: 'textinput',
				id: 'IP',
				label: 'Desk IP',
				regex: this.REGEX_IP,
				width: 12
			}
		]
	}

	/**
	 * Clean up the instance before it is destroyed.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	destroy() {
		if (this.pollInterval !== undefined) {
			clearInterval(this.pollInterval);
		}

		this.debug("destroy", this.id);
	}

	/**
	 * INTERNAL: Get an image from the console for a user number
	 *
	 * @param {number} un - the user number
	 * @param {string} icon - URL of the icon to get
	 * @since 1.1.0
	 */
	getImage(un, icon) {
		this.request.get(icon, (error, response, body) => {
			if (!error && response.statusCode == 200) {
				this.imageList[un] = Buffer.from(body).toString('base64');
			}
		});
	}

	/**
	 * Main initialization function called once the module
	 * is OK to start doing things.
	 *
	 * @access public
	 * @since 1.0.0
	 */
	init() {
		this.sendCommand("get/System/SoftwareVersion");
	}

	/**
	 * INTERNAL: initialize feedbacks.
	 *
	 * @access protected
	 * @since 1.1.0
	 */
	initFeedbacks() {
		var feedbacks = {};

		feedbacks['image'] = {
			label: 'Get picture legend of playback',
			description: 'Updates the keys image to the image on your console',
			options: [
				this.FIELD_USERNUMBER
			],
			callback: (feedback, bank) => {
				if (this.imageList[feedback.options.un] !== undefined) {
					return {
						png64: this.imageList[feedback.options.un]
					}
				}
				else {
					return {
						png64: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
					}
				}
			}
		};

		this.setFeedbackDefinitions(feedbacks);
	}

	/**
	 * INTERNAL: Request the user number images
	 *
	 * @since 1.1.0
	 */
	pollImages() {
		this.request.get('http://' + this.config.IP + ':4430/titan/handles', (error, response, body) => {
			if (!error && response.statusCode == 200) {
				var jsonobj = JSON.parse(Buffer.from(body).toString());
				for (var i = 0; i < jsonobj.length; i++) {
					if(jsonobj[i]["icon"] != null) {
						this.getImage(jsonobj[i]["userNumber"]["hashCode"], jsonobj[i]["icon"])
					}
				}
			}

			this.checkFeedbacks('image');
		});
	}

	/**
	 * INTERNAL: Send a command
	 *
	 * @param {string} uri - URI of the command to send
	 * @returns {boolean} the command result
	 * @since 1.1.0
	 */
	sendCommand(uri) {
		if (this.config.IP !== undefined && uri !== undefined) {
			var cmd = "http://" + this.config.IP + ":4430/titan/" + uri;

			this.system.emit('rest_get', cmd, (err, result) => {
				if (err !== null) {
					this.status(this.STATUS_ERROR, result.error.code);
					return false;
				}
				else {
					this.status(this.STATUS_OK);

					if (this.pollInterval === undefined) {
						this.pollInterval = setInterval(this.pollImages.bind(this), 5000);
					}

					return true;
				}
			});
		}
	}

	/**
	 * Process an updated configuration array.
	 *
	 * @param {Object} config - the new configuration
	 * @access public
	 * @since 1.0.0
	 */
	updateConfig(config) {
		if (this.pollInterval !== undefined) {
			clearInterval(this.pollInterval);
		}

		this.config = config;
		this.actions();

		this.sendCommand("get/System/SoftwareVersion");
	}
}

exports = module.exports = instance;