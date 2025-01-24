const statisticsService = require("../service/statistics.service");
const { internalServerError } = require("../utils/errors.helper");

class StatisticsController {
  async getStatistics(req, res) {
    try {
      const statistics = await statisticsService.generateStatistics();
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
