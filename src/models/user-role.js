"use strict";
const { Model, Sequelize } = require("sequelize");
const {
  TableConstants: { USER_ROLE },
} = require("../constants/table.constant");
const { UserRoles } = require("../constants/roles.constant");

module.exports = (sequelize, DataTypes) => {
  class UserRole extends Model {
    static associate() {}
  }
  UserRole.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: UserRoles.USER,
        unique: true,
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
      modelName: USER_ROLE.modelName,
      tableName: USER_ROLE.tableName,
      timestamps: true,
    },
  );
  return UserRole;
};
