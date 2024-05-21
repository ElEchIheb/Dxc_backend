'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Department.hasMany(models.User, { foreignKey: 'departmentId' });
      Department.hasMany(models.Poste, { foreignKey: 'departmentId' });
      Department.hasMany(models.Team,{forignKey:"departmentId"})
    }
  }
  Department.init({
    departmentName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Department',
  });
  return Department;
};