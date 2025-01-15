
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import BookDetails from "./BookDetails";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
    const [books, setBooks] = useState([]);
    const [authToken, setAuthToken] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5001/books")
            .then((response) => response.json())
            .then((data) => setBooks(data))
            .catch((error) => console.error("Error:", error));
    }, []);

    return (
        <Router>
            <div>
                <h1>Book Haven</h1>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <div>
                                <h2>Book List</h2>
                                <ul>
                                    {books.map((book) => (
                                        <li key={book.id}>
                                            <Link to={`/books/${book.id}`}>{book.title}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        }
                    />
                    <Route path="/books/:id" element={<BookDetails />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login setAuthToken={setAuthToken} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
