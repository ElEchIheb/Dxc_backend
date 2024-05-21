'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.belongsTo(models.Department, { foreignKey: 'departmentId' });
      User.belongsTo(models.Role, { foreignKey: 'roleId' });
      User.belongsTo(models.Poste, { foreignKey: 'posteId' });
      User.belongsTo(models.Team, { foreignKey: 'teamId' });
    }
  }
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    telephone: {
      type: DataTypes.INTEGER
    },
    sickLeaveBalance: {
      type: DataTypes.DOUBLE
    },
    compensatoryTimeOffBalance: {
      type: DataTypes.DOUBLE
    },
    leaveBalance: {
      type: DataTypes.DOUBLE
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    departmentId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Department',
        key: 'id'
      }
    },
    roleId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Role',
        key: 'id'
      }
    },
    posteId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Poste',
        key: 'id'
      }
    },
    teamId:{
      type: DataTypes.INTEGER,
      references: {
        model: 'Team',
        key: 'id'
    }
  },
  imageName:{
    type:DataTypes.STRING
  }
}, {
    sequelize,
    modelName: 'User',
  });
  return User;
};