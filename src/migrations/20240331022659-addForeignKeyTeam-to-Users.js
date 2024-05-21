'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('Users','teamId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Teams', 
        key: 'id',
      }
    }); 
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users','teamId');
  }
};
