const express = require("express");
const popupController = require("../controllers/popup.controller");
const authenticateJWT = require("../middleware/auth.middleware");
const settings = require('../../config/settings');
const accessGuard = require('../middleware/accessGuard.middleware');
const { addOrUpdatePopupValidation, getPopupByUrlValidation, deleteOrGetPopupByIdValidation } = require("../utils/popup.helper");
const { handleValidationErrors } = require("../middleware/validation.middleware");

const router = express.Router();
const teamPermissions = settings.team.permissions;

router.post("/add_popup", authenticateJWT, accessGuard(teamPermissions.popups),addOrUpdatePopupValidation, handleValidationErrors, popupController.addPopup);
router.delete("/delete_popup/:id", authenticateJWT, accessGuard(teamPermissions.popups), deleteOrGetPopupByIdValidation, handleValidationErrors, popupController.deletePopup);
router.put("/edit_popup/:id", authenticateJWT, accessGuard(teamPermissions.popups), addOrUpdatePopupValidation, handleValidationErrors,popupController.editPopup);
router.get("/all_popups", authenticateJWT, popupController.getAllPopups);
router.get("/popups", authenticateJWT, popupController.getPopups);
router.get("/get_popup/:id", authenticateJWT,deleteOrGetPopupByIdValidation, handleValidationErrors ,popupController.getPopupById);
router.get("/get_popup_by_url", getPopupByUrlValidation, handleValidationErrors, popupController.getPopupByUrl);

module.exports = router;
