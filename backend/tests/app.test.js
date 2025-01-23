const request = require('supertest');
const app = require('../app/app');

describe('App', () => {
  test('GET /test returns success message', async () => {
    const res = await request(app)
      .get('/test');
    
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Backend is working!');
  });

  test('Non-existent route returns 404', async () => {
    const res = await request(app)
      .get('/non-existent-route');
    
    expect(res.status).toBe(404);
  });
});