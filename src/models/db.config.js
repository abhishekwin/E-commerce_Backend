// config/database.js
const { Sequelize } = require('sequelize');
const dotenv = require("dotenv")
dotenv.config()

const sequelize = new Sequelize(
    process.env.Database_Name,
    process.env.UserName,
    process.env.Password,
    {
      host: process.env.Host,
      dialect: "postgres",
    }
  );
  
  sequelize
  .authenticate()
  .then(function (result) {
    console.log('Connection has been established successfully.');
  })
  .catch(function (err) {
    console.log('Unable to connect to the database:', err);
  });
module.exports = sequelize;
