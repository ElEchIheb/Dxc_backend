'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bulletins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      marque: {
        type: Sequelize.STRING
      },
      refBS: {
        type: Sequelize.STRING
      },
      nomAdherent: {
        type: Sequelize.STRING
      },
      prenomMalade: {
        type: Sequelize.STRING
      },
      dateSoins: {
        type: Sequelize.DATE
      },
      honoraires: {
        type: Sequelize.STRING
      },
      pharmacie: {
        type: Sequelize.STRING
      },
      analyse: {
        type: Sequelize.STRING
      },
      maternite: {
        type: Sequelize.STRING
      },
      chirurgie: {
        type: Sequelize.STRING
      },
        	
      inject : {
        type: Sequelize.STRING
      },
      dent : {
        type: Sequelize.STRING
      },
      monture:{
        type: Sequelize.STRING
      },
      total:{
        type: Sequelize.STRING
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
    await queryInterface.dropTable('bulletins');
  }
};