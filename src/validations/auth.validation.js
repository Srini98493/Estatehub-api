const Joi = require('@hapi/joi');
const { password } = require('./custom.validation');

const register = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		password: Joi.string().required().custom(password),
		name: Joi.string().required(),
		username: Joi.string(),
		areaCode: Joi.string(),
		contactNo: Joi.string(),
		socialEmail: Joi.string().email().allow('').optional(),
		gender: Joi.string().valid('male', 'female', 'other', null, '').optional(),
		dob: Joi.date().iso().allow(null, '').optional(),
		location: Joi.string().allow('', null).optional(),
		city: Joi.string().allow(null, '').optional(),
		state: Joi.string().allow(null, '').optional(),
		country: Joi.string().allow(null, '').optional(),
		profileImagePath: Joi.string().allow('').default('/uploads/profile/default.jpg').optional(),
		isNotificationEnabled: Joi.boolean().default(false),
		userType: Joi.number(),
		createdBy: Joi.number()
	}),
};

const login = {
	body: Joi.object().keys({
		email: Joi.string().required(),
		password: Joi.string().required(),
	}),
};

const forgotPassword = {
	body: Joi.object().keys({
		email: Joi.string().email().required(),
	}),
};

const resetPassword = {
	body: Joi.object().keys({
		token: Joi.string().required(),
		otp: Joi.string().required(),
		newPassword: Joi.string().required(),
	}),
};

module.exports = {
	register,
	login,
	forgotPassword,
	resetPassword,
};
