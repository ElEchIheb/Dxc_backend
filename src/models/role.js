'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.hasMany(models.User, { foreignKey: 'roleId'});
    }
  }
  Role.init({
    roleName:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
          isIn: {
            args: [['admin', 'superadmin', 'collaborator','manager']],
            msg: "Must be a valid role" 
          }
        }}
  }, {
    sequelize,
    modelName: 'Role',
  });
  return Role;
};