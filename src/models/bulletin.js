'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bulletin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  bulletin.init({
    marque: DataTypes.STRING,
    refBS: DataTypes.STRING,
    nomAdherent: DataTypes.STRING,
    prenomMalade: DataTypes.STRING,
    dateSoins: DataTypes.DATE,
    honoraires: DataTypes.STRING,
    pharmacie: DataTypes.STRING,
    analyse:DataTypes.STRING,
    maternite:DataTypes.STRING,
    chirurgie:DataTypes.STRING,
    inject:DataTypes.STRING,
    dent:DataTypes.STRING,
    monture:DataTypes.STRING,
    total:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'bulletin',
  });
  return bulletin;
};