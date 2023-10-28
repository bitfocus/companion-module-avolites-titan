import { runEntrypoint, InstanceBase, InstanceStatus } from '@companion-module/base'
import { UpgradeScripts } from './upgrades.js'
import rest_pkg from 'node-rest-client'
const rest_client = rest_pkg.Client



/**
 * Companion instance class for Avolites Titan.
 *
 * @extends InstanceBase
 * @since 1.0.0
 * @author Nijs Jonas
 * @author yyy898
 * @author Keith Rocheck <keith.rocheck@gmail.com>
 * @author Joshua Hornig
 */
class instance extends InstanceBase {
  /**
   * Create an instance of an Titan module.
   * @param {internal} internal - reqired by update
   * @param {Object} config - saved user configuration parameters
   * @since 1.0.0
   */
  constructor (internal) {
    super(internal)
  }

  /**
   * Setup the actions.
   * @access public
   * @since 1.0.0
   */
  updateActions () {
    this.setActionDefinitions({
      playbackAtPercentage: {
        name: 'Playback @ Percentage',
        options: [
          this.FIELD_USERNUMBER,
          this.FIELD_PERCENTAGE,
          this.FIELD_ALWAYSREFIRE
        ],
        callback: async action => {
          var percentage = action.options.percentage
          percentage = percentage / 100
          this.sendCommand(
            'script/2/Playbacks/FirePlaybackAtLevel?handle_userNumber=' +
              action.options.un +
              '&level_level=' +
              percentage +
              '&alwaysRefire=' +
              action.options.refire ?? true
          )
        }
      },
      playbackFlash: {
        name: 'Playback Flash',
        options: [
          this.FIELD_USERNUMBER,
          this.FIELD_PLAYBACKACTION,
          this.FIELD_ALWAYSREFIRE
        ],
        callback: async action => {
          var percentage = '1'
          if (action.options.playbackaction == '1') {
            percentage = '0'
          }
          this.sendCommand(
            'script/2/Playbacks/FirePlaybackAtLevel?handle_userNumber=' +
              action.options.un +
              '&level_level=' +
              percentage +
              '&alwaysRefire=' +
              action.options.refire ?? true
          )
        }
      },
      playbackSwop: {
        name: 'Playback Swop',
        options: [this.FIELD_USERNUMBER, this.FIELD_PLAYBACKACTION],
        callback: async action => {
          var playbackaction = 'SwopPlayback'
          if (action.options.playbackaction == '1') {
            playbackaction = 'ClearSwopPlayback'
          }
          this.sendCommand(
            'script/2/Playbacks/' +
              playbackaction +
              '?handle_userNumber=' +
              action.options.un
          )
        }
      },
      macroExecute: {
        name: 'Macro Execute',
        options: [this.FIELD_USERNUMBER ],
        callback: async action => {
          this.sendCommand(
            'script/2/Macros/BeginRun?macroId=' +
            action.options.un
          )
        }
      },
      cuelistGo: {
        name: 'Cuelist GO / BACK',
        options: [this.FIELD_USERNUMBER, this.FIELD_CLACTION],
        callback: async action => {
          var cuelistaction = 'Play'
          if (action.options.cuelistaction == '1') {
            cuelistaction = 'GoBack'
          }
          this.sendCommand(
            'script/2/CueLists/' +
              cuelistaction +
              '?handle_userNumber=' +
              action.options.un
          )
        }
      },
      cuelistGoto: {
        name: 'Cuelist Go to cue',
        options: [this.FIELD_USERNUMBER, this.FIELD_CUENUMBER],
        callback: async action => {
          var success = this.sendCommand(
            'script/2/CueLists/SetNextCue?handle_userNumber=' +
              action.options.un +
              '&stepNumber=' +
              action.options.cn
          )

          if (success === true) {
            this.sendCommand(
              'script/2/CueLists/Play?handle_userNumber=' + action.options.un
            )
          }
        }
      }
    })
  }

