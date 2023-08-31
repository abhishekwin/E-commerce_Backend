"use strict";
const { Model } = require("sequelize");
const {
  TableConstants: { USER_DETAILS },
} = require("../constants/table.constant");

module.exports = (sequelize, DataTypes) => {
  class addCart extends Model {
    static associate({ userDetail, Product }) {
      addCart.belongsTo(userDetail, { foreignKey: "userId", allowNull: false });
      addCart.belongsTo(Product, { foreignKey: "items" });
    }
  }
  addCart.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      items: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true,
        defaultValue: [],
      },
      userId: {
        type: DataTypes.BIGINT,
        references: { model: "userDetail", key: "userId" },
      },
      gst: {
        type: DataTypes.FLOAT,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      totalAmount: {
        type: DataTypes.FLOAT,
      },
    },
    {
      sequelize,
      modelName: "addCart",
      tableName: "addCarts",
    },
  );
  return addCart;
};
