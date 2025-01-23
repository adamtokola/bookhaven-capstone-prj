const request = require('supertest');
const app = require('../../app/app');
const { Book, User, Review, Comment } = require('../../app/models');
const jwt = require('jsonwebtoken');

describe('Comment Routes', () => {
  let token;
  let testUser;
  let testBook;
  let testReview;
  
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

    // Create test review
    testReview = await Review.create({
      userId: testUser.id,
      bookId: testBook.id,
      rating: 4,
      reviewText: 'Great book!'
    });
    
    token = jwt.sign(
      { id: testUser.id, email: testUser.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  });

  describe('POST /reviews/:reviewId/comments', () => {
    test('Can create a comment', async () => {
      const commentData = {
        commentText: 'Great review!'
      };

      const res = await request(app)
        .post(`/reviews/${testReview.id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send(commentData);

      expect(res.status).toBe(201);
      expect(res.body.commentText).toBe('Great review!');
      expect(res.body.user).toBeDefined();
      expect(res.body.user.username).toBe('testuser');
    });

    test('Cannot create empty comment', async () => {
      const res = await request(app)
        .post(`/reviews/${testReview.id}/comments`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          commentText: ''
        });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    test('Cannot comment on non-existent review', async () => {
      const res = await request(app)
        .post('/reviews/99999/comments')
        .set('Authorization', `Bearer ${token}`)
        .send({
          commentText: 'Great review!'
        });

      expect(res.status).toBe(404);
    });
  });

  describe('GET /reviews/:reviewId/comments', () => {
    test('Can get review comments', async () => {
      // Create some comments
      await Comment.create({
        userId: testUser.id,
        reviewId: testReview.id,
        commentText: 'First comment'
      });

      await Comment.create({
        userId: testUser.id,
        reviewId: testReview.id,
        commentText: 'Second comment'
      });

      const res = await request(app)
        .get(`/reviews/${testReview.id}/comments`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(2);
      expect(res.body[0].commentText).toBe('Second comment');
      expect(res.body[1].commentText).toBe('First comment');
      expect(res.body[0].user).toBeDefined();
      expect(res.body[0].user.username).toBe('testuser');
    });
  });

  describe('DELETE /reviews/:reviewId/comments/:commentId', () => {
    test('Can delete own comment', async () => {
      const comment = await Comment.create({
        userId: testUser.id,
        reviewId: testReview.id,
        commentText: 'Test comment'
      });

      const res = await request(app)
        .delete(`/reviews/${testReview.id}/comments/${comment.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);

      // Verify comment was deleted
      const deletedComment = await Comment.findByPk(comment.id);
      expect(deletedComment).toBeNull();
    });

    test('Cannot delete other user\'s comment', async () => {
      // Create another user
      const otherUser = await User.create({
        username: 'otheruser',
        email: 'other@test.com',
        password_hash: 'hashedpassword',
        role: 'user'
      });

      // Create comment by other user
      const comment = await Comment.create({
        userId: otherUser.id,
        reviewId: testReview.id,
        commentText: 'Other user comment'
      });

      const res = await request(app)
        .delete(`/reviews/${testReview.id}/comments/${comment.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);

      // Verify comment still exists
      const existingComment = await Comment.findByPk(comment.id);
      expect(existingComment).not.toBeNull();
    });

    test('Returns 404 for non-existent comment', async () => {
      const res = await request(app)
        .delete(`/reviews/${testReview.id}/comments/99999`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
}); 