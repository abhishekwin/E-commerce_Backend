'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productDetails extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  productDetails.init({
    productName: DataTypes.STRING,
    description: DataTypes.STRING,
    category: DataTypes.ENUM,
    price: DataTypes.INTEGER,
    inStock: DataTypes.INTEGER,
    sellerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'productDetails',
  });
  return productDetails;
};