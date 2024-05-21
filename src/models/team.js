'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Team.hasMany(models.User, { foreignKey: 'teamId' });
      Team.belongsTo(models.Department, { foreignKey: "departmentId" })
    }
  }
  Team.init({
    teamName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    modelName: 'Team',
  });
  return Team;
};