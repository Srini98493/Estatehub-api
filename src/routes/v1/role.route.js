const express = require('express');
const validate = require('../../middlewares/validate');
const { roleValidation } = require('../../validations');
const { roleController } = require('../../controllers');

const { grantAccess } = require('../../middlewares/validateAccessControl');
const { resources } = require('../../config/roles');

const router = express.Router();

router
	.route('/')
	.get(
		grantAccess('readAny', resources.ROLE),
		validate(roleValidation.getRoles),
		roleController.getRoles
	)
	.post(
		grantAccess('createAny', resources.ROLE),
		validate(roleValidation.createRole),
		roleController.createRole
	);

router
	.route('/:roleId')
	.get(
		grantAccess('readAny', resources.ROLE),
		validate(roleValidation.getRole),
		roleController.getRole
	)
	.patch(
		grantAccess('updateAny', resources.ROLE),
		validate(roleValidation.updateUser),
		roleController.updateRole
	)
	.delete(
		grantAccess('deleteAny', resources.ROLE),
		validate(roleValidation.deleteRole),
		roleController.deleteRole
	);

module.exports = router;