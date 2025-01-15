const express = require("express");
const popupController = require("../controllers/popup.controller");
const authenticateJWT = require("../middleware/auth.middleware");
const settings = require('../../config/settings');
const accessGuard = require('../middleware/accessGuard.middleware');

const router = express.Router();
const teamPermissions = settings.team.permissions;

router.post("/add_popup", authenticateJWT, accessGuard(teamPermissions.popups), popupController.addPopup);
// router.delete("/delete_popup/:id", authenticateJWT, accessGuard(teamPermissions.popups), popupController.deletePopup);
// router.put("/edit_popup/:id", authenticateJWT, accessGuard(teamPermissions.popups), popupController.editPopup);
router.get("/all_popups", authenticateJWT, popupController.getAllPopups);
router.get("/popups", authenticateJWT, popupController.getPopups);
router.get("/get_popup/:id", authenticateJWT, popupController.getPopupById);
router.get("/get_popup_by_url", popupController.getPopupByUrl);

module.exports = router;
