-- Create trigger function for updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_authors_updated_at
    BEFORE UPDATE ON authors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_publishers_updated_at
    BEFORE UPDATE ON publishers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_genres_updated_at
    BEFORE UPDATE ON genres
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to get cover URL with fallbacks
CREATE OR REPLACE FUNCTION get_cover_url(isbn VARCHAR) 
RETURNS TEXT AS $$
BEGIN
    RETURN CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM books 
            WHERE cover_image_url LIKE 'https://covers.openlibrary.org/b/isbn/' || isbn || '%'
            AND cover_image_url IS NOT NULL
        ) THEN 'https://covers.openlibrary.org/b/isbn/' || isbn || '-L.jpg'
        WHEN EXISTS (
            SELECT 1 
            FROM books 
            WHERE cover_image_url LIKE 'https://books.google.com/books/content?vid=isbn' || isbn || '%'
            AND cover_image_url IS NOT NULL
        ) THEN 'https://books.google.com/books/content?vid=isbn' || isbn || '&printsec=frontcover&img=1&zoom=1'
        ELSE '/default-book-cover.jpg'
    END;
END;
$$ LANGUAGE plpgsql; 