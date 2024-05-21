'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      gender: {
        type: Sequelize.CHAR,
        allowNull: false 
      },
      telephone: {
        type: Sequelize.INTEGER,
        allowNull: false 
      },
      sickLeaveBalance: {
        type: Sequelize.DOUBLE,
        allowNull: false 
      },
      compensatoryTimeOffBalance: {
        type: Sequelize.DOUBLE,
        allowNull: false 
      },
      leaveBalance: {
        type: Sequelize.DOUBLE,
        allowNull: false 
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false, 
        unique: true 
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false 
      },
      status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true 
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};
