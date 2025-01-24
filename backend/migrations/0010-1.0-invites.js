'use strict';
const settings = require('../config/settings');

const TABLE_NAME = 'invites'; // Define the table name

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(TABLE_NAME, {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true
        },
        invitedBy: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        invitedEmail: {
          type: Sequelize.STRING(100),
          allowNull: false
        },
        role: {
          type: Sequelize.ENUM,
          values: settings.user.roleEnum,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
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
