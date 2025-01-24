const { body, param, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const bookRules = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('author').trim().notEmpty().withMessage('Author is required'),
    body('genre').trim().notEmpty().withMessage('Genre is required'),
    validate
  ]
};

const reviewRules = {
  create: [
    body('rating')
      .isInt({ min: 1, max: 5 })
      .withMessage('Rating must be between 1 and 5'),
    body('reviewText')
      .trim()
      .isLength({ min: 10 })
      .withMessage('Review must be at least 10 characters long'),
    validate
  ]
};

const commentRules = {
  create: [
    body('commentText')
      .trim()
      .notEmpty()
      .withMessage('Comment cannot be empty'),
    param('reviewId')
      .isInt()
      .withMessage('Invalid review ID'),
    validate
  ]
};

module.exports = {
  bookRules,
  reviewRules,
  commentRules
}; 