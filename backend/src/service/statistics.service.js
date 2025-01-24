const db = require("../models");
const { GuideType } = require("../utils/guidelog.helper");
const GuideLog = db.GuideLog;

class StatisticsService {
  async generateStatistics() {
    try {
      const now = new Date();
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const views = [];
      for (const [guideName, guideType] of Object.entries(GuideType)) {
        const logs = await GuideLog.findAll({
          where: {
            guideType: Number(guideType),
            showingTime: {
              [db.Sequelize.Op.gte]: twoMonthsAgo,
            },
          },
        });
        const { thisMonthViews, lastMonthViews } = logs.reduce(
          (acc, log) => {
            if (log.guideType !== guideType) {
              return acc;
            }
            if (log.showingTime >= thisMonth) {
              acc.thisMonthViews += 1;
            } else if (log.showingTime >= lastMonth) {
              acc.lastMonthViews += 1;
            }
            return acc;
          },
          { thisMonthViews: 0, lastMonthViews: 0 }
        );
        const percentageDifference =
          lastMonthViews === 0
            ? 0
            : Math.round(
                ((thisMonthViews - lastMonthViews) / lastMonthViews) * 100
              );
        const result = {
          views: thisMonthViews,
          change: percentageDifference,
          guideType: guideName.toLowerCase(),
        };
        views.push(result);
      }
      return views.sort((a, b) => b.views - a.views);
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to generate statistics: ${error.message}`);
    }
  }
}

module.exports = new StatisticsService();
