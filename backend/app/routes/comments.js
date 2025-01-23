const express = require("express");
const router = express.Router();
const { Review, Comment, User } = require("../models");
const authMiddleware = require("../middleware/auth");
const { commentRules } = require("../middleware/validate");

// Create a comment
router.post("/reviews/:reviewId/comments", 
  authMiddleware,
  commentRules.create,
  async (req, res) => {
    try {
      const reviewId = parseInt(req.params.reviewId);
      const { commentText } = req.body;
      const userId = parseInt(req.user.id);

      // Check if review exists
      const review = await Review.findByPk(reviewId);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      const comment = await Comment.create({
        userId,
        reviewId,
        commentText
      });

      // Fetch created comment with associations
      const createdComment = await Comment.findOne({
        where: { id: comment.id },
        include: [{
          model: User,
          as: 'user',
          attributes: ['username']
        }]
      });

      res.status(201).json(createdComment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Error creating comment" });
    }
});

// Get comments for a review
router.get("/reviews/:reviewId/comments", async (req, res) => {
  try {
    const reviewId = parseInt(req.params.reviewId);

    const comments = await Comment.findAll({
      where: { reviewId },
      include: [{
        model: User,
        as: 'user',
        attributes: ['username']
      }],
      order: [['createdAt', 'DESC']]
    });

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ error: "Error fetching comments" });
  }
});

// Delete a comment
router.delete("/reviews/:reviewId/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId);
    const userId = parseInt(req.user.id);

    const comment = await Comment.findOne({
      where: { id: commentId }
    });

    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check ownership before deletion
    if (comment.userId !== userId) {
      return res.status(403).json({ error: "Not authorized to delete this comment" });
    }

    await comment.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ error: "Error deleting comment" });
  }
});

module.exports = router; 