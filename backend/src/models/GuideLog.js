const { GuideType } = require("../utils/guidelog.helper");

module.exports = (sequelize, DataTypes) => {
  const GuideLog = sequelize.define(
    "GuideLog",
    {
      guideType: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: {
            args: [Object.values(GuideType)],
            msg: "guideType must be a valid value.",
          },
        },
      },
      guideId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      showingTime: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      timestamps: false,
      tableName: "guide_logs",
      indexes: [
        {
          name: "idx_guide_logs_userId",
          fields: ["userId"],
        },
        {
          name: "idx_guide_logs_guideId",
          fields: ["guideId"],
        },
        {
          name: "idx_guide_logs_guideType",
          fields: ["guideType"],
        },
        {
          name: "idx_guide_logs_userId_guideId_guideType",
          fields: ["userId", "guideId", "guideType"],
          unique: false,
        },
        {
          name: "idx_guide_logs_showingTime",
          fields: ["showingTime"],
        },
      ],
    }
  );

  return GuideLog;
};
