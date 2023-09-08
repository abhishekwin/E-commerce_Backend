"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("addCarts", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true,
      },
      items: {
        type: Sequelize.ARRAY(Sequelize.BIGINT),
        allowNull: true,
        defaultValue: [],
      },
      userId: {
        type: Sequelize.BIGINT,
        references: { model: "UserDetails", key: "id" },
      },
      gst: {
        type: Sequelize.FLOAT,
      },
      discount: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      deliveryCharges: {
        type: Sequelize.STRING,
        defaultValue: "FREE",
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: null,
      },
      totalAmount: {
        type: Sequelize.FLOAT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("addCarts");
  },
};
