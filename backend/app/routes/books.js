const express = require("express");
const { Op } = require("sequelize");
const { Book, Review } = require("../models");
const router = express.Router();

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.findAll({
      attributes: ["id", "title", "genre", "averageRating"],
    });
    res.json(books);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: "Error fetching books." });
  }
});

// Search books by title
router.get("/search", async (req, res) => {
  const { title } = req.query;

  try {
    if (!title) {
      return res.status(400).json({ message: "Title query parameter is required." });
    }

    const books = await Book.findAll({
      where: {
        title: {
          [Op.iLike]: `%${title}%`, // Case-insensitive search
        },
      },
      include: [{
        model: Review,
        attributes: ["rating"],
      }],
      attributes: ["id", "title", "genre", "averageRating"],
    });

    res.json(books);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Error searching for books." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: {
        model: Review,
        attributes: ["id", "rating", "comment", "createdAt"],
      },
    });

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Error fetching book details." });
  }
});

module.exports = router;
