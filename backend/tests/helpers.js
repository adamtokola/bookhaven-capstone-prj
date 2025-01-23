const { Book, User, Review, Comment } = require('../app/models');
const bcrypt = require('bcrypt');

// Create test user
async function createTestUser(override = {}) {
  return User.create({
    username: 'testuser',
    email: 'test@test.com',
    password_hash: await bcrypt.hash('password123', 10),
    role: 'user',
    ...override
  });
}

// Create test book
async function createTestBook(override = {}) {
  return Book.create({
    title: 'Test Book',
    author: 'Test Author',
    genre: 'Test Genre',
    averageRating: 4.0,
    ...override
  });
}

// Create test review
async function createTestReview(userId, bookId, override = {}) {
  return Review.create({
    userId,
    bookId,
    rating: 4,
    reviewText: 'Test review text',
    ...override
  });
}

// Create test comment
async function createTestComment(userId, reviewId, override = {}) {
  return Comment.create({
    userId,
    reviewId,
    commentText: 'Test comment text',
    ...override
  });
}

module.exports = {
  createTestUser,
  createTestBook,
  createTestReview,
  createTestComment
}; 