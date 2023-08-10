// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db.config');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  isVerified :{
    type: DataTypes.BOOLEAN
  },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM("Admin","User","Seller"),defaultValue:"User", allowNull:false },
});

module.exports = User;