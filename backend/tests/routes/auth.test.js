const request = require('supertest');
const app = require('../../app/app');
const { User } = require('../../app/models');
const { createTestUser } = require('../helpers');
const bcrypt = require('bcrypt');

describe('Auth Routes', () => {
  beforeEach(async () => {
    await User.destroy({ where: {}, force: true });
  });

  describe('POST /auth/register', () => {
    test('Can register new user', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@test.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/auth/register')
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body.token).toBeDefined();
      
      const user = await User.findOne({ where: { email: userData.email }});
      expect(user).toBeDefined();
      expect(user.username).toBe(userData.username);
      expect(user.password_hash).toBeDefined();
    });

    test('Cannot register with existing email', async () => {
      await User.create({
        username: 'existinguser',
        email: 'test@test.com',
        password_hash: await bcrypt.hash('password123', 10)
      });

      const res = await request(app)
        .post('/auth/register')
        .send({
          username: 'another',
          email: 'test@test.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      await User.create({
        username: 'testuser',
        email: 'test@test.com',
        password_hash: await bcrypt.hash('password123', 10)
      });
    });

    test('Can login with correct credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@test.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toBeDefined();
      expect(res.body.user.email).toBe('test@test.com');
    });

    test('Cannot login with wrong password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@test.com',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });

    test('Cannot login with non-existent email', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123'
        });

      expect(res.status).toBe(401);
      expect(res.body.error).toBeDefined();
    });
  });
}); 