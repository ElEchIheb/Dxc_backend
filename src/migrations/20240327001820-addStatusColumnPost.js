'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('postes','status', {
      type: Sequelize.BOOLEAN,
      defaultValue: true 
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('postes','status');

  }
};
