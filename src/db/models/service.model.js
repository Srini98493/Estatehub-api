const client = require('../../config/postgres');

const serviceModel = {
	insert: async (serviceData) => {
		try {
			const result = await client.query(
				'SELECT assets.t_service_insert($1, $2, $3, $4, $5, $6, $7, $8)',
				[
					serviceData.userId,
					serviceData.serviceListNo,
					serviceData.postQuery,
					serviceData.areaCode,
					serviceData.contactNo,
					serviceData.email,
					serviceData.createdBy,
					serviceData.updatedBy
				]
			);
			return result.rows[0];
		} catch (error) {
			console.error('Error creating service:', error);
			throw error;
		}
	},

	getById: async (userId, serviceId) => {
		const result = await client.query(
			'SELECT * FROM assets.t_service_get_by_id($1, $2, $3)',
			[null, userId, serviceId]
		);
		return result.rows;
	},

	getAllHomeLoanServices: async (userId, serviceId) => {
		const result = await client.query(
			'SELECT * FROM assets.t_service_get_by_id($1, $2, $3, $4)',
			[null, userId, serviceId, 1]
		);
		return result.rows;
	},

	getAllWithFilters: async (filters, options) => {
		const result = await client.query(
			'SELECT * FROM assets.t_service_get_all($1, $2, $3, $4, $5, $6)',
			[
				options.page,
				options.limit,
				options.sortBy,
				options.sortOrder,
				filters.category,
				filters.maxPrice
			]
		);
		return {
			services: result.rows,
			pagination: {
				page: options.page,
				limit: options.limit,
				totalPages: Math.ceil(result.rowCount / options.limit),
				totalResults: result.rowCount
			}
		};
	},

	update: async (id, updateData) => {
		const result = await client.query(
			'SELECT * FROM assets.t_service_update($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
			[
				id,
				updateData.title,
				updateData.description,
				updateData.category,
				updateData.price,
				updateData.duration,
				updateData.isActive,
				updateData.isApproved,
				updateData.updatedBy,
				updateData.updatedAt
			]
		);
		return result.rows[0];
	},

	delete: async (id, userId) => {
		await client.query(
			'SELECT assets.t_service_delete($1, $2)',
			[id, userId]
		);
		return true;
	},

	bookService: async (bookingData) => {
		const result = await client.query(
			'SELECT assets.t_service_booking_insert($1, $2, $3, $4, $5, $6, $7)',
			[
				bookingData.userId,
				bookingData.serviceId,
				bookingData.bookingDate,
				bookingData.status,
				bookingData.notes,
				bookingData.createdBy,
				bookingData.updatedBy
			]
		);
		return result.rows[0];
	},

	updateBooking: async (bookingId, updateData) => {
		const result = await client.query(
			'SELECT assets.t_service_booking_update($1, $2, $3, $4, $5, $6)',
			[
				bookingId,
				updateData.status,
				updateData.notes,
				updateData.cancelReason,
				updateData.updatedBy,
				updateData.updatedAt
			]
		);
		return result.rows[0];
	},

	getBooking: async (bookingId) => {
		const result = await client.query(
			'SELECT * FROM assets.t_service_booking_get_by_id($1)',
			[bookingId]
		);
		return result.rows[0];
	},

	getAllServiceCategories: async () => {
		try {
			const result = await client.query(
				'SELECT * FROM assets.t_service_get_all_service_categories()'
			);
			return result.rows[0]?.t_service_get_all_service_categories || [];
		} catch (error) {
			console.error('Error fetching service categories:', error);
			throw error;
		}
	},

	getAllHomeLoanCategories: async () => {
		try {
		const result = await client.query(
			'SELECT * FROM assets.t_service_get_all_service_categories(1)'
			);
			return result.rows[0]?.t_service_get_all_service_categories || [];
		} catch (error) {
			console.error('Error fetching home loan categories:', error);
			throw error;
		}
	}
};

module.exports = serviceModel;
