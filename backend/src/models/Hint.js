const settings = require("../../config/settings");
const { validateHexColor } = require("../utils/guide.helper");

module.exports = (sequelize, DataTypes) => {
  const Hint = sequelize.define(
    "Hint",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      action: {
        type: DataTypes.ENUM(settings.hint.action),
        allowNull: false,
        validate: {
          isIn: [settings.hint.action],
        },
      },
      repetitionType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [['show only once', 'show every visit']]
        },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      },
      actionButtonUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      actionButtonText: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      targetElement: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tooltipPlacement: {
        type: DataTypes.ENUM(settings.hint.tooltipPlacement),
        allowNull: false,
        validate: {
          isIn: [settings.hint.tooltipPlacement],
        },
      },
      isHintIconVisible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      hintContent: {
        type: DataTypes.STRING(2047),
        allowNull: false,
        defaultValue: "",
      },
      header: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      headerBackgroundColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: "#FFFFFF",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "headerBackgroundColor");
          },
        },
      },
      headerColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: "#000000",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "headerColor");
          },
        },
      },
      textColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: "#000000",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "textColor");
          },
        },
      },
      buttonBackgroundColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: "#FFFFFF",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "buttonBackgroundColor");
          },
        },
      },
      buttonTextColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: "#000000",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "buttonTextColor");
          },
        },
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
    },
    {
      timestamps: false,
      tableName: "hints",
    }
  );

  Hint.associate = (models) => {
    Hint.belongsTo(models.User, { foreignKey: "createdBy", as: "creator" });
  };

  return Hint;
};
