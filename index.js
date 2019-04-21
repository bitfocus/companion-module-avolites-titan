var instance_skel = require('../../instance_skel');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.config = config;
	self.actions();
	if (self.config.IP !== undefined) {
		var cmd = "http://" + self.config.IP + ":4430/titan/get/System/SoftwareVersion";
		self.system.emit('rest_get', cmd, function (err, result) {
			if (err !== null) {
				self.status(self.STATUS_ERROR, result.error.code);
			}
			else {
				self.status(self.STATUS_OK);
			}
	});	}
}
// Choices
instance.prototype.CHOICES_CUELIST = [
	{ label: 'GO', id: '0' },
	{ label: 'GO BACK', id: '1' }
];
instance.prototype.CHOICES_ONOFF = [
	{ label: 'ON', id: '0' },
	{ label: 'OFF', id: '1' }
];
// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
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
			width: 12
		}
	]
}
// Startup test
instance.prototype.init = function() {
	var self = this;
	debug = self.debug;
	log = self.log;
	self.status(self.STATUS_ERROR);
	if (self.config.IP !== undefined) {
		var cmd = "http://" + self.config.IP + ":4430/titan/get/System/SoftwareVersion";
		self.system.emit('rest_get', cmd, function (err, result) {
			if (err !== null) {
				self.status(self.STATUS_ERROR, result.error.code);
			}
			else {
				self.status(self.STATUS_OK);
			}
		});	}
}

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;
	debug("destroy");
}

instance.prototype.actions = function(system) {
	var self = this;
	if ( self.config.IP !== undefined ) {
		if ( self.config.IP.length > 0 ) {
			urlLabel = 'URI';
		}
	}

	self.setActions({
		'playback_at_percentage': {
			label: 'Playback @ Percentage',
			options: [
				{
					type: 'textinput',
					label: 'UserNumber',
					id: 'un',
					default: '1',
					regex:   self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'Percentage',
					id: 'percentage (0->100)',
					default: '1',
					regex:   self.REGEX_NUMBER
				}
			]
		},
		'playback_flash': {
			label: 'Playback Flash',
			options: [
				{
					type: 'textinput',
					label: 'UserNumber',
					id: 'un',
					default: '1',
					regex:   self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'ON/OFF',
					id: 'playbackaction',
					default: '0',
					choices: self.CHOICES_ONOFF
				}
			]
		},
		'playback_swop': {
			label: 'Playback Swop',
			options: [
				{
					type: 'textinput',
					label: 'UserNumber',
					id: 'un',
					default: '1',
					regex:   self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'ON/OFF',
					id: 'playbackaction',
					default: '0',
					choices: self.CHOICES_ONOFF
				}
			]
		},
		'Cuelist_go': {
			label: 'Cuelist GO / BACK',
			options: [
				{
					type: 'textinput',
					label: 'UserNumber',
					id: 'un',
					default: '1',
					regex:   self.REGEX_NUMBER
				},
				{
					type: 'dropdown',
					label: 'Action',
					id: 'cuelistaction',
					default: '0',
					choices: self.CHOICES_CUELIST
				}
			]
		},
		'Cuelist_goto': {
			label: 'Cuelist Go to cue',
			options: [
				{
					type: 'textinput',
					label: 'UserNumber',
					id: 'un',
					default: '1',
					regex:   self.REGEX_NUMBER
				},
				{
					type: 'textinput',
					label: 'CueNumber',
					id: 'cn',
					default: '1',
					regex:   self.REGEX_NUMBER
				}
			]
		}
	});
}

instance.prototype.action = function(action) {
	var self = this;
	var cmd;
	if (action.action == 'playback_at_percentage') {
		if (self.config.IP !== undefined) {
			var percentage = action.options.percentage;
			percentage = percentage/100;
			var cmd = "http://" + self.config.IP + ":4430/titan/script/2/Playbacks/FirePlaybackAtLevel?handle_userNumber=" + action.options.un + "&level_level=" + percentage + "&alwaysRefire=true";
			self.system.emit('rest_get', cmd, function (err, result) {
				if (err !== null) {
					self.status(self.STATUS_ERROR, result.error.code);
				}
				else {
					self.status(self.STATUS_OK);
				}
			});
		}
	}
	if (action.action == 'Cuelist_go') {
		if (self.config.IP !== undefined) {
			var cuelistaction = "Play";
			if (action.options.cuelistaction == '1')
			{
				cuelistaction = "GoBack";
			}
			var cmd = "http://" + self.config.IP + ":4430/titan/script/2/CueLists/" + cuelistaction + "?handle_userNumber=" + action.options.un;
			self.system.emit('rest_get', cmd, function (err, result) {
				if (err !== null) {
					self.status(self.STATUS_ERROR, result.error.code);
				}
				else {
					self.status(self.STATUS_OK);
				}
			});
		}
	}
	if (action.action == 'playback_flash') {
		if (self.config.IP !== undefined) {
			var percentage = "1";
			if (action.options.playbackaction == '1')
			{
				percentage = "0";
			}
			var cmd = "http://" + self.config.IP + ":4430/titan/script/2/Playbacks/FirePlaybackAtLevel?handle_userNumber=" + action.options.un + "&level_level=" + percentage + "&alwaysRefire=true";
			self.system.emit('rest_get', cmd, function (err, result) {
				if (err !== null) {
					self.status(self.STATUS_ERROR, result.error.code);
				}
				else {
					self.status(self.STATUS_OK);
				}
			});
		}
	}
	if (action.action == 'playback_swop') {
		if (self.config.IP !== undefined) {
			var playbackaction = "SwopPlayback";
			if (action.options.playbackaction == '1')
			{
				playbackaction = "ClearSwopPlayback";
			}
			var cmd = "http://" + self.config.IP + ":4430/titan/script/2/Playbacks/" + playbackaction + "?handle_userNumber=" + action.options.un;
			self.system.emit('rest_get', cmd, function (err, result) {
				if (err !== null) {
					self.status(self.STATUS_ERROR, result.error.code);
				}
				else {
					self.status(self.STATUS_OK);
				}
			});
		}
	}
	if (action.action == 'Cuelist_goto') {
		if (self.config.IP !== undefined) {
			var cmd = "http://" + self.config.IP + ":4430/titan/script/2/CueLists/SetNextCue?handle_userNumber=" + action.options.un + "&stepNumber=" + action.options.cn;
			self.system.emit('rest_get', cmd, function (err, result) {
				if (err !== null) {
					self.status(self.STATUS_ERROR, result.error.code);
				}
				else {
					var cmd = "http://" + self.config.IP + ":4430/titan/script/2/CueLists/Play?handle_userNumber=" + action.options.un;
					self.system.emit('rest_get', cmd, function (err, result) {
						if (err !== null) {
							self.status(self.STATUS_ERROR, result.error.code);
						}
						else {
							self.status(self.STATUS_OK);
						}
					});
				}
			});
		}
	}
}

instance_skel.extendedBy(instance);
exports = module.exports = instance;