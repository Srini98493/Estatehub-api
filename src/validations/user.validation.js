const Joi = require('@hapi/joi');
const { password } = require('./custom.validation');

const createUser = {
	body: Joi.object().keys({
		name: Joi.string().required(),
		username: Joi.string().required(),
		password: Joi.string().required().min(6),
		areaCode: Joi.string(),
		contactNo: Joi.string(),
		email: Joi.string().required().email(),
		socialEmail: Joi.string().email(),
		gender: Joi.string(),
		dob: Joi.date(),
		location: Joi.string(),
		city: Joi.string(),
		state: Joi.string(),
		country: Joi.string(),
		profileImagePath: Joi.string(),
		isNotificationEnabled: Joi.boolean(),
		userType: Joi.number().required(),
		createdBy: Joi.number().required(),
	}),
};

const getUsers = {
	query: Joi.object().keys({
		name: Joi.string(),
		email: Joi.string().email(),
		roleId: Joi.number(),
		limit: Joi.number().min(1),
		page: Joi.number().min(1),
	}),
};

const getUser = {
	params: Joi.object().keys({
		userId: Joi.string(),
	}),
};

const updateUser = {
	params: Joi.object().keys({
		userId: Joi.required(),
	}),
	body: Joi.object()
		.keys({
			email: Joi.string().email(),
			password: Joi.string().custom(password),
			name: Joi.string(),
		})
		.min(1),
};

const deleteUser = {
	params: Joi.object().keys({
		userId: Joi.string(),
	}),
};

const verifyEmail = {
	body: Joi.object().keys({
		email: Joi.string().required().email(),
		otp: Joi.string().required().length(6)
	})
};

module.exports = {
	createUser,
	getUsers,
	getUser,
	updateUser,
	deleteUser,
	verifyEmail,
};
