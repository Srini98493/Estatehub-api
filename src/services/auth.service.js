const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const { userModel } = require('../db/models');
const ApiError = require('../utils/ApiError');

const loginUserWithEmailAndPassword = async (email, password) => {
	console.log('Attempting login for email:', email);
	
	// Get user by email
	const userResult = await userModel.getByEmail(email);
	console.log('User result:', userResult);

	// Check if user exists and extract user data
	if (!userResult) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
	}

	// Check if user is active
	if (!userResult.isactive) {
		throw new ApiError(
			httpStatus.UNAUTHORIZED, 
			'Email verification is pending. Please verify your email to activate your account.'
		);
	}

	// Verify and compare passwords
	if (!password || !userResult.password) {
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid login credentials');
	}

	try {
		const isPasswordMatch = await bcrypt.compare(
			String(password), 
			String(userResult.password)
		);

		if (!isPasswordMatch) {
			throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
		}

		// Remove password from user data before returning
		const { password: _, ...userDataWithoutPassword } = userResult;
		console.log('Authenticated user data:', userDataWithoutPassword);
		return userDataWithoutPassword;

	} catch (error) {
		console.error('Password comparison error:', error.message);
		throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid login credentials');
	}
};

module.exports = {
	loginUserWithEmailAndPassword,
};
