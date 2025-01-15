'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Reviews', [
      {
        rating: 5,
        comment: 'A masterpiece of literature!',
        bookId: 1,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        rating: 4,
        comment: 'An insightful book that everyone should read.',
        bookId: 2,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Reviews', null, {});
  },
};
