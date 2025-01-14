const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Book Haven API!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const books = [
  {
    id: 1,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian",
    average_rating: 4.8,
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Classic",
    average_rating: 4.9,
  },
];

app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (book) {
    res.json(book);
  } else {
    res.status(404).send("Book not found");
  }
});
