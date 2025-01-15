'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Users', [
      {
        username: 'testuser',
        email: 'testuser@example.com',
        password: '$2b$10$N9qo8uLOickgx2ZMRZo5e.7bY3o.YrPM.pGFiEtT3fHqGxgOK08eG',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: 'anotheruser',
        email: 'anotheruser@example.com',
        password: '$2b$10$N9qo8uLOickgx2ZMRZo5e.7bY3o.YrPM.pGFiEtT3fHqGxgOK08eG',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
