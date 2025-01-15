'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Comments', [
      {
        content: 'I agree! A must-read.',
        reviewId: 1,
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        content: 'Not my favorite, but well-written.',
        reviewId: 2,
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Comments', null, {});
  },
};
