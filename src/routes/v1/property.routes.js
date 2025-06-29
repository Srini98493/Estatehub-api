const express = require('express');
const propertyController = require('../../controllers/property.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const propertyValidation = require('../../validations/properties.validations');
const multer = require('multer');
const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');
const { convertNullStrings } = require('../../middlewares/nullConverter');
const { deleteFavorite } = require('../../controllers/property.controller');
const { updateProperty } = require('../../controllers/property.controller');

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB in bytes
        files: 10 // Maximum number of files
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload only images.'), false);
        }
    }
});

// Middleware to process uploaded files
const processUploadedFiles = (req, res, next) => {
    // If files exist, process them
    if (req.files && req.files.length > 0) {
        // Convert files to a format that can be processed
        const processedFiles = req.files.map(file => ({
            originalname: file.originalname,
            buffer: file.buffer,
            mimetype: file.mimetype
        }));

        // Store processed files in request object
        req.processedFiles = processedFiles;
    } else {
        // No files uploaded, set empty array
        req.processedFiles = [];
    }
    next();
};

const router = express.Router();

// Create property route
router.post(
    '/createProperty',
    (req, res, next) => {
        console.log('Raw request headers:', req.headers);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Raw request body:', req.body);
        console.log('Raw files:', req.files);
        next();
    },
    auth(),
    upload.array('propertyImages', 10),
    processUploadedFiles,
    validate(propertyValidation.createProperty),
    propertyController.createProperty
);

// Get property details
router.get(
    '/:id/details/:userId',
    validate(propertyValidation.getPropertyById),
    propertyController.getPropertyDetails
);

// Approve property (admin only)
router.post(
    '/:id/approve',
    auth(),
    validate(propertyValidation.approveProperty),
    propertyController.approveProperty
);

// Search properties
router.get(
    '/search',
    convertNullStrings,
    validate(propertyValidation.searchProperties),
    propertyController.searchProperties
);

// Add to favorites
router.post(
    '/:id/favorites',
    auth(),
    validate(propertyValidation.addToFavorites),
    propertyController.addToFavorites
);

// Update favorite
router.put(
    '/:id/favorites',
    // auth(),
    validate(propertyValidation.updateFavorite),
    propertyController.updateFavorite
);

// Get user's favorites
router.get(
    '/favorites',
    auth(),
    propertyController.getFavorites
);

// Get recent viewed properties with favorite count
router.get(
    '/recent-viewed',
    validate(propertyValidation.getRecentViewed),
    propertyController.getRecentViewedWithFavoriteCount
);

// Book property
router.post(
    '/:id/bookProperty',
    auth(),
    validate(propertyValidation.bookProperty),
    propertyController.bookProperty
);

// Update property booking
router.put(
    '/updateBooking/:propertyId/:bookingId',
    auth(),
    validate(propertyValidation.updateBooking),
    propertyController.updateBooking
);

// Get property booking details
router.get(
    '/getBookingsByUserId',
    auth(),
    // validate(propertyValidation.getBooking),
    propertyController.getBookingsByUserId
);

// Get properties by user ID
router.post(
    '/user/:id',
    auth(),
    // validate(propertyValidation.getPropertiesByUserId),
    propertyController.getPropertyById
);

// Get pending approval properties
router.get(
    '/pending-approvals',
    auth(),
    validate(propertyValidation.getPendingApprovals),
    propertyController.getPendingApprovals
);

// Get most viewed properties
router.get(
    '/most-viewed',
    validate(propertyValidation.getRecentViewed),
    propertyController.getMostViewedProperties
);

// Delete favorite route
router.delete(
    '/removeFavorite/:id', // Assuming :id is the favorite ID
    auth(), // Authentication middleware
    deleteFavorite // Controller function to handle the delete request
);

// Update property route
router.put(
    '/updateProperty/:id', // Assuming :id is the property ID
    upload.array('propertyImages', 10),
    processUploadedFiles,
    auth(), // Authentication middleware
    updateProperty // Controller function to handle the update request
);

// Delete property route
router.delete(
    '/deleteProperty/:id', // Assuming :id is the property ID
    auth(), // Authentication middleware
    validate(propertyValidation.deleteProperty), // Validation middleware
    propertyController.deleteProperty // Controller function to handle the delete request
);

// Download full report (booked + posted properties)
router.get(
    '/report',
    propertyController.getDownloadProperties // No auth/validation needed unless required
  );
  
module.exports = router; 