const {
  validateHexColor,
  validateActionButton,
  ensureValidRepetitionOption,
} = require("../utils/guide.helper");
const {
  validatePositionWrapper,
  validateUrl,
  validateRelativeUrl,
} = require("../utils/banner.helper");

module.exports = (sequelize, DataTypes) => {
  const Banner = sequelize.define(
    "Banner",
    {
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
      position: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isValidPosition(value) {
            validatePositionWrapper(value);
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
      fontColor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "#FFFFFF",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "fontColor");
          },
        },
      },
      backgroundColor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "#FFFFFF",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "backgroundColor");
          },
        },
      },
      bannerText: {
        type: DataTypes.STRING,
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
      tableName: "banners",
      timestamps: false,
    }
  );

  Banner.associate = (models) => {
    Banner.belongsTo(models.User, { foreignKey: "createdBy", as: "creator" });
  };
  return Banner;
};
