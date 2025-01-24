const settings = require('../../config/settings');
const { validateHexColor } = require('../utils/guide.helper');
const { validateUrl, validateRelativeUrl } = require('../utils/popup.helper');

module.exports = (sequelize, DataTypes) => {
  const Popup = sequelize.define(
    'Popup',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      closeButtonAction: {
        type: DataTypes.ENUM(settings.popup.action),
        allowNull: false,
      },
      repetitionType: {
        type: DataTypes.ENUM(settings.popup.repetition),
        allowNull: false,
        defaultValue: settings.popup.repetition[0] ?? 'show only once',
      },
      popupSize: {
        type: DataTypes.ENUM(settings.popup.size),
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl(value) {
            validateRelativeUrl(value, 'url');
          },
        },
      },
      actionButtonText: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      headerBackgroundColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: '#FFFFFF',
        validate: {
          isHexColor(value) {
            validateHexColor(value, 'headerBackgroundColor');
          },
        },
      },
      headerColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: '#FFFFFF',
        validate: {
          isHexColor(value) {
            validateHexColor(value, 'headerColor');
          },
        },
      },
      textColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: '#FFFFFF',
        validate: {
          isHexColor(value) {
            validateHexColor(value, 'textColor');
          },
        },
      },
      buttonBackgroundColor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '#FFFFFF',
        validate: {
          isHexColor(value) {
            validateHexColor(value, 'buttonBackgroundColor');
          },
        },
      },
      buttonTextColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: '#FFFFFF',
        validate: {
          isHexColor(value) {
            validateHexColor(value, 'buttonTextColor');
          },
        },
      },
      header: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: '',
      },
      content: {
        type: DataTypes.STRING(2047),
        allowNull: false,
        defaultValue: '',
      },
      actionUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl(value) {
            validateUrl(value, 'actionUrl');
          },
        },
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
      tableName: 'popups',
      timestamps: false,
    }
  );

  Popup.associate = (models) => {
    Popup.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  };

  return Popup;
};
