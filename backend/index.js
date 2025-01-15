const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

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

const reviews = [
  { id: 1, book_id: 1, user: "John Doe", rating: 5, comment: "Amazing book!" },
  {
    id: 2,
    book_id: 1,
    user: "Jane Smith",
    rating: 4,
    comment: "Very thought-provoking.",
  },
];

app.get("/books", (req, res) => {
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) {
    return res.status(404).send("Book not found");
  }
  res.json(book);
});

app.get("/books/:id/reviews", (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookReviews = reviews.filter((review) => review.book_id === bookId);
  res.json(bookReviews);
});

app.post("/books/:id/reviews", (req, res) => {
  const bookId = parseInt(req.params.id);
  const { user, rating, comment } = req.body;

  if (!user || !rating || !comment || rating < 1 || rating > 5) {
    return res
      .status(400)
      .send(
        "Invalid input: Ensure all fields are filled, and rating is between 1 and 5."
      );
  }

  const newReview = {
    id: reviews.length + 1,
    book_id: bookId,
    user,
    rating,
    comment,
  };

  reviews.push(newReview);
  res.status(201).json(newReview);
});

app.put("/reviews/:id", (req, res) => {
  const reviewId = parseInt(req.params.id);
  const { rating, comment } = req.body;

  const review = reviews.find((r) => r.id === reviewId);
  if (!review) {
    return res.status(404).send("Review not found");
  }

  if (rating && (rating < 1 || rating > 5)) {
    return res.status(400).send("Rating must be between 1 and 5.");
  }

  review.rating = rating || review.rating;
  review.comment = comment || review.comment;

  res.json(review);
});

app.delete("/reviews/:id", (req, res) => {
  const reviewId = parseInt(req.params.id);
  const reviewIndex = reviews.findIndex((r) => r.id === reviewId);

  if (reviewIndex === -1) {
    return res.status(404).send("Review not found");
  }

  reviews.splice(reviewIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
