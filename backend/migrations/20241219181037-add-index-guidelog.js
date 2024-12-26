"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addIndex("guide_logs", ["showingTime"], {
      name: "idx_guide_logs_showingTime",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("guide_logs", ["showingTime"], {
      name: "idx_guide_logs_showingTime",
    });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
