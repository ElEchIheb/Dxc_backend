'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('Users','posteId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Postes', 
        key: 'id',
      }
    });
  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users','posteId');
  }
};
