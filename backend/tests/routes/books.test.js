const request = require('supertest');
const app = require('../../app/app');
const { Book, User } = require('../../app/models');
const { createTestBook, createTestUser } = require('../helpers');
const jwt = require('jsonwebtoken');

describe('Book Routes', () => {
  let token;
  let testUser;
  
  beforeEach(async () => {
    await Book.destroy({ where: {}, force: true });
    
    testUser = await User.create({
      username: 'testuser',
      email: 'test@test.com',
      password_hash: 'hashedpassword',
      role: 'user'
    });
    
    token = jwt.sign(
      { id: testUser.id, email: testUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  });

  describe('GET /books', () => {
    test('Can get list of books', async () => {
      await Book.bulkCreate([
        {
          title: 'Test Book 1',
          author: 'Author 1',
          genre: 'Fiction',
          averageRating: 4.5
        },
        {
          title: 'Test Book 2',
          author: 'Author 2',
          genre: 'Non-Fiction',
          averageRating: 4.0
        }
      ]);

      const res = await request(app)
        .get('/books')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].title).toBe('Test Book 1');
    });

    test('Can search books by title', async () => {
      await Book.bulkCreate([
        {
          title: 'The Great Gatsby',
          author: 'F. Scott Fitzgerald',
          genre: 'Fiction',
          averageRating: 4.5
        },
        {
          title: '1984',
          author: 'George Orwell',
          genre: 'Fiction',
          averageRating: 4.0
        }
      ]);

      const res = await request(app)
        .get('/books?search=gatsby')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].title).toBe('The Great Gatsby');
    });

    test('Can filter books by genre', async () => {
      await Book.bulkCreate([
        {
          title: 'Fiction Book',
          author: 'Author 1',
          genre: 'Fiction',
          averageRating: 4.5
        },
        {
          title: 'Non-Fiction Book',
          author: 'Author 2',
          genre: 'Non-Fiction',
          averageRating: 4.0
        }
      ]);

      const res = await request(app)
        .get('/books?genre=Fiction')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(1);
      expect(res.body[0].genre).toBe('Fiction');
    });
  });

  describe('GET /books/:id', () => {
    test('Can get book by id', async () => {
      const book = await Book.create({
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        averageRating: 4.5
      });

      const res = await request(app)
        .get(`/books/${book.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Test Book');
      expect(res.body.author).toBe('Test Author');
    });

    test('Returns 404 for non-existent book', async () => {
      const res = await request(app)
        .get('/books/999999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
}); 