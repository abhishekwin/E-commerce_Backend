'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('addCarts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true,
        primaryKey: true
      },
      items: {
        type: Sequelize.ARRAY(Sequelize.JSONB),
        // references: { model: "Products", key: "id" },
        allowNull: true,
        defaultValue: []
      },
      userId: { 
        type: Sequelize.BIGINT,
        references: { model: "UserDetails", key: "id" }
       },
      gst: {
        type : Sequelize.FLOAT
      },
      quantity : {
        type : Sequelize.INTEGER,
        defaultValue : null
      },
      totalAmount : {
        type : Sequelize.INTEGER,
        defaultValue : null
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('addCarts');
  }
};