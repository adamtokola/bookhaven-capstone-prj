const request = require('supertest');
const app = require('../../app/app');
const { User, Book } = require('../../app/models');
const jwt = require('jsonwebtoken');

describe('Validation Middleware', () => {
  let token;
  let testUser;
  let testBook;

  beforeEach(async () => {
    testUser = await User.create({
      username: 'testuser',
      email: 'test@test.com',
      password_hash: 'hashedpassword',
      role: 'user'
    });

    testBook = await Book.create({
      title: 'Test Book',
      author: 'Test Author',
      genre: 'Fiction',
      averageRating: 0
    });

    token = jwt.sign(
      { id: testUser.id, email: testUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  });

  describe('Review Validation', () => {
    test('Rejects invalid rating', async () => {
      const res = await request(app)
        .post(`/books/${testBook.id}/reviews`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          rating: 6,  // Invalid rating
          reviewText: 'Great book!'
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    test('Rejects short review text', async () => {
      const res = await request(app)
        .post(`/books/${testBook.id}/reviews`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          rating: 4,
          reviewText: 'Short' 
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });

  describe('Comment Validation', () => {
    test('Rejects empty comment', async () => {
      const res = await request(app)
        .post(`/reviews/1/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          commentText: ''  
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });
  });
}); 