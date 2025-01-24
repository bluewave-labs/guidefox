const { validateHexColor } = require("../utils/guide.helper");

/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  const HelperLink = sequelize.define(
    "HelperLink",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: [1, 255],
        },
      },
      headerBackgroundColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: "#F8F9F8",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "headerBackgroundColor");
          },
        },
      },
      linkFontColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: "#344054",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "linkFontColor");
          },
        },
      },
      iconColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: "#7F56D9",
        validate: {
          isHexColor(value) {
            validateHexColor(value, "iconColor");
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
      tableName: "helper_link",
      timestamps: false,
    }
  );

  HelperLink.associate = (models) => {
    HelperLink.belongsTo(models.User, {
      foreignKey: "createdBy",
      as: "creator",
    });
  };

  return HelperLink;
};
