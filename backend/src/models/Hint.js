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
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["no action", "open url", "open url in a new tab"]],
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
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["top", "right", "bottom", "left"]],
        },
      },
      hintContent: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      header: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      headerBackgroundColor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "#FFFFFF",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "headerBackgroundColor");
          },
        },
      },
      headerColor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "#000000",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "headerColor");
          },
        },
      },
      textColor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "#000000",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "textColor");
          },
        },
      },
      buttonBackgroundColor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "#FFFFFF",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "buttonBackgroundColor");
          },
        },
      },
      buttonTextColor: {
        type: DataTypes.STRING,
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
