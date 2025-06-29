const userModel = require('./user.model');
const serviceModel = require('./service.model');
const propertyModel = require('./property.model');

const db = {
	userModel,
	serviceModel,
	propertyModel
};

module.exports = db;
