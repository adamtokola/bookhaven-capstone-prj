const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const booksRoutes = require("./routes/books");
const reviewRoutes = require("./routes/reviews");
const commentRoutes = require("./routes/comments");
const userRoutes = require("./routes/users");

const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5182', 'http://localhost:5173'], // Include all possible Vite ports
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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