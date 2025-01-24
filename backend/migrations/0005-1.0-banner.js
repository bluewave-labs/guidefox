'use strict';

const TABLE_NAME = 'banners'; // Define the table name

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

          closeButtonAction: {
            type: Sequelize.STRING(31),
            allowNull: false,
          },
          repetitionType: {
            type: Sequelize.STRING(31),
            allowNull: false,
            defaultValue: 'show only once',
          },
          position: {
            type: Sequelize.STRING(31),
            allowNull: false,
          },
          url: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          fontColor: {
            type: Sequelize.STRING(15),
            allowNull: false,
            defaultValue: '#FFFFFF',
          },
          backgroundColor: {
            type: Sequelize.STRING(15),
            allowNull: false,
            defaultValue: '#FFFFFF',
          },
          bannerText: {
            type: Sequelize.STRING(511),
            allowNull: false,
            defaultValue: '',
          },
          actionUrl: {
            type: Sequelize.STRING(255),
            allowNull: true,
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

      const [allBanners] = await queryInterface.sequelize.query(`SELECT * FROM ${TABLE_NAME}`, { transaction });
      await queryInterface.removeColumn(TABLE_NAME, 'closeButtonAction', { transaction });

      // Add the new column with ENUM type
      await queryInterface.addColumn(
        TABLE_NAME,
        'closeButtonAction',
        {
          type: Sequelize.ENUM('no action', 'open url', 'open url in a new tab'),
          allowNull: false,
          defaultValue: 'no action',
        },
        { transaction }
      );

      await queryInterface.removeColumn(TABLE_NAME, 'repetitionType', { transaction });

      // Add the new column with ENUM type
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

      await queryInterface.removeColumn(TABLE_NAME, 'position', { transaction });

      // Add the new column with ENUM type
      await queryInterface.addColumn(
        TABLE_NAME,
        'position',
        {
          type: Sequelize.ENUM('top', 'bottom'),
          allowNull: false,
          defaultValue: 'top',
        },
        { transaction }
      );

      if (allBanners.length > 0) {
        const updates = allBanners.map(val => ({
          id: val.id,
          closeButtonAction: val.closeButtonAction,
          repetitionType: val.repetitionType,
          position: val.position
        }));
        
        await queryInterface.bulkUpdate(
          TABLE_NAME,
          updates,
          null,
          { transaction }
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
