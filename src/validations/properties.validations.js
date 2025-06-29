const Joi = require('@hapi/joi');

const createProperty = {
    body: Joi.object().keys({
        userId: Joi.number(),
        propertyCategory: Joi.number().required(),
        propertyType: Joi.number().required(),
        propertyTitle: Joi.string().required(),
        propertyDescription: Joi.string().required(),
        address: Joi.string().allow(''),
        location: Joi.string().required(),
        landmark: Joi.string().allow(''),
        pinCode: Joi.string().allow(''),
        city: Joi.string().allow(''),
        state: Joi.string().allow(''),
        country: Joi.string().allow(''),
        latitude: Joi.number().default(0),
        longitude: Joi.number().default(0),
        availableDate: Joi.date().required(),
        bedRooms: Joi.number().required(),
        bathRooms: Joi.number().required(),
        amenities: Joi.alternatives().try(
            Joi.array().items(Joi.string()),
            Joi.string()
        ),
        propertyArea: Joi.string().required(),
        currencyType: Joi.string().required(),
        price: Joi.number().required(),
        status: Joi.string(),
        isActive: Joi.boolean().default(true),
        isApproved: Joi.boolean().default(false),
        isArchived: Joi.boolean().default(false),
        propertyImages: Joi.any(),
    }).unknown(true),
    files: Joi.array().items(Joi.object({
        fieldname: Joi.string(),
        originalname: Joi.string(),
        encoding: Joi.string(),
        mimetype: Joi.string(),
        buffer: Joi.binary(),
        size: Joi.number()
    })).optional(),
    attachmentsToRemove: Joi.array().items({
        attachmentid: Joi.number().required(),
        attachmenturl: Joi.string().required(),
        attachmenttype: Joi.string().required(),
        attachmentname: Joi.string().required(),
        isprimary: Joi.boolean().required()

    }).optional()
};

const getPropertyById = {
    params: Joi.object().keys({
        id: Joi.number().required(),
        userId: Joi.number().optional().allow(null).allow('').allow(0)
    }),
    query: Joi.object().keys({
        userId: Joi.number(),
        full: Joi.number().valid(1, 2)
    })
};

const approveProperty = {
    params: Joi.object().keys({
        id: Joi.number().required()
    }),
    body: Joi.object().keys({
        userId: Joi.number().required(),
        action: Joi.string().valid('submit', 'approve').required()
    })
};

const searchProperties = {
    query: Joi.object().keys({
        propertyCategory: Joi.number().allow(null),
        propertyType: Joi.number().allow(null),
        location: Joi.string().allow(null),
        pinCode: Joi.string().allow(null),
        city: Joi.string().allow(null),
        userid: Joi.number().allow(null),
        state: Joi.string().allow(null),
        userId: Joi.number().allow(null),
        minPrice: Joi.number().allow(null),
        maxPrice: Joi.number().allow(null),
        minArea: Joi.number().allow(null),
        maxArea: Joi.number().allow(null),
        minBedrooms: Joi.number().allow(null),
        maxBedrooms: Joi.number().allow(null),
        status: Joi.string().allow(null),
        isActive: Joi.boolean().allow(null),
    })
};

const addToFavorites = {
    params: Joi.object().keys({
        id: Joi.number().required()
    }),
    body: Joi.object().keys({
        rating: Joi.number().min(0).max(5).required(),
        comment: Joi.string().allow(''),
    })
};

const updateFavorite = {
    params: Joi.object().keys({
        id: Joi.number().required()
    }),
    body: Joi.object().keys({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().allow(''),
        updatedBy: Joi.number().required()
    })
};

const getRecentViewed = {
    query: Joi.object().keys({
        limit: Joi.number().integer().min(1).max(50).optional()
    })
};

const bookProperty = {
    params: Joi.object().keys({
        id: Joi.number().required()
    }),
    body: Joi.object().keys({
        bookedDate: Joi.date().required(),
        cancelledDate: Joi.date().allow(null),
        isBooked: Joi.boolean().default(true),
        isCancelled: Joi.boolean().default(false),
        reasonForCancellation: Joi.string().allow(''),
    })
};

const updateBooking = {
    params: Joi.object().keys({
        propertyId: Joi.number().required(),
        bookingId: Joi.number().required()
    }),
    body: Joi.object().keys({
        isBooked: Joi.boolean().optional(),
        isCancelled: Joi.boolean().required(),
        reasonForCancellation: Joi.string().allow(''),
        bookedDate: Joi.date().optional(),
        cancelledDate: Joi.date().allow(null).allow('').optional(),
    })
};

const getBooking = {
    params: Joi.object().keys({
        id: Joi.number().required()
    }),
    query: Joi.object().keys({
        bookingId: Joi.number(),
        userId: Joi.number()
    })
};

const getAllProperties = {
    query: Joi.object().keys({
        page: Joi.number().min(1),
        limit: Joi.number().min(1),
        sortBy: Joi.string(),
        sortOrder: Joi.string().valid('asc', 'desc'),
        propertyCategory: Joi.number(),
        propertyType: Joi.number(),
        city: Joi.string(),
        minPrice: Joi.number(),
        maxPrice: Joi.number()
    })
};

const getPendingApprovals = {
    query: Joi.object().keys({
        page: Joi.number().min(1),
        limit: Joi.number().min(1),
        sortBy: Joi.string(),
        sortOrder: Joi.string().valid('asc', 'desc')
    })
};

const deleteProperty = {
    params: Joi.object().keys({
        id: Joi.number().required()
    })
};

module.exports = {
    createProperty,
    getPropertyById,
    approveProperty,
    searchProperties,
    addToFavorites,
    updateFavorite,
    getRecentViewed,
    bookProperty,
    updateBooking,
    getBooking,
    getAllProperties,
    getPendingApprovals,
    deleteProperty,
};
