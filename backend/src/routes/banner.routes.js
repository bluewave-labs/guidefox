const express = require('express');
const bannerController = require('../controllers/banner.controller.js');
const authenticateJWT = require('../middleware/auth.middleware');
const settings = require('../../config/settings');
const accessGuard = require('../middleware/accessGuard.middleware');
const {
  addOrUpdateBannerValidation,
  deleteOrGetBannerByIdValidation,
  getBannerByUrlValidation,
} = require('../utils/banner.helper.js');
const { handleValidationErrors } = require('../middleware/validation.middleware.js');

const router = express.Router();
const teamPermissions = settings.team.permissions;

router.post(
  '/add_banner',
  authenticateJWT,
  accessGuard(teamPermissions.banners),
  addOrUpdateBannerValidation,
  handleValidationErrors,
  bannerController.addBanner
);
router.delete(
  '/delete_banner/:id',
  authenticateJWT,
  accessGuard(teamPermissions.banners),
  deleteOrGetBannerByIdValidation,
  handleValidationErrors,
  bannerController.deleteBanner
);
router.put(
  '/edit_banner/:id',
  authenticateJWT,
  accessGuard(teamPermissions.banners),
  addOrUpdateBannerValidation,
  handleValidationErrors,
  bannerController.editBanner
);
router.get('/all_banners', authenticateJWT, bannerController.getAllBanners);
router.get('/banners', authenticateJWT, bannerController.getBanners);
router.get(
  '/get_banner/:id',
  authenticateJWT,
  deleteOrGetBannerByIdValidation,
  handleValidationErrors,
  bannerController.getBannerById
);
router.get('/get_banner_by_url', getBannerByUrlValidation, handleValidationErrors, bannerController.getBannerByUrl);

module.exports = router;
