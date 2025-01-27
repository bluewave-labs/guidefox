'use strict';

const TABLE_NAME = 'guide_logs'; // Define the table name

module.exports = {
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').Sequelize} Sequelize
   */
  up: async (queryInterface, Sequelize) => {
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
          guideType: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          guideId: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          userId: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          showingTime: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: true,
          },
          completed: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: true,
          },
        },
        { transaction }
      );

      // Creating indexes as per the model definition
      try {
        await queryInterface.addIndex('guide_logs', ['userId'], { name: 'idx_guide_logs_userId', transaction });
        await queryInterface.addIndex('guide_logs', ['guideId'], { name: 'idx_guide_logs_guideId', transaction });
        await queryInterface.addIndex('guide_logs', ['guideType'], { name: 'idx_guide_logs_guideType', transaction });
        await queryInterface.addIndex('guide_logs', ['userId', 'guideId', 'guideType'], {
          name: 'idx_guide_logs_userId_guideId_guideType',
          unique: false,
          transaction,
        });
        await queryInterface.addIndex('guide_logs', ['showingTime'], {
          name: 'idx_guide_logs_showingTime',
          transaction,
        });
      } catch (error) {
        console.log('Error creating index:', error);
      }
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
  },
};
