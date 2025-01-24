'use strict';

const TABLE_NAME = 'tokens'; // Define the table name

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        TABLE_NAME,
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          token: {
            type: Sequelize.STRING(500),
            allowNull: false,
          },
          userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'users',
              key: 'id',
            },
          },
          type: {
            type: Sequelize.STRING(10),
            allowNull: false,
          },
          expiresAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction }
      );

      const [allTokens] = await queryInterface.sequelize.query(`SELECT * FROM ${TABLE_NAME}`, { transaction });
      await queryInterface.removeColumn(TABLE_NAME, 'type', { transaction });

      await queryInterface.addColumn(
        TABLE_NAME,
        'type',
        {
          type: Sequelize.ENUM('auth', 'reset'),
          allowNull: false,
          defaultValue: 'auth',
        },
        { transaction }
      );

      if (allTokens.length > 0) {
        await Promise.all(
          allTokens.map(async (val) => {
            await queryInterface.sequelize.query('UPDATE :table SET type = :type WHERE id = :id', {
              replacements: { table: TABLE_NAME, type: val.type, id: val.id },
              transaction,
            });
          })
        );
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
