const express = require("express");
const router = express.Router();
const { User, Review, Book } = require("../models");
const authMiddleware = require("../middleware/auth");
const bcrypt = require("bcrypt");

// Get own profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password_hash'] }  // Don't send password hash
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ error: "Error fetching profile" });
  }
});

// Update profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { username, email, currentPassword, newPassword } = req.body;

    // If updating password
    if (currentPassword && newPassword) {
      const validPassword = await bcrypt.compare(currentPassword, user.password_hash);
      if (!validPassword) {
        return res.status(401).json({ error: "Invalid current password" });
      }
      
      const password_hash = await bcrypt.hash(newPassword, 10);
      await user.update({ password_hash });
    }

    // Update other fields if provided
    if (username || email) {
      await user.update({
        username: username || user.username,
        email: email || user.email
      });
    }

    // Return updated user without password hash
    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password_hash'] }
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Error updating profile" });
  }
});

// Get user's reviews
router.get("/:userId/reviews", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.findAll({
      where: { user_id: userId },
      include: [{
        model: Book,
        as: 'book',
        attributes: ['id', 'title', 'author', 'genre']
      }],
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'rating', 'reviewText', 'createdAt', 'updatedAt']
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

// Delete account
router.delete("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const { password } = req.body;
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting account:", error);
    res.status(500).json({ error: "Error deleting account" });
  }
});

module.exports = router; 