const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const booksRoutes = require("./routes/books");
const reviewRoutes = require("./routes/reviews");
const commentRoutes = require("./routes/comments");
const userRoutes = require("./routes/users");

const app = express();

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.use("/auth", authRoutes);
app.use("/books", booksRoutes);
app.use("/", reviewRoutes);
app.use("/", commentRoutes);
app.use("/users", userRoutes);

module.exports = app;