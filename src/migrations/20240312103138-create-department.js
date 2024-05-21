'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Departments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      departmentName: {
        type: Sequelize.STRING,
        allowNull:false,
        unique:true
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

    await queryInterface.addColumn('Users','departmentId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Departments', 
        key: 'id',
      }
    });

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Departments');
    await queryInterface.removeColumn('Users','departementId');
  }
};