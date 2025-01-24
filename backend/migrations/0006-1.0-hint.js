'use strict';

const TABLE_NAME = 'hints'; // Define the table name

module.exports = {
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
          repetitionType: {
            type: Sequelize.STRING(255),
            allowNull: false,
            defaultValue: 'show only once',
          },
          action: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          actionButtonUrl: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          actionButtonText: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          targetElement: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          tooltipPlacement: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          isHintIconVisible: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: true,
          },
          hintContent: {
            type: Sequelize.STRING(2047),
            allowNull: false,
          },
          header: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          headerBackgroundColor: {
            type: Sequelize.STRING(15),
            allowNull: false,
          },
          headerColor: {
            type: Sequelize.STRING(15),
            allowNull: false,
          },
          textColor: {
            type: Sequelize.STRING(15),
            allowNull: false,
          },
          buttonBackgroundColor: {
            type: Sequelize.STRING(15),
            allowNull: false,
          },
          buttonTextColor: {
            type: Sequelize.STRING(15),
            allowNull: false,
          },
          createdBy: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
          },
          url: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
        },
        { transaction }
      );

      const [allHints] = await queryInterface.sequelize.query(`SELECT * FROM ${TABLE_NAME}`, { transaction });
      await queryInterface.removeColumn(TABLE_NAME, 'action', { transaction });

      await queryInterface.addColumn(
        TABLE_NAME,
        'action',
        {
          type: Sequelize.ENUM('no action', 'open url', 'open url in a new tab'),
          allowNull: false,
          defaultValue: 'no action',
        },
        { transaction }
      );

      await queryInterface.removeColumn(TABLE_NAME, 'tooltipPlacement', { transaction });

      await queryInterface.addColumn(
        TABLE_NAME,
        'tooltipPlacement',
        {
          type: Sequelize.ENUM('top', 'right', 'bottom', 'left'),
          allowNull: false,
          defaultValue: 'top',
        },
        { transaction }
      );

      await queryInterface.removeColumn(TABLE_NAME, 'repetitionType', { transaction });

      await queryInterface.addColumn(
        TABLE_NAME,
        'repetitionType',
        {
          type: Sequelize.ENUM('show only once', 'show every visit'),
          allowNull: false,
          defaultValue: 'show only once',
        },
        { transaction }
      );

      if (allHints.length > 0) {
        const updates = allHints.map((val) => ({
          id: val.id,
          action: val.action,
          tooltipPlacement: val.tooltipPlacement,
          repetitionType: val.repetitionType,
        }));

        await queryInterface.bulkUpdate(TABLE_NAME, updates, null, { transaction });
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
