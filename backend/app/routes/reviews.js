const express = require("express");
const router = express.Router();
const { Book, Review, User } = require("../models");
const authMiddleware = require("../middleware/auth");
const { reviewRules } = require("../middleware/validate");

router.post("/books/:bookId/reviews", 
  authMiddleware, 
  reviewRules.create,
  async (req, res) => {
    try {
      const bookId = parseInt(req.params.bookId);
      const { rating, reviewText } = req.body;
      const userId = parseInt(req.user.id);

      const book = await Book.findByPk(bookId);
      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      const existingReview = await Review.findOne({
        where: { 
          userId,
          bookId
        }
      });
      if (existingReview) {
        return res.status(400).json({ error: "You've already reviewed this book" });
      }

      const review = await Review.create({
        userId,
        bookId,
        rating,
        reviewText
      });

      const createdReview = await Review.findOne({
        where: { id: review.id },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['username']
          },
          {
            model: Book,
            as: 'book',
            attributes: ['title', 'author', 'genre']
          }
        ]
      });

      const bookReviews = await Review.findAll({
        where: { bookId }
      });
      const avgRating = bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length;
      await book.update({ averageRating: avgRating });

      res.status(201).json(createdReview);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ error: "Error creating review" });
    }
});

router.get("/books/:bookId/reviews", async (req, res) => {
  try {
    const bookId = parseInt(req.params.bookId);

    const reviews = await Review.findAll({
      where: { bookId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username']
        },
        {
          model: Book,
          as: 'book',
          attributes: ['title', 'author', 'genre']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

router.put("/books/:bookId/reviews/:reviewId", authMiddleware, async (req, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId);
    const bookId = parseInt(req.params.bookId);
    const { rating, reviewText } = req.body;
    const userId = parseInt(req.user.id);

    const review = await Review.findOne({
      where: { 
        id: reviewId,
        userId,
        bookId
      }
    });

    if (!review) {
      return res.status(404).json({ error: "Review not found" });
    }

    await review.update({ rating, reviewText });

    const updatedReview = await Review.findOne({
      where: { id: reviewId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['username']
        },
        {
          model: Book,
          as: 'book',
          attributes: ['title', 'author', 'genre']
        }
      ]
    });

    const bookReviews = await Review.findAll({
      where: { bookId }
    });
    const avgRating = bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length;
    await Book.update(
      { averageRating: avgRating },
      { where: { id: bookId } }
    );

    res.json(updatedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ error: "Error updating review" });
  }
});

module.exports = router; 