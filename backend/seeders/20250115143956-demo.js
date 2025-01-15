'use strict';

const constants = require("../src/utils/constants.helper");
const userRole = constants.ROLE;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = "$2b$10$tQiyc0NpG9UFoH6k6j6IbuPcZNFZFUkFMC28r9752WLqlDB.sIzC." //password123
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Demo",
          surname: 'User',
          email: "bluewaveguidefox@gmail.com",
          password: hashedPassword,
          role: userRole.ADMIN,
          createdAt: new Date(),
        },
      ]
    )
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
