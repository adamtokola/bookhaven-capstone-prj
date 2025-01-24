const request = require('supertest');
const app = require('../../app/app');
const { User, Book, Review } = require('../../app/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

describe('User Routes', () => {
  let token;
  let testUser;

  beforeEach(async () => {
    // Clear users before each test
    await User.destroy({ where: {}, force: true });
    await Review.destroy({ where: {}, force: true });
    await Book.destroy({ where: {}, force: true });

    // Create test user
    testUser = await User.create({
      username: 'testuser',
      email: 'test@test.com',
      password_hash: await bcrypt.hash('password123', 10),
      role: 'user'
    });

    token = jwt.sign(
      { id: testUser.id, email: testUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  });

  describe('GET /users/profile', () => {
    test('Can get own profile', async () => {
      const res = await request(app)
        .get('/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.username).toBe('testuser');
      expect(res.body.email).toBe('test@test.com');
      expect(res.body.password_hash).toBeUndefined();  // Should not return password hash
    });

    test('Cannot get profile without auth', async () => {
      const res = await request(app)
        .get('/users/profile');

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /users/profile', () => {
    test('Can update own profile', async () => {
      const res = await request(app)
        .put('/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: 'updateduser',
          email: 'updated@test.com'
        });

      expect(res.status).toBe(200);
      expect(res.body.username).toBe('updateduser');
      expect(res.body.email).toBe('updated@test.com');

      // Verify database was updated
      const updatedUser = await User.findByPk(testUser.id);
      expect(updatedUser.username).toBe('updateduser');
    });

    test('Can update password', async () => {
      const res = await request(app)
        .put('/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123'
        });

      expect(res.status).toBe(200);

      // Verify new password works
      const loginRes = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@test.com',
          password: 'newpassword123'
        });

      expect(loginRes.status).toBe(200);
      expect(loginRes.body.token).toBeDefined();
    });

    test('Cannot update with invalid current password', async () => {
      const res = await request(app)
        .put('/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword123'
        });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /users/:userId/reviews', () => {
    test('Can get user reviews', async () => {
      const book = await Book.create({
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        averageRating: 0
      });

      await Review.create({
        userId: testUser.id,
        bookId: book.id,
        rating: 4,
        reviewText: 'Great book!'
      });

      await Review.create({
        userId: testUser.id,
        bookId: book.id,
        rating: 5,
        reviewText: 'Excellent read!'
      });

      const res = await request(app)
        .get(`/users/${testUser.id}/reviews`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[1].reviewText).toBe('Great book!');
      expect(res.body[0].reviewText).toBe('Excellent read!');
      expect(res.body[0].book).toBeDefined();
    });
  });

  describe('DELETE /users/profile', () => {
    test('Can delete own account', async () => {
      const res = await request(app)
        .delete('/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'password123' 
        });

      expect(res.status).toBe(204);

      const deletedUser = await User.findByPk(testUser.id);
      expect(deletedUser).toBeNull();
    });

    test('Cannot delete account with wrong password', async () => {
      const res = await request(app)
        .delete('/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);

      const user = await User.findByPk(testUser.id);
      expect(user).toBeDefined();
    });
  });
}); 