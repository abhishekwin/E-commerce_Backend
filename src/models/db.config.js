// config/database.js
const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

// const sequelize = new Sequelize(
//     process.env.Database_Name,
//     process.env.UserName,
//     process.env.Password,
//     {
//       host: process.env.Host,
//       dialect: "postgres",
//     }
//   );
const sequelize = new Sequelize(
  "postgres://demoback_user:3GFlVEKDiFeOXNDzP6RC9MjXTsrryWg6@dpg-cj8ulaivvtos73fc77t0-a.oregon-postgres.render.com/demoback",
  {
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Only needed for self-signed certificates
      },
    },
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log("connected");
  })
  .catch(() => {
    console.log("not connected");
  });
module.exports = sequelize;
