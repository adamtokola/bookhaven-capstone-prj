import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5001/books/${id}`)
      .then((response) => response.json())
      .then((data) => setBook(data))
      .catch((error) => console.error("Error:", error));
  }, [id]);

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{book.title}</h2>
      <p>Genre: {book.genre}</p>
      <p>Average Rating: {book.averageRating || "N/A"}</p>

      <h3>Reviews</h3>
      <ul>
        {book.Reviews.map((review) => (
          <li key={review.id}>
            <strong>Rating:</strong> {review.rating}/5
            <p>{review.comment}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookDetails;
