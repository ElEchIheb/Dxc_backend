'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
   
    await queryInterface.changeColumn('Users', 'telephone', {
      type: Sequelize.INTEGER,
      allowNull: true 
    });

    await queryInterface.changeColumn('Users', 'sickLeaveBalance', {
      type: Sequelize.DOUBLE,
      allowNull: true 
    });

    await queryInterface.changeColumn('Users', 'compensatoryTimeOffBalance', {
      type: Sequelize.DOUBLE,
      allowNull: true 
    });

    await queryInterface.changeColumn('Users', 'leaveBalance', {
      type: Sequelize.DOUBLE,
      allowNull: true 
    });

    await queryInterface.addColumn('Users', 'imageName', {
      type: Sequelize.STRING
    });

    await queryInterface.changeColumn('Postes', 'posteName', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false 
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Users', 'telephone', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    await queryInterface.changeColumn('Users', 'sickLeaveBalance', {
      type: Sequelize.DOUBLE,
      allowNull: false
    });

    await queryInterface.changeColumn('Users', 'compensatoryTimeOffBalance', {
      type: Sequelize.DOUBLE,
      allowNull: false
    });

    await queryInterface.changeColumn('Users', 'leaveBalance', {
      type: Sequelize.DOUBLE,
      allowNull: false
    });

    await queryInterface.removeColumn('Users', 'imageName');

    
    await queryInterface.changeColumn('Postes', 'posteName', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  }
};
