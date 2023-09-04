"use strict";
const { Model, Sequelize } = require("sequelize");
// const UserDetail = require("./user-details")

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {

    static associate(models) {
      const { userDetail,ProductCategories, addCart} = models
      this.belongsTo(userDetail, {foreignKey:"sellerId"})
      this.belongsTo(ProductCategories, {foreignKey:"categoryId"})
      this.hasMany(addCart)
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      productName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model:"productCategories",key:'id'}
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      inStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sellerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{model:"UserDetails",key:'id'}
      },
      productImage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn("Now"),
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.fn("Now"),
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "Products",
    },
  );
  return Product;
};
