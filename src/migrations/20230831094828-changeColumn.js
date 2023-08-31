'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Change column name and type
    await queryInterface.renameColumn('Products', 'category', 'categoryId');
    // await queryInterface.changeColumn('Products', 'categoryId', {
    //   type: Sequelize.STRING,
    //   allowNull: false, // Update other attributes as needed
    // });
  },

  down: async (queryInterface, Sequelize) => {
      // Revert changes
    await queryInterface.renameColumn('Products', 'categoryId', 'category');
    // await queryInterface.changeColumn('Products', 'categoryId', {
    //   type: Sequelize.INTEGER,
    //   allowNull: false, // Restore other attributes as needed
    // });
  },
};
