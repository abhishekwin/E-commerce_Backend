"use strict";

const { hash_password } = require("../../middleware/admin");

const {
  models: { userDetail },
} = require("../models");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const existingUsers = await userDetail.findAll();
      if (existingUsers.length === 0) {
        return queryInterface.bulkInsert("UserDetails", [
          {
            username: "Admin",
            email: "admin@gmail.com",
            password: await hash_password("admin123"),
            isSeller: false,
            role: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            username: "user1",
            email: "user1@example.com",
            password: await hash_password("user1"),
            isSeller: false,
            role: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            username: "user2",
            email: "user2@example.com",
            password: await hash_password("user2"),
            isSeller: false,
            role: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            username: "user3",
            email: "user3@example.com",
            password: await hash_password("user3"),
            isSeller: false,
            role: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            username: "user4",
            email: "user4@example.com",
            password: await hash_password("user4"),
            isSeller: false,
            role: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            username: "user5",
            email: "user5@example.com",
            password: await hash_password("user5"),
            isSeller: false,
            role: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            username: "seller1",
            email: "seller1@example.com",
            password: await hash_password("seller1"),
            isSeller: true,
            role: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            username: "seller2",
            email: "seller2@example.com",
            password: await hash_password("seller2"),
            isSeller: true,
            role: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            username: "seller3",
            email: "seller3@example.com",
            password: await hash_password("seller3"),
            isSeller: true,
            role: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            username: "seller4",
            email: "seller4@example.com",
            password: await hash_password("seller4"),
            isSeller: true,
            role: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            username: "seller5",
            email: "seller5@example.com",
            password: await hash_password("seller5"),
            isSeller: true,
            role: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      } else {
        console.log(
          "Data already exists in the Users table. Skipping seeding.",
        );
      }
    } catch (error) {
      console.error("Error seeding users:", error);
    }
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("UserDetails", null, {});
  },
};
