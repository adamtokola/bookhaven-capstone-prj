const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const booksRoutes = require("./routes/books");

const app = express();

app.use(cors());
app.use(express.json());

// Basic test route
app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.use("/auth", authRoutes);
app.use("/books", booksRoutes);

module.exports = app;
