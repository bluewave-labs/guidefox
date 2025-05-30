'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('popups', 'actionUrl', 'actionButtonUrl');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('popups', 'actionButtonUrl', 'actionUrl');
  }
};
