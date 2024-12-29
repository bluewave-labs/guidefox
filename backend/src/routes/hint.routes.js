const express = require("express");
const hintController = require("../controllers/hint.controller");
const authenticateJWT = require("../middleware/auth.middleware");
const settings = require('../../config/settings');
const accessGuard = require('../middleware/accessGuard.middleware');

const router = express.Router();
const teamPermissions = settings.team.permissions;

router.post("/add_hint", authenticateJWT, accessGuard(teamPermissions.hints), hintController.addHint);
router.delete("/delete_hint/:hintId", authenticateJWT, accessGuard(teamPermissions.hints), hintController.deleteHint);
router.put("/edit_hint/:hintId", authenticateJWT, accessGuard(teamPermissions.hints), hintController.updateHint);
router.get("/all_hints", authenticateJWT, hintController.getAllHints);
router.get("/hints", authenticateJWT, hintController.getHints);
router.get("/get_hint/:hintId", authenticateJWT, hintController.getHintById);
router.get("/get_hint_by_url", hintController.getHintByUrl);

module.exports = router;