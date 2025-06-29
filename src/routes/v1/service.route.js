const express = require('express');
const serviceController = require('../../controllers/service.controller');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const serviceValidation = require('../../validations/service.validation');

const router = express.Router();

// Create service
router.post(
	'/createService',
	auth(),
	validate(serviceValidation.createService),
	serviceController.createService
);

// Update service
router.put(
	'/updateService/:id',
	auth(),
	validate(serviceValidation.updateService),
	serviceController.updateService
);

// Get service by ID
router.get(
	'/getService',
	auth(),
	validate(serviceValidation.getService),
	serviceController.getServiceById
);

// Get All Homeloan services
router.get(
	'/getHomeLoanServices',
	auth(),
	serviceController.getAllHomeLoanServices
);

// Get all services
router.get(
	'/getAllServices',
	auth(),
	serviceController.getAllServices
);

// Get all service categories
router.get(
	'/getAllServiceCategories',
	auth(),
	serviceController.getAllServiceCategories
);

// Get all homeloan service categories
router.get(
	'/getAllHomeLoanCategories',
	auth(),
	serviceController.getAllHomeLoanCategories
);

module.exports = router;
