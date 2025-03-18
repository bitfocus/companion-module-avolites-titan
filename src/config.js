const { Regex } = require('@companion-module/base');

module.exports = {
	getConfigFields() {
        console.log("Config Fields accessed - Ensure the Desk IP is valid"); 
		return [
			{
				type: 'static-text',
				id: 'info',
				width: 12,
				label: 'Information',
				value: 'This module comunicates to avolites titan desks thru the webapi protocol, the desk needs to be running version 10.0 or higher for this to work, some features might only work with higher software versions so make sure your avolites desk is always up to date'
			},
			{
				type: 'textinput',
				id: 'IP',
				label: 'Desk IP',
				regex: Regex.IP, 
				width: 12
			}
		]
	},
}
