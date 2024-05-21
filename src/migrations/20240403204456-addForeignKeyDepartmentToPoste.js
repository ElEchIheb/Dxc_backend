'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Postes','departmentId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Departments', 
        key: 'id',
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Postes','departmentId');
  }
};
