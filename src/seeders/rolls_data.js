'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserRoles', [
      {
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        role: 'seller',
  createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserRoles', null, {});
  },
};
