"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductCategories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Products}) {
      // define association here
      // this.hasMany(Products)
    }
  }
  ProductCategories.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      categoryImage: DataTypes.STRING,
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
      modelName: "ProductCategories",
      tableName: "productCategories",
    },
  );
  return ProductCategories;
};
