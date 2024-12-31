const statisticsService = require("../service/statistics.service");
const { internalServerError } = require("../utils/errors.helper");

class StatisticsController {
  async getStatistics(req, res) {
    try {
      const userId = req.user.id;
      const statistics = await statisticsService.generateStatistics({
        userId: userId.toString(),
      });
      res.status(200).json(statistics);
    } catch (e) {
      console.log(e)
      const { statusCode, payload } = internalServerError(
        "GET_STATISTICS_ERROR",
        e.message
      );
      res.status(statusCode).json(payload);
    }
  }
}

module.exports = new StatisticsController();
