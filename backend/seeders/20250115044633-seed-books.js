'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('Books', [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Classic',
        averageRating: 4.3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian',
        averageRating: 4.7,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('Books', null, {});
  },
};
