"use strict";

const {
  models: { userRole },
} = require("../models");
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const existingUserRole = await userRole.findAll();
      if (existingUserRole.length === 0) {
        return queryInterface.bulkInsert("UserRoles", [
          {
            role: "admin",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            role: "user",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            role: "seller",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      } else {
        console.log(
          "Data already exists in the UserRole table. Skipping seeding.",
        );
      }
    } catch (error) {
      console.error("Error seeding users:", error);
    }
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("UserRoles", null, {});
  },
};
