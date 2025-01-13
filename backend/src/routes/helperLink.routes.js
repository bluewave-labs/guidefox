const express = require('express');
const helper = require('../controllers/helperLink.controller');
const authenticateJWT = require('../middleware/auth.middleware');
const settings = require('../../config/settings');
const accessGuard = require('../middleware/accessGuard.middleware');
const { helperValidator } = require('../utils/helperLink.helper');
const { handleValidationErrors } = require('../middleware/validation.middleware');
const { idParamValidator } = require('../utils/link.helper');
const helperController = helper.controller;

const router = express.Router();
const teamPermissions = settings.team.permissions;

router.use(authenticateJWT);

router.get('/get_helpers', helperController.getHelpersByUserId);
router.get('/get_helpers_with_links', helperController.getAllHelpersWithLinks);
router.get('/all_helpers', helperController.getAllHelpers);
router.get('/get_helper/:id', idParamValidator, handleValidationErrors, helperController.getHelperById);

router.use(accessGuard(teamPermissions.helpers));

router.post('/add_helper', helperValidator, handleValidationErrors, helperController.addHelper);
router.delete('/delete_helper/:id', idParamValidator, handleValidationErrors, helperController.deleteHelper);
router.put('/edit_helper/:id', idParamValidator, helperValidator, handleValidationErrors, helperController.editHelper);

module.exports = router;
