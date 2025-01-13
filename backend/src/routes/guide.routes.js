const express = require("express");
const guideController = require("../controllers/guide.controller.js");

const router = express.Router();

router.post("/get_guides_by_url", guideController.getGuidesByUrl);
router.post("/get_incomplete_guides_by_url", guideController.getIncompleteGuidesByUrl);

module.exports = router;
