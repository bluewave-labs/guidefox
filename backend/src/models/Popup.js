const {
  validateHexColor,
  validateActionButton,
  ensureValidRepetitionOption,
} = require("../utils/guide.helper");
const {
  validatePopupSizeWrapper,
  validateUrl,
  validateRelativeUrl,
} = require("../utils/popup.helper");

module.exports = (sequelize, DataTypes) => {
  const Popup = sequelize.define(
    "Popup",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      closeButtonAction: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidAction(value) {
            validateActionButton(value);
          },
        },
      },
      repetitionType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'show only once',
        validate: {
          isValidAction(value) {
            ensureValidRepetitionOption(value);
          },
        },
      },
      popupSize: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidPopupSize(value) {
            validatePopupSizeWrapper(value);
          },
        },
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl(value) {
            validateRelativeUrl(value, "url");
          },
        },
      },
      actionButtonText: {
        type: DataTypes.STRING,
        allowNull: true,
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
        defaultValue: "#FFFFFF",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "headerColor");
          },
        },
      },
      textColor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "#FFFFFF",
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
        defaultValue: "#FFFFFF",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "buttonTextColor");
          },
        },
      },
      header: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      content: {
        type: DataTypes.STRING(1024),
        allowNull: false,
        defaultValue: "",
      },
      actionUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl(value) {
            validateUrl(value, "actionUrl");
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
      tableName: "popup",
      timestamps: false,
    }
  );

  Popup.associate = (models) => {
    Popup.belongsTo(models.User, { foreignKey: "createdBy", as: "creator" });
  };

  return Popup;
};
