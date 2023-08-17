'use strict';
const {
  Model
} = require('sequelize');

const {
  
  TableConstants: { USER_DETAILS,USER_ROLE },
} = require('../constants/table.constant');
module.exports = (sequelize, DataTypes) => {
  class UserDetail extends Model {
    static associate({ userRole }) {
      this.belongsTo(userRole, {
        foreignKey: 'id',
        as: 'userRoles',
        allowNull: false,
        onDelete: 'cascade',
        onUpdate: 'cascade',
      });
    }

    toJSON() {
      return { ...this.get() };
    }
  }
  UserDetail.init({
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isVerified: {
      type: DataTypes.BOOLEAN,
    },
    role: {
      type: DataTypes.BIGINT,
      allowNull: false,
       references: {  model: USER_ROLE.tableName, key: 'id' },
    },
  }, {
    sequelize,
    modelName: USER_DETAILS.modelName,
      tableName: USER_DETAILS.tableName,
      timestamps:true
  });
  return UserDetail;
};