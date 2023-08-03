'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Users', 'roll', 'role', {
      type: Sequelize.STRING,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.renameColumn('Users', 'role', 'roll', {
      type: Sequelize.STRING,
    });
}
}