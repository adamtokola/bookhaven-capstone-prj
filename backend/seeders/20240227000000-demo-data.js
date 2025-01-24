'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('comments', null, {});
    await queryInterface.bulkDelete('reviews', null, {});
    await queryInterface.bulkDelete('books', null, {});
    await queryInterface.bulkDelete('users', null, {});

    const users = await queryInterface.bulkInsert('users', [
      {
        username: 'john_doe',
        email: 'john@example.com',
        password_hash: await bcrypt.hash('password123', 10),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        password_hash: await bcrypt.hash('password123', 10),
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    const books = await queryInterface.bulkInsert('books', [
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Classic',
        averageRating: 4.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian',
        averageRating: 4.7,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Classic',
        averageRating: 4.8,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    const reviews = await queryInterface.bulkInsert('reviews', [
      {
        userId: 1,
        bookId: 1,
        rating: 5,
        reviewText: 'A masterpiece of American literature.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 2,
        bookId: 1,
        rating: 4,
        reviewText: 'Beautifully written, captures the essence of the era.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], { returning: true });

    return queryInterface.bulkInsert('comments', [
      {
        userId: 2,
        reviewId: 1,
        commentText: 'I completely agree with your review!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: 1,
        reviewId: 2,
        commentText: 'Thanks for sharing your perspective.',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('comments', null, {});
    await queryInterface.bulkDelete('reviews', null, {});
    await queryInterface.bulkDelete('books', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
}; 