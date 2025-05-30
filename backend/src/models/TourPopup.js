/**
 *
 * @param {import('sequelize').Sequelize} sequelize
 * @param {import('sequelize').DataTypes} DataTypes
 * @returns
 */
module.exports = (sequelize, DataTypes) => {
  const TourPopup = sequelize.define(
    'TourPopup',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      header: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      targetElement: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tourId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tours',
          key: 'id',
        },
      },
    },
    {
      tableName: 'tour_popup',
      timestamps: false,
    }
  );

  TourPopup.associate = (models) => {
    TourPopup.belongsTo(models.Tour, {
      foreignKey: 'tourId',
      as: 'tour',
      onDelete: 'CASCADE',
    });
  };

  return TourPopup;
};
