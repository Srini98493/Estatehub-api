const httpStatus = require('http-status');
const { serviceModel } = require('../db/models');
const ApiError = require('../utils/ApiError');

const createService = async (serviceData) => {
	const service = await serviceModel.insert(serviceData);
	return service;
};

const getServiceById = async (userId, serviceId, id) => {
	const result = await serviceModel.getById(userId, serviceId, id);
	
	// Check if we have any results
	if (!result || !result[0]?.t_service_get_by_id) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
	}

	return {
		status: true,
		message: 'Service details retrieved successfully',
		data: result[0].t_service_get_by_id
	};
};

const getAllHomeLoanServices = async (userId, serviceId) => {
	const result = await serviceModel.getAllHomeLoanServices(userId, serviceId);

	// Check if we have any results
	if (!result || !result[0]?.t_service_get_by_id) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
	}

	return {
		status: true,
		message: 'Home Loans details retrieved successfully',
		data: result[0].t_service_get_by_id
	};
};

const getAllServices = async (filters, options) => {
	const services = await serviceModel.getAllWithFilters(filters, options);
	return services;
};

const updateService = async (id, updateData) => {
	const service = await getServiceById(id);
	if (!service) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
	}
	const updatedService = await serviceModel.update(id, updateData);
	return updatedService;
};

const deleteService = async (id, userId) => {
	const service = await getServiceById(id);
	if (!service) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
	}
	await serviceModel.delete(id, userId);
	return true;
};

const bookService = async (bookingData) => {
	const service = await getServiceById(bookingData.serviceId);
	if (!service) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
	}
	const booking = await serviceModel.bookService(bookingData);
	return booking;
};

const updateServiceBooking = async (bookingId, updateData) => {
	const booking = await serviceModel.updateBooking(bookingId, updateData);
	if (!booking) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
	}
	return booking;
};

const getServiceBooking = async (serviceId, bookingId) => {
	const booking = await serviceModel.getBooking(bookingId || serviceId);
	if (!booking) {
		throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
	}
	return booking;
};

const getAllServiceCategories = async () => {
	const categories = await serviceModel.getAllServiceCategories();
	return {
		status: true,
		message: 'Service categories retrieved successfully',
		data: categories
	};
};

const getAllHomeLoanCategories = async () => {
	const categories = await serviceModel.getAllHomeLoanCategories();
	return {
		status: true,
		message: 'Home loan categories retrieved successfully',
		data: categories
	};
};

module.exports = {
	createService,
	getServiceById,
	getAllServices,
	updateService,
	deleteService,
	bookService,
	updateServiceBooking,
	getServiceBooking,
	getAllServiceCategories,
	getAllHomeLoanCategories,
	getAllHomeLoanServices
};
