-- Insert book-genre relationships
INSERT INTO book_genres (book_id, genre_id)
SELECT b.id, g.id
FROM books b
CROSS JOIN genres g
WHERE 
    -- Classics
    (b.title = 'Pride and Prejudice' AND g.name IN ('Classic', 'Romance')) OR
    (b.title = 'Moby-Dick' AND g.name IN ('Classic', 'Literary Fiction')) OR
    (b.title = 'The Scarlet Letter' AND g.name IN ('Classic', 'Literary Fiction', 'Historical Fiction')) OR
    
    -- Science Fiction
    (b.title = 'Dune' AND g.name IN ('Science Fiction', 'Fantasy')) OR
    
    -- Fantasy
    (b.title = 'The Hobbit' AND g.name IN ('Fantasy', 'Classic')) OR
    
    -- Mystery & Thriller
    (b.title = 'Gone Girl' AND g.name IN ('Mystery', 'Contemporary')) OR
    
    -- Young Adult & Science Fiction
    (b.title = 'The Hunger Games' AND g.name IN ('Young Adult', 'Science Fiction')) OR
    
    -- Non-fiction
    (b.title = 'Sapiens' AND g.name IN ('Non-fiction', 'History')) OR
    
    -- Historical Fiction & Young Adult
    (b.title = 'The Book Thief' AND g.name IN ('Historical Fiction', 'Young Adult')) OR
    
    -- Graphic Novel & Non-fiction
    (b.title = 'Maus' AND g.name IN ('Graphic Novel', 'Non-fiction', 'Historical Fiction')) OR
    
    -- Contemporary
    (b.title = 'Normal People' AND g.name IN ('Contemporary', 'Literary Fiction', 'Romance')) OR
    
    -- Poetry
    (b.title = 'Milk and Honey' AND g.name IN ('Poetry', 'Contemporary')) OR
    
    -- Horror books
    (b.title = 'Bird Box' AND g.name IN ('Horror', 'Contemporary', 'Mystery')) OR
    (b.title = 'The Haunting of Hill House' AND g.name IN ('Horror', 'Classic', 'Mystery')) OR
    
    -- Self-Help books
    (b.title = 'Atomic Habits' AND g.name IN ('Self-Help', 'Non-fiction')) OR
    (b.title = 'The Subtle Art of Not Giving a F*ck' AND g.name IN ('Self-Help', 'Non-fiction')) OR
    (b.title = 'Think and Grow Rich' AND g.name IN ('Self-Help', 'Non-fiction')) OR
    
    -- Biography & Memoir
    (b.title = 'The Glass Castle' AND g.name IN ('Memoir', 'Biography', 'Non-fiction')) OR
    (b.title = 'Bossypants' AND g.name IN ('Memoir', 'Biography', 'Non-fiction')) OR
    
    -- Graphic Novels (additional)
    (b.title = 'Watchmen' AND g.name IN ('Graphic Novel', 'Contemporary')) OR
    (b.title = 'Persepolis' AND g.name IN ('Graphic Novel', 'Memoir', 'Historical Fiction')) OR
    
    -- Poetry (additional)
    (b.title = 'The Sun and Her Flowers' AND g.name IN ('Poetry', 'Contemporary')) OR
    (b.title = 'The Waste Land' AND g.name IN ('Poetry', 'Classic')) OR
    (b.title = 'Leaves of Grass' AND g.name IN ('Poetry', 'Classic')) OR
    (b.title = 'The Essential Rumi' AND g.name IN ('Poetry', 'Classic')); 