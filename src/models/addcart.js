"use strict";
const { Model } = require("sequelize");
const {
  TableConstants: { USER_DETAILS },
} = require("../constants/table.constant");

module.exports = (sequelize, DataTypes) => {
  class addCart extends Model {
    static associate(models) {
      this.belongsTo(models.userDetail, {
        foreignKey: "userId",
        allowNull: true,
      });
      this.belongsTo(models.Product, { foreignKey: "items" });
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
        type: DataTypes.ARRAY(DataTypes.BIGINT),
        allowNull: true,
        defaultValue: [],
      },
      userId: {
        type: DataTypes.BIGINT,
        references: { model: "UserDetails", key: "id" },
        allowNull: true,
      },
      gst: {
        type: DataTypes.FLOAT,
      },
      discount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        get() {
          return "₹ " + this.getDataValue("discount");
        },
      },
      deliveryCharges: {
        type: DataTypes.STRING,
        defaultValue: "FREE",
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
