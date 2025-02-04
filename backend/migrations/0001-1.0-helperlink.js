'use strict';

const TABLE_NAME = 'helper_link'; // Define the table name

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
        title: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        headerBackgroundColor: {
          type: Sequelize.STRING(15),
          allowNull: false,
          defaultValue : '#F8F9F8'
        },
        linkFontColor: {
          type: Sequelize.STRING(15),
          allowNull: false,
          defaultValue : '#344054'
        },
        iconColor: {
          type: Sequelize.STRING(15),
          allowNull: false,
          defaultValue: '#7F56D9'
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
      // Drop the guide_logs table
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