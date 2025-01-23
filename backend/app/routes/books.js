const express = require("express");
const router = express.Router();
const { Book } = require("../models");
const { Op } = require("sequelize");
const authMiddleware = require("../middleware/auth");
const { bookRules } = require("../middleware/validate");

// Get all books (with search and filter)
router.get("/", async (req, res) => {
  try {
    const { search, genre } = req.query;
    let whereClause = {};

    // Add search condition
    if (search) {
      whereClause = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${search}%` } },
          { author: { [Op.iLike]: `%${search}%` } }
        ]
      };
    }

    // Add genre filter
    if (genre) {
      whereClause.genre = genre;
    }

    const books = await Book.findAll({
      where: whereClause,
      order: [['title', 'ASC']]
    });

    res.json(books);  // Return array directly, not wrapped in an object
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Error fetching books" });
  }
});

// Get book by ID
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Error fetching book" });
  }
});

// Create book
router.post("/",
  authMiddleware,
  bookRules.create,
  async (req, res) => {
    try {
      const { title, author, genre, averageRating } = req.body;
      const book = await Book.create({
        title,
        author,
        genre,
        averageRating: averageRating || 0
      });
      res.status(201).json(book);
    } catch (error) {
      console.error("Error creating book:", error);
      res.status(500).json({ error: "Error creating book" });
    }
});

// Update book
router.put("/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const { title, author, genre, averageRating } = req.body;
    await book.update({
      title: title || book.title,
      author: author || book.author,
      genre: genre || book.genre,
      averageRating: averageRating || book.averageRating
    });

    res.json(book);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Error updating book" });
  }
});

// Delete book
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    await book.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Error deleting book" });
  }
});

module.exports = router;
