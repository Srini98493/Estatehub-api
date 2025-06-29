const Joi = require('@hapi/joi');

const createService = {
	body: Joi.object().keys({
		userId: Joi.number().required(),
		serviceListNo: Joi.number().required(),
		postQuery: Joi.string().required(),
		areaCode: Joi.string().required(),
		contactNo: Joi.string().required(),
		email: Joi.string().email().required()
	}),
};

const updateService = {
	params: Joi.object().keys({
		id: Joi.number().required()
	}),
	body: Joi.object().keys({
		userId: Joi.number().required(),
		serviceListNo: Joi.number().required(),
		postQuery: Joi.string().required(),
		areaCode: Joi.string().required(),
		contactNo: Joi.string().required(),
		email: Joi.string().email().required()
	}),
};

const getService = {
	query: Joi.object().keys({
		serviceId: Joi.number().optional().allow(null),
	}),
};

module.exports = {
	createService,
	updateService,
	getService
};
