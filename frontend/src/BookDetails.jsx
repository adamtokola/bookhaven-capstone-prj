import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    user: "",
    rating: "",
    comment: "",
  });
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editForm, setEditForm] = useState({ rating: "", comment: "" });

  useEffect(() => {
    fetch(`http://localhost:5001/books/${id}`)
      .then((response) => response.json())
      .then((data) => setBook(data))
      .catch((error) => console.error("Error:", error));

    fetch(`http://localhost:5001/books/${id}/reviews`)
      .then((response) => response.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error:", error));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newReview.rating < 1 || newReview.rating > 5) {
      alert("Rating must be between 1 and 5.");
      return;
    }
    fetch(`http://localhost:5001/books/${id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    })
      .then((response) => response.json())
      .then((data) => {
        setReviews((prevReviews) => [...prevReviews, data]);
        setNewReview({ user: "", rating: "", comment: "" });
      })
      .catch((error) => console.error("Error:", error));
  };

  const handleDelete = (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      fetch(`http://localhost:5001/reviews/${reviewId}`, { method: "DELETE" })
        .then(() => {
          setReviews((prevReviews) =>
            prevReviews.filter((r) => r.id !== reviewId)
          );
        })
        .catch((error) => console.error("Error:", error));
    }
  };

  if (!book) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{book.title}</h2>
      <p>Author: {book.author}</p>
      <p>Genre: {book.genre}</p>
      <p>Rating: {book.average_rating}</p>

      <h3>Reviews</h3>
      <ul>
        {reviews.map((review) => (
          <li key={review.id} className="border-b pb-4 mb-4">
            {editingReviewId === review.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetch(`http://localhost:5001/reviews/${review.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(editForm),
                  })
                    .then((response) => response.json())
                    .then((updatedReview) => {
                      setReviews((prevReviews) =>
                        prevReviews.map((r) =>
                          r.id === updatedReview.id ? updatedReview : r
                        )
                      );
                      setEditingReviewId(null);
                    })
                    .catch((error) => console.error("Error:", error));
                }}
              >
                <input
                  type="number"
                  value={editForm.rating}
                  onChange={(e) =>
                    setEditForm({ ...editForm, rating: e.target.value })
                  }
                  min="1"
                  max="5"
                  required
                  className="border rounded p-2"
                />
                <textarea
                  value={editForm.comment}
                  onChange={(e) =>
                    setEditForm({ ...editForm, comment: e.target.value })
                  }
                  required
                  className="border rounded p-2"
                ></textarea>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingReviewId(null)}
                  className="bg-gray-500 text-white py-2 px-4 ml-2"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <strong>{review.user}</strong> - {review.rating}/5
                <p>{review.comment}</p>
                <button
                  onClick={() => {
                    setEditingReviewId(review.id);
                    setEditForm({
                      rating: review.rating,
                      comment: review.comment,
                    });
                  }}
                  className="text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(review.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h3>Add a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={newReview.user}
          onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
          required
          className="border rounded p-2 w-full"
        />
        <input
          type="number"
          placeholder="Rating (1-5)"
          value={newReview.rating}
          onChange={(e) =>
            setNewReview({ ...newReview, rating: e.target.value })
          }
          min="1"
          max="5"
          required
          className="border rounded p-2 w-full"
        />
        <textarea
          placeholder="Your Review"
          value={newReview.comment}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
          required
          className="border rounded p-2 w-full"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
}

export default BookDetails;