  /**
   * Creates the configuration fields for web config.
   *
   * @returns {Array} the config fields
   * @access public
   * @since 1.0.0
   */
  getConfigFields () {
    return [
      {
        type: 'static-text',
        id: 'info',
        width: 12,
        label: 'Information',
        value:
          'This module comunicates to avolites titan desks thru the webapi protocol, the desk needs to be running version 10.0 or higher for this to work, some features might only work with higher software versions so make sure your avolites desk is always up to date'
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
  destroy () {
    if (this.pollInterval !== undefined) {
      clearInterval(this.pollInterval)
    }
    if (this.client) {
			delete this.client
		}

    this.debug('destroy', this.id)
  }

  

  /**
   * Main initialization function called once the module
   * is OK to start doing things.
   *
   * @access public
   * @since 1.0.0
   */

  async init (config) {
    this.config = config
    this.updateStatus('ok')
    this.imageList = [];
		this.pollInterval;
    if (this.client) {
			delete this.client
		}
    this.client = new rest_client()
		//this.request = require('request').defaults({ encoding: null });
    this.FIELD_CLACTION = {
      type: 'dropdown',
      label: 'Action',
      id: 'cuelistaction',
      default: '0',
      choices: [
        { label: 'GO', id: '0' },
        { label: 'GO BACK', id: '1' }
      ]
    }

    this.FIELD_CUENUMBER = {
      type: 'number',
      label: 'CueNumber',
      id: 'cn',
      default: 1,
      min: 1,
      max: 9999
    }

    this.FIELD_PERCENTAGE = {
      type: 'number',
      label: 'Percentage (0->100)',
      id: 'percentage',
      default: 100,
      min: 0,
      max: 100
    }

    this.FIELD_PLAYBACKACTION = {
      type: 'dropdown',
      label: 'ON/OFF',
      id: 'playbackaction',
      default: '0',
      choices: [
        { label: 'ON', id: '0' },
        { label: 'OFF', id: '1' }
      ]
    }

    this.FIELD_USERNUMBER = {
      type: 'number',
      label: 'UserNumber',
      id: 'un',
      default: 1,
      min: 1,
      max: 9999
    }

    this.FIELD_ALWAYSREFIRE = {
      type: 'checkbox',
      label: 'Always Refire',
      id: 'refire',
      default: true
    }

    this.updateActions(); // export actions
		this.initFeedbacks();
		this.sendCommand("get/System/SoftwareVersion");
  }

  /**
   * INTERNAL: initialize feedbacks.
   *
   * @access protected
   * @since 1.1.0
   */
  initFeedbacks () {
    var feedbacks = {}

    feedbacks['image'] = {
      type: 'advanced',
      name: 'Get picture legend of playback',
      description: 'Updates the keys image to the image on your console',
      options: [this.FIELD_USERNUMBER],
      callback: (feedback, bank) => {
        if (this.imageList[feedback.options.un] !== undefined) {
          return {
            png64: this.imageList[feedback.options.un]
          }
        } else {
          return {
            png64:
              'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
          }
        }
      }
    }

    this.setFeedbackDefinitions(feedbacks)
  }

  /**
   * INTERNAL: Request the user number images
   *
   * @since 1.1.0
   */
  pollImages () {
    
    let url = 'http://' + this.config.IP + ':4430/titan/handles'
    this.client.get( url,(data, response) => {
        if (!data.error && response.statusCode == 200) {
          //var jsonobj = JSON.parse(Buffer.from(data).toString())
          for (var i = 0; i < data.length; i++) {
            if (data[i]['icon'] != null) {
              this.getImage(
                data[i]['userNumber']['hashCode'],
                data[i]['icon']
              )
            }
          }
        }

        this.checkFeedbacks('image')
      }
    )
  }

  /**
   * INTERNAL: Get an image from the console for a user number
   *
   * @param {number} un - the user number
   * @param {string} icon - URL of the icon to get
   * @since 1.1.0
   */
  getImage (un, icon) {
    this.client.get(icon, (data, response) => {
      if (!data.error && response.statusCode == 200) {
        this.imageList[un] = Buffer.from(data).toString('base64')
      }
    })
  }

  /**
   * INTERNAL: Send a command
   *
   * @param {string} uri - URI of the command to send
   * @returns {boolean} the command result
   * @since 1.1.0
   */
  sendCommand (uri) {
    if (this.config.IP !== undefined && uri !== undefined) {
      let url = 'http://' + this.config.IP + ':4430/titan/' + uri

      this.client
				.get(url, (data, response) => {
					if (data.error) {
						this.log('error', data.error.message)
						this.hasError = true
					} else if (response.statusCode == 200) {
            if (this.pollInterval === undefined) {
              this.pollInterval = setInterval(this.pollImages.bind(this), 5000);
            }
					} else {
						this.log('error', data.message)
					}
				})
				.on('error', (err) => {
					let emsg = err.message
					this.log('error', emsg)
				})
    }
  }

  /**
   * Process an updated configuration array.
   *
   * @param {Object} config - the new configuration
   * @access public
   * @since 1.0.0
   */
  configUpdated (config) {
    if (this.pollInterval !== undefined) {
      clearInterval(this.pollInterval)
    }

    this.config = config
    this.actions()

    this.sendCommand('get/System/SoftwareVersion')
  }
}

//exports = module.exports = instance
runEntrypoint(instance,UpgradeScripts)