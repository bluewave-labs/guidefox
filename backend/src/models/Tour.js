const settings = require('../../config/settings');
const { validateHexColor } = require('../utils/guide.helper');
const { validateUrl } = require('../utils/tour.helper');

module.exports = (sequelize, DataTypes) => {
  const Tour = sequelize.define(
    'Tour',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      headerColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: '#101828',
        validate: {
          isHexColor(value) {
            validateHexColor(value, 'headerColor');
          },
        },
      },
      textColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: '#344054',
        validate: {
          isHexColor(value) {
            validateHexColor(value, 'textColor');
          },
        },
      },
      buttonBackgroundColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: '#7F56D9',
        validate: {
          isHexColor(value) {
            validateHexColor(value, 'buttonBackgroundColor');
          },
        },
      },
      buttonTextColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: '#ffffff',
        validate: {
          isHexColor(value) {
            validateHexColor(value, 'buttonTextColor');
          },
        },
      },
      size: {
        type: DataTypes.ENUM(settings.tour.size),
        allowNull: false,
        defaultValue: settings.tour.size[1],
      },
      finalButtonText: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Complete tour',
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '/',
        validate: {
          customValidation(value) {
            if (!validateUrl(value)) {
              throw new Error('Invalid value for URL');
            }
          },
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
    },
    {
      tableName: 'tours',
      timestamps: false,
    }
  );

  Tour.associate = (models) => {
    Tour.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
    Tour.hasMany(models.TourPopup, {
      foreignKey: 'tourPopupId',
      as: 'steps',
      onDelete: 'CASCADE',
    });
  };

  return Tour;
};
