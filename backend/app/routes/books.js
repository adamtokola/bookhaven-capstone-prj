const express = require("express");
const router = express.Router();
const { Book } = require("../models");
const { Op } = require("sequelize");
const authMiddleware = require("../middleware/auth");
const { bookRules } = require("../middleware/validate");
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://adamtokola:adam@localhost:5432/bookhaven'
});

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

// Search endpoint
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    // Using the search_books function we created in our migrations
    const query = `
      SELECT 
        b.id,
        b.title,
        a.name as author_name,
        b.publication_year,
        b.rating,
        b.cover_image_url,
        similarity(b.title, $1) as similarity
      FROM books b
      JOIN authors a ON b.author_id = a.id
      WHERE 
        similarity(b.title, $1) > 0.1 OR
        b.title ILIKE $2 OR
        a.name ILIKE $2
      ORDER BY similarity DESC
      LIMIT 10
    `;

    const result = await pool.query(query, [q, `%${q}%`]);
    res.json(result.rows);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
