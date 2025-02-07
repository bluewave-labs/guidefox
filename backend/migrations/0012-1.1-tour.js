'use strict';

const { validateHexColor } = require('../src/utils/guide.helper');

const TABLE_NAME = 'tours';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   *
   * @param {import("sequelize").QueryInterface} queryInterface
   * @param {import("sequelize").Sequelize} Sequelize
   */
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        TABLE_NAME,
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          headerColor: {
            type: Sequelize.STRING(15),
            allowNull: false,
            defaultValue: '#101828',
            validate: {
              isHexColor(value) {
                validateHexColor(value, 'headerColor');
              },
            },
          },
          textColor: {
            type: Sequelize.STRING(15),
            allowNull: false,
            defaultValue: '#344054',
            validate: {
              isHexColor(value) {
                validateHexColor(value, 'textColor');
              },
            },
          },
          buttonBgColor: {
            type: Sequelize.STRING(15),
            allowNull: false,
            defaultValue: '#7F56D9',
            validate: {
              isHexColor(value) {
                validateHexColor(value, 'buttonBgColor');
              },
            },
          },
          buttonTextColor: {
            type: Sequelize.STRING(15),
            allowNull: false,
            defaultValue: '#ffffff',
            validate: {
              isHexColor(value) {
                validateHexColor(value, 'buttonTextColor');
              },
            },
          },
          size: {
            type: Sequelize.ENUM('small', 'medium', 'large'),
            allowNull: false,
            defaultValue: 'medium',
          },
          finalBtnText: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'Complete tour',
          },
          url: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          createdBy: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
          },
        },
        { transaction }
      );

      // Commit the transaction
      await transaction.commit();
    } catch (error) {
      // Rollback the transaction in case of an error
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
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
  },
};
