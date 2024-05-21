'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Postes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      posteName: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      sickLeave: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      leave: {
        type: Sequelize.INTEGER,
        allowNULL: false
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
    await queryInterface.dropTable('Postes');
  }
};