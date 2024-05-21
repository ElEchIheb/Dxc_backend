'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    await queryInterface.changeColumn('Postes', 'leave', {
      type: Sequelize.DOUBLE,
      allowNull: false, 
    });
   
    await queryInterface.changeColumn('Postes', 'sickLeave', {
      type: Sequelize.DOUBLE,
      allowNull: false, 
    });
  },

  down: async (queryInterface, Sequelize) => {
   
    await queryInterface.changeColumn('Postes', 'sickLeave', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('Postes', 'leave', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};
