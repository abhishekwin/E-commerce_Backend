// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('./db.config');

const Category = sequelize.define('Categories', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  categoryName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Category;