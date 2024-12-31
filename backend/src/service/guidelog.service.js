const db = require("../models");
const GuideLog = db.GuideLog;
const { GuideType } = require('../utils/guidelog.helper');

class GuideLogService {
  async addGuideLog({ guideType, userId, guideId, completed }) {
    const transaction = await db.sequelize.transaction();
    try {
      const log = await GuideLog.create({
        guideType,
        userId,
        guideId,
        showingTime: new Date(),
        completed
      }, { transaction });
      await transaction.commit();
      return log;
    } catch (err) {
      await transaction.rollback();
      throw new Error(`Failed to create guide log: ${err.message}`);
    }
  }
  async getAllGuideLogs() {
    return await GuideLog.findAll();
  }

  async getCompleteBannerLogs(userId) {
    try {
      return await GuideLog.findAll({
        where: {
          userId: userId,
          completed: true,
          guideType: GuideType.BANNER
        },
      });
    } catch (err) {
      throw new Error(`Failed to retrieve banner log for user ${userId}: ${err.message}`);
    }
  }

  async getCompletePopupLogs(userId) {
    try {
      return await GuideLog.findAll({
        where: {
          userId: userId,
          completed: true,
          guideType: GuideType.POPUP
        },
      });
    } catch (err) {
      throw new Error(`Failed to retrieve popup log for user ${userId}: ${err.message}`);
    }
  }
  async getCompleteHintLogs(userId) {
    try {
      return await GuideLog.findAll({
        where: {
          userId: userId,
          completed: true,
          guideType: GuideType.HINT
        },
      });
    } catch (err) {
      throw new Error(`Failed to retrieve hint log for user ${userId}: ${err.message}`);
    }
  }

  async getCompleteHelperLogs(userId) {
    try {
      return await GuideLog.findAll({
        where: {
          userId: userId,
          completed: true,
          guideType: GuideType.LINK
        },
      });
    } catch (err) {
      throw new Error(`Failed to retrieve helper link log for user ${userId}: ${err.message}`);
    }
  }


  async getCompleteGuideLogs(userId) {
    try {
      return await GuideLog.findAll({
        where: {
          userId: userId,
          completed: true,
        },
      });
    } catch (err) {
      throw new Error(`Failed to retrieve guide log for user ${userId}: ${err.message}`);
    }
  }

  async getLogsByUser(userId) {
    try {
      return await GuideLog.findAll({
        where: {
          userId: userId,
        },
      });
    } catch (err) {
      throw new Error(`Failed to retrieve guide log for user ${userId}: ${err.message}`);
    }
  }
}

module.exports = new GuideLogService();
