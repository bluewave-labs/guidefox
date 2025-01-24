module.exports = (sequelize, DataTypes) => {
  const Banner = sequelize.define(
    'Banner',
    {
      closeButtonAction: {
        type: DataTypes.STRING(31),
        allowNull: false,
      },
      repetitionType: {
        type: DataTypes.STRING(31),
        allowNull: false,
        defaultValue: 'show only once',
      },
      position: {
        type: DataTypes.STRING(31),
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fontColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: '#FFFFFF',
      },
      backgroundColor: {
        type: DataTypes.STRING(15),
        allowNull: false,
        defaultValue: '#FFFFFF',
      },
      bannerText: {
        type: DataTypes.STRING(511),
        allowNull: false,
        defaultValue: '',
      },
      actionUrl: {
        type: DataTypes.STRING,
        allowNull: true,
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
      tableName: 'banners',
      timestamps: false,
    }
  );

  Banner.associate = (models) => {
    Banner.belongsTo(models.User, { foreignKey: 'createdBy', as: 'creator' });
  };
  return Banner;
};
