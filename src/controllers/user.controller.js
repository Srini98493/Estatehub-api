const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { userService } = require('../services');

const getUsers = catchAsync(async (req, res) => {
	const users = await userService.getUsers(req);
	res.send({ users });
});

const getUser = catchAsync(async (req, res) => {
	const user = await userService.getUserById(req.params.userId);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}

	res.send({ user });
});

const deleteUser = catchAsync(async (req, res) => {
	await userService.deleteUserById(req.params.userId);
	res.send({ success: true });
});

const updateUser = catchAsync(async (req, res) => {
	const user = await userService.updateUser(req);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}

	res.send({ user });
});

const createUser = catchAsync(async (req, res) => {
	await userService.createUser(req.body);
	res.status(httpStatus.CREATED).send({
		success: true,
		message: 'OTP has been sent to your email'
	});
});

const getUserByEmail = catchAsync(async (req, res) => {
	const user = await userService.getUserByEmail(req.params.email);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
	}

	res.send({ user });
});

const deleteUserData = catchAsync(async (req, res) => {
	try {
		console.log("Log from Data", req);
		
		const userId = req.user.t_user_get_by_id[0]?.userid;
		
		if (!userId) {
			return res.status(400).json({
				success: false,
				message: 'User ID is required'
			});
		}

		const result = await userService.deleteUserData(userId);
		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message
		});
	}
});

module.exports = {
	createUser,
	getUsers,
	getUser,
	updateUser,
	deleteUser,
	getUserByEmail,
	deleteUserData
};
