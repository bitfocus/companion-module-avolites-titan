module.exports = {
	initVariables: function () {
		let self = this;
		let variables = []


		self.checkVariables();
	},

	checkVariables: function () {
		let self = this;
		let variableObj = {};

		self.setVariableValues(variableObj);
	}
}
