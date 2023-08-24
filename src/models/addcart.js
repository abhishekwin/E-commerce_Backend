"use strict";
const { Model } = require("sequelize");
const {  TableConstants: { USER_DETAILS }, TableConstants,} = require("../constants/table.constant");
module.exports = (sequelize, DataTypes) => {
  class addCart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({userDetail}) {
      userDetail.hasOne(addCart, {
        foreignKey: "userId",
        as: "userDetail",
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
      addCart.belongsTo(userDetail,{
        foreignKey: "id"
      });
      
    }
  }
  addCart.init(
    { 
      id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      unique: true,
      primaryKey: true
    },
      items: {
        type: DataTypes.ARRAY(DataTypes.JSONB),
        // references: { model: "Products", key: "id" },
        allowNull: true,
        defaultValue: [],
      },
      userId: {   
        type: DataTypes.BIGINT,
        references: { model: USER_DETAILS.tableName, key: "userId" }
       },
      gst: {
        type : DataTypes.FLOAT
      },
      quantity : {
        type : DataTypes.INTEGER,
        defaultValue : null
      },
      totalAmount : {
        type : DataTypes.INTEGER,
        defaultValue : null
      }

    },
    {
      sequelize,
      modelName: "addCart",
      tableName: "addCarts",
    },
  );
  return addCart;
};
