'use strict';

const TABLE_NAME = 'banners'; // Define the table name

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(TABLE_NAME, {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        closeButtonAction: {
          type: Sequelize.STRING(31),
          allowNull: false
        },
        repetitionType: {
          type: Sequelize.STRING(31),
          allowNull: false,
          defaultValue: 'show only once'
        },
        position: {
          type: Sequelize.STRING(31),
          allowNull: false
        },
        url: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        fontColor: {
          type: Sequelize.STRING(15),
          allowNull: false,
          defaultValue: "#FFFFFF"
        },
        backgroundColor: {
          type: Sequelize.STRING(15),
          allowNull: false,
          defaultValue: "#FFFFFF"
        },
        bannerText: {
          type: Sequelize.STRING(511),
          allowNull: false,
          defaultValue: ""
        },
        actionUrl: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        createdBy: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        }
      }, { transaction });

      // Commit the transaction
      await transaction.commit();
    } catch (error) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable(TABLE_NAME, { transaction });
      // Commit the transaction
      await transaction.commit();
    } catch (error) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      throw error;
    }
  }
};
