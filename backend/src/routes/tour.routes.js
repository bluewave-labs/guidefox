const express = require('express');
const tourController = require('../controllers/tour.controller');
const authenticateJWT = require('../middleware/auth.middleware');
const settings = require('../../config/settings');
const accessGuard = require('../middleware/accessGuard.middleware');
const { tourValidator, paramsIdValidator } = require('../utils/tour.helper');
const { handleValidationErrors } = require('../middleware/validation.middleware');

const router = express.Router();
const teamPermissions = settings.team.permissions.tours;

// router.get("/get_tour_by_url", tourController.getTourByUrl);

router.use(authenticateJWT);

router.get('/all_tours', tourController.getAllTours);
router.get('/tours', tourController.getToursByUserId);
router.get('/get_tour/:id', tourController.getTourById);

router.use(accessGuard(teamPermissions));

router.post('/add_tour', tourValidator, handleValidationErrors, tourController.createTour);
router.delete('/delete_tour/:id', paramsIdValidator, handleValidationErrors, tourController.deleteTour);
router.put('/edit_tour/:id', paramsIdValidator, tourValidator, handleValidationErrors, tourController.updateTour);

module.exports = router;
