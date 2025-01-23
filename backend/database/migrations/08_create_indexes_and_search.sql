-- Enable the pg_trgm extension for text search capabilities
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create indexes for basic searches
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_authors_name ON authors(name);
CREATE INDEX idx_publishers_name ON publishers(name);

-- Create pattern matching indexes for fuzzy search
CREATE INDEX idx_books_title_pattern ON books USING gin (title gin_trgm_ops);
CREATE INDEX idx_authors_name_pattern ON authors USING gin (name gin_trgm_ops);

-- Create composite indexes for common search combinations
CREATE INDEX idx_books_author_rating ON books(author_id, rating DESC);
CREATE INDEX idx_books_year_rating ON books(publication_year DESC, rating DESC);
CREATE INDEX idx_books_language_rating ON books(language, rating DESC);

-- Create full-text search index for descriptions
CREATE INDEX idx_books_description_fts ON books USING gin (to_tsvector('english', description));

-- Create indexes for foreign key relationships
CREATE INDEX idx_book_genres_book_id ON book_genres(book_id);
CREATE INDEX idx_book_genres_genre_id ON book_genres(genre_id);

-- Drop the existing function if it exists
DROP FUNCTION IF EXISTS search_books(TEXT);

-- Create function for fuzzy title search with proper type casting
CREATE OR REPLACE FUNCTION search_books(search_term TEXT)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    author_name TEXT,
    similarity DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.title::TEXT,
        a.name::TEXT as author_name,
        similarity(b.title::TEXT, search_term)::DOUBLE PRECISION as sim
    FROM books b
    JOIN authors a ON b.author_id = a.id
    WHERE 
        b.title % search_term OR
        a.name % search_term
    ORDER BY sim DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Drop the existing function
DROP FUNCTION IF EXISTS search_books_description(TEXT);

-- Create function for full-text description search with proper type casting
CREATE OR REPLACE FUNCTION search_books_description(search_query TEXT)
RETURNS TABLE (
    id INTEGER,
    title TEXT,
    description TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.title::TEXT,
        b.description::TEXT,
        ts_rank(to_tsvector('english', b.description), plainto_tsquery('english', search_query))::REAL as rank
    FROM books b
    WHERE to_tsvector('english', b.description) @@ plainto_tsquery('english', search_query)
    ORDER BY rank DESC
    LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Analyze tables for query optimization
ANALYZE books;
ANALYZE authors;
ANALYZE publishers;
ANALYZE genres;
ANALYZE book_genres; 