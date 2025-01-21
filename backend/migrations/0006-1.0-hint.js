'use strict';

const { url } = require("inspector");

const TABLE_NAME = 'hints'; // Define the table name

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
        repetitionType: {
          type: Sequelize.STRING(255),
          allowNull: false,
          defaultValue: 'show only once'
        },
        action: {
          type: Sequelize.STRING(31),
          allowNull: false,
        },
        actionButtonUrl: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        actionButtonText: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        targetElement: {
          type: Sequelize.STRING(255),
          allowNull: true
        },
        tooltipPlacement: {
          type: Sequelize.STRING(15),
          allowNull: false
        },
        hintContent: {
          type: Sequelize.STRING(2047),
          allowNull: false
        },
        header :{
          type: Sequelize.STRING(255),
          allowNull: false
        },
        headerBackgroundColor :{
          type: Sequelize.STRING(15),
          allowNull: false
        },
        headerColor :{
          type: Sequelize.STRING(15),
          allowNull: false
        },
        textColor :{
          type: Sequelize.STRING(15),
          allowNull: false
        },
        buttonBackgroundColor :{
          type: Sequelize.STRING(15),
          allowNull: false
        },
        buttonTextColor :{
          type: Sequelize.STRING(15),
          allowNull: false
        },
        createdBy: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        url: {
          type: Sequelize.STRING(255),
          allowNull: true,
        },

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
