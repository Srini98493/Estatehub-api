const httpStatus = require('http-status');
const config = require('../config/config');
const userService = require('./user.service');
const ApiError = require('../utils/ApiError');
const { generateToken, generateExpires } = require('../utils/auth');

async function generateResetPasswordToken(email) {
	console.log(`Generating reset password token for email: ${email}`);
	const user = await userService.getUserByEmail(email);
	console.log("User:", user);
	
	if (!user || !user.userid) {
		console.log(`User not found for email: ${email}`);
		throw new ApiError(
			httpStatus.NOT_FOUND,
			'User not found with this email'
		);
	}

	const expiresMs = generateExpires(
		config.jwt.resetPasswordExpirationMinutes / 60
	);
	const resetPasswordToken = generateToken({ userid: user.userid }, expiresMs);
	console.log(`Reset password token generated successfully for user ID: ${user.userid}`);

	return resetPasswordToken;
}

async function generateAuthTokens({ userid, roleId }) {
	console.log(`Generating auth tokens for user ID: ${userid}, role ID: ${roleId}`);
	
	const refreshTokenExpires = generateExpires(
		config.jwt.refreshExpirationDays * 24
	);
	const refreshToken = generateToken({ userid }, refreshTokenExpires);
	console.log(`Refresh token generated, expires: ${new Date(refreshTokenExpires).toISOString()}`);

	const accessTokenExpires = generateExpires(
		config.jwt.accessExpirationMinutes / 60
	);
	const accessToken = generateToken({ userid, roleId }, accessTokenExpires);
	console.log(`Access token generated, expires: ${new Date(accessTokenExpires).toISOString()}`);

	return {
		refresh: {
			token: refreshToken,
			expires: refreshTokenExpires,
		},
		access: {
			token: accessToken,
			expires: accessTokenExpires,
		},
	};
}

module.exports = {
	generateResetPasswordToken,
	generateAuthTokens,
};
