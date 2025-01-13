const guidelogService = require("../service/guidelog.service.js");
const { internalServerError } = require("../utils/errors.helper.js");

class GuideLogController {
  async addGuideLog(req, res) {
      try {
          const { guideType, userId, completed, guideId } = req.body;
          const isCompleted = completed !== undefined ? completed : false;

          const guideLog = await guidelogService.addGuideLog({ guideType, guideId, userId, completed: isCompleted });
    
          res.status(200).json(guideLog);
        } catch (err) {
          const { statusCode, payload } = internalServerError(
            "Error adding Guide Logs:",
            err.message,
          );
          res.status(statusCode).json(payload);
        }
      }
  async getAllLogs(req, res) {
    try {
      const guideLogs = await guidelogService.getAllGuideLogs();
      res.status(200).json(guideLogs);
    } catch (err) {
      const { statusCode, payload } = internalServerError(
        "GET_ALL_GUIDE_LOGS_ERROR",
        err.message,
      );
      res.status(statusCode).json(payload);
    }
  }
  async getLogsByUser(req, res){
    try {
      const {userId} = req.body;
      const guideLogs = await guidelogService.getLogsByUser(userId);
      res.status(200).json(guideLogs);
    } catch (err) {
      const { statusCode, payload } = internalServerError(
        "GET_ALL_LOGS_BY_USER_ERROR",
        err.message,
      );
      res.status(statusCode).json(payload);
    }
  }
  async getCompleteGuideLogs(req, res){
    try {
      const {userId} = req.body;
      const guideLogs = await guidelogService.getCompleteGuideLogs(userId);
      res.status(200).json(guideLogs);
    } catch (err) {
      const { statusCode, payload } = internalServerError(
        "GET_ALL_COMPLETE_LOGS_BY_USER_ERROR",
        err.message,
      );
      res.status(statusCode).json(payload);
    }
  }
}

module.exports = new GuideLogController();