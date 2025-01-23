const express = require("express");
const router = express.Router();
const db = require("../models");
const { Op } = require("sequelize");
const authMiddleware = require("../middleware/auth");
const { bookRules } = require("../middleware/validate");
const { Pool } = require('pg');

// Create pool with logging
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://adamtokola:adam@localhost:5432/bookhaven'
});

// Test database connection
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
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

    const books = await db.Book.findAll({
      where: whereClause,
      order: [['title', 'ASC']]
    });

    res.json(books);  // Return array directly, not wrapped in an object
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Error fetching books" });
  }
});

// Search endpoint - MUST come before /:id route
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }

    console.log('Searching for:', q);

    const books = await db.Book.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } }
        ]
      },
      include: [{
        model: db.Author,
        as: 'author',
        attributes: ['name']
      }],
      limit: 10,
      attributes: [
        'id', 
        'title', 
        'publication_year',
        'rating',
        'cover_image_url'
      ]
    });

    const formattedResults = books.map(book => ({
      id: book.id,
      title: book.title,
      author_name: book.author ? book.author.name : null,
      publication_year: book.publication_year,
      rating: book.rating,
      cover_image_url: book.cover_image_url
    }));

    console.log('Search results:', formattedResults);
    res.json(formattedResults);

  } catch (error) {
    console.error('Search error:', {
      message: error.message,
      stack: error.stack,
      models: Object.keys(db)
    });
    res.status(500).json({ 
      error: 'Search failed',
      details: error.message 
    });
  }
});

// Get book by ID - comes AFTER /search route
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const book = await db.Book.findByPk(id, {
      include: [{
        model: db.Author,
        as: 'author',
        attributes: ['name']
      }]
    });
    
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
      const book = await db.Book.create({
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
    const book = await db.Book.findByPk(req.params.id);
    
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
    const book = await db.Book.findByPk(req.params.id);
    
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

// Test endpoint to check database connection
router.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      success: true, 
      timestamp: result.rows[0].now,
      message: 'Database connection successful'
    });
  } catch (error) {
    console.error('Database test error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

module.exports = router;
