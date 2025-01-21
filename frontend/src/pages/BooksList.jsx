import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function BooksList() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBooks = (query = "") => {
    const url = query
      ? `http://localhost:5001/books/search?title=${encodeURIComponent(query)}`
      : "http://localhost:5001/books";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        return response.json();
      })
      .then((data) => setBooks(data))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() === "") {
      console.error("Search term is empty");
      return;
    }
    fetchBooks(searchTerm);
  };

  return (
    <div>
      <h2>Books</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <Link to={`/books/${book.id}`}>
              {book.title} - Genre: {book.genre} - Rating: {book.averageRating || "N/A"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BooksList;
