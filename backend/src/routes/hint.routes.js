const express = require('express');
const hintController = require('../controllers/hint.controller');
const authenticateJWT = require('../middleware/auth.middleware');
const settings = require('../../config/settings');
const accessGuard = require('../middleware/accessGuard.middleware');
const { hintValidator, paramIdValidator, bodyUrlValidator } = require('../utils/hint.helper');
const { handleValidationErrors } = require('../middleware/validation.middleware');

const router = express.Router();
const teamPermissions = settings.team.permissions;

router.get('/get_hint_by_url', bodyUrlValidator, handleValidationErrors, hintController.getHintByUrl);

router.use(authenticateJWT);

router.get('/all_hints', hintController.getAllHints);
router.get('/hints', hintController.getHints);
router.get('/get_hint/:hintId', paramIdValidator, handleValidationErrors, hintController.getHintById);

router.use(accessGuard(teamPermissions.hints));

router.post('/add_hint', hintValidator, handleValidationErrors, hintController.addHint);
router.delete('/delete_hint/:hintId', paramIdValidator, handleValidationErrors, hintController.deleteHint);
router.put('/edit_hint/:hintId', paramIdValidator, hintValidator, handleValidationErrors, hintController.updateHint);

module.exports = router;
