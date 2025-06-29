class ApiError extends Error {
	constructor(statusCode, message, isOperational = true) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;
		
		// Remove stack trace
		this.stack = undefined;
		
		// Prevent Error.captureStackTrace
		Object.defineProperty(this, 'stack', {
			configurable: false,
			writable: false,
			value: undefined
		});
	}

	toJSON() {
		return {
			code: this.statusCode,
			message: this.message
		};
	}
}

module.exports = ApiError;
