'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Poste extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Poste.hasMany(models.User, { foreignKey: 'posteId' });
      Poste.belongsTo(models.Department, {foreignKey:'departmentId'});
    }
  }
  Poste.init({
    posteName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    sickLeave: {
      type: DataTypes.DOUBLE,
      allowNull: false
    }
    ,
    leave: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    departmentId:{
      type:DataTypes.INTEGER,
      references: {
        model: 'Department',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Poste',
  });
  return Poste;
};