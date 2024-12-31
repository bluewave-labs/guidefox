const express = require("express");
const statisticsController = require("../controllers/statistics.controller");
const authenticateJWT = require("../middleware/auth.middleware");

const router = express.Router();
router.use(authenticateJWT)
router.get("/", statisticsController.getStatistics);

module.exports = router;
