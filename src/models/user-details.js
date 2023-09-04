"use strict";
const { Model } = require("sequelize");

const {
  TableConstants: { USER_DETAILS, USER_ROLE },
} = require("../constants/table.constant");
module.exports = (sequelize, DataTypes) => {
  class UserDetail extends Model {
    static associate(models) {
      const { userRole, Product,addCart} = models
      this.belongsTo(userRole, {
        foreignKey: "role",
        // as: "userRoles",
        allowNull: false,
        onDelete: "cascade",
        onUpdate: "cascade",
      });
      this.hasMany(Product, {foreignKey:"sellerId"})
      this.hasMany(addCart, {foreignKey:"userId"})
    }
    toJSON() {
      return { ...this.get() };
    }
  }
  UserDetail.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      isSeller: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      role: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: { model: USER_ROLE.tableName, key: "id" },
      },
    },
    {
      sequelize,
      modelName: USER_DETAILS.modelName,
      tableName: USER_DETAILS.tableName,
      timestamps: true,
    },
  );
  return UserDetail;
};
