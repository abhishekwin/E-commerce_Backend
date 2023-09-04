"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserDetails", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      isSeller: {
        type: Sequelize.BOOLEAN,
      },
      password: { type: Sequelize.STRING },
      role: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: "UserRoles", key: "id" },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("Now"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("Now"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserDetails");
  },
};
