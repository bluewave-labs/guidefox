'use strict';

const TABLE_NAME = 'helper_link';

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
      await queryInterface.addColumn(
        TABLE_NAME,
        'url',
        {
          type: Sequelize.STRING(255),
          allowNull: false,
          defaultValue: '/',
        },
        { transaction }
      );

      await queryInterface.addColumn(
        TABLE_NAME,
        'active',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        TABLE_NAME,
        'absolutePath',
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        { transaction }
      );

      await transaction.commit();
    } catch {
      await transaction.rollback();
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeColumn(TABLE_NAME, 'url', { transaction });
      await queryInterface.removeColumn(TABLE_NAME, 'active', { transaction });
      await queryInterface.removeColumn(TABLE_NAME, 'absolutePath', { transaction });
      await transaction.commit();
    } catch {
      await transaction.rollback();
    }
  },
};
