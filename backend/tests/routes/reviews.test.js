const request = require('supertest');
const app = require('../../app/app');
const { Book, User, Review } = require('../../app/models');
const jwt = require('jsonwebtoken');

describe('Review Routes', () => {
  let token;
  let testUser;
  let testBook;
  
  beforeEach(async () => {
    // Create test user
    testUser = await User.create({
      username: 'testuser',
      email: 'test@test.com',
      password_hash: 'hashedpassword',
      role: 'user'
    });
    
    // Create test book
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

  describe('POST /books/:bookId/reviews', () => {
    test('Can create a review', async () => {
      const reviewData = {
        rating: 4,
        reviewText: 'Great book!'
      };

      const res = await request(app)
        .post(`/books/${testBook.id}/reviews`)
        .set('Authorization', `Bearer ${token}`)
        .send(reviewData);

      expect(res.status).toBe(201);
      expect(res.body.rating).toBe(4);
      expect(res.body.reviewText).toBe('Great book!');
      expect(res.body.book).toBeDefined();
      expect(res.body.user).toBeDefined();
    });

    test('Cannot review same book twice', async () => {
      // Create first review
      await Review.create({
        userId: testUser.id,
        bookId: testBook.id,
        rating: 4,
        reviewText: 'First review'
      });

      // Try to create second review
      const res = await request(app)
        .post(`/books/${testBook.id}/reviews`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          rating: 5,
          reviewText: 'Second review'
        });

      expect(res.status).toBe(400);
    });

    test('Cannot create review without auth', async () => {
      const res = await request(app)
        .post(`/books/${testBook.id}/reviews`)
        .send({
          rating: 4,
          reviewText: 'Great book!'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /books/:bookId/reviews', () => {
    test('Can get book reviews', async () => {
      // Create reviews
      await Review.create({
        userId: testUser.id,
        bookId: testBook.id,
        rating: 4,
        reviewText: 'Great book!'
      });

      await Review.create({
        userId: testUser.id,
        bookId: testBook.id,
        rating: 5,
        reviewText: 'Excellent!'
      });

      const res = await request(app)
        .get(`/books/${testBook.id}/reviews`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].user).toBeDefined();
      expect(res.body[0].book).toBeDefined();
    });
  });

  describe('PUT /books/:bookId/reviews/:reviewId', () => {
    test('Can update own review', async () => {
      // Create review
      const review = await Review.create({
        userId: testUser.id,
        bookId: testBook.id,
        rating: 4,
        reviewText: 'Original review'
      });

      const res = await request(app)
        .put(`/books/${testBook.id}/reviews/${review.id}`)
        .set('Authorization', `Bearer ${token}`)  // Added auth header
        .send({
          rating: 5,
          reviewText: 'Updated review'
        });

      expect(res.status).toBe(200);
      expect(res.body.rating).toBe(5);
      expect(res.body.reviewText).toBe('Updated review');
    });

    test('Cannot update review without auth', async () => {
      const review = await Review.create({
        userId: testUser.id,
        bookId: testBook.id,
        rating: 4,
        reviewText: 'Original review'
      });

      const res = await request(app)
        .put(`/books/${testBook.id}/reviews/${review.id}`)
        .send({
          rating: 5,
          reviewText: 'Updated review'
        });

      expect(res.status).toBe(401);
    });
  });
}); 