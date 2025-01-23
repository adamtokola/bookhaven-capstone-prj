-- Insert books with full details
INSERT INTO books (
    title,
    author_id,
    publisher_id,
    publication_year,
    isbn,
    language,
    page_count,
    description,
    cover_image_url,
    rating
) VALUES
    -- Classics
    (
        'Pride and Prejudice',
        (SELECT id FROM authors WHERE name = 'Jane Austen'),
        (SELECT id FROM publishers WHERE name = 'Penguin Classics'),
        1813,
        '9780141439518',
        'English',
        432,
        'Pride and Prejudice follows the turbulent relationship between Elizabeth Bennet and Fitzwilliam Darcy as they overcome their pride and prejudices.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780141439518&printsec=frontcover&img=1&zoom=1'
        ),
        4.8
    ),
    -- Science Fiction
    (
        'Dune',
        (SELECT id FROM authors WHERE name = 'Frank Herbert'),
        (SELECT id FROM publishers WHERE name = 'Tor Books'),
        1965,
        '9780441172719',
        'English',
        896,
        'Set on the desert planet Arrakis, Dune tells the story of Paul Atreides as he becomes embroiled in the planet''s politics and ecology.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780441172719&printsec=frontcover&img=1&zoom=1'
        ),
        4.5
    ),
    -- Fantasy
    (
        'The Hobbit',
        (SELECT id FROM authors WHERE name = 'J.R.R. Tolkien'),
        (SELECT id FROM publishers WHERE name = 'HarperCollins'),
        1937,
        '9780547928227',
        'English',
        366,
        'The adventure of Bilbo Baggins as he journeys to the Lonely Mountain with a group of dwarves to reclaim their treasure.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780547928227&printsec=frontcover&img=1&zoom=1'
        ),
        4.7
    ),
    -- Mystery & Thriller
    (
        'Gone Girl',
        (SELECT id FROM authors WHERE name = 'Gillian Flynn'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        2012,
        '9780307588371',
        'English',
        432,
        'When Nick''s wife Amy disappears on their fifth wedding anniversary, he becomes the prime suspect. A psychological thriller about a marriage gone terribly wrong.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780307588371-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780307588371&printsec=frontcover&img=1&zoom=1'
        ),
        4.2
    ),
    -- Young Adult
    (
        'The Hunger Games',
        (SELECT id FROM authors WHERE name = 'Suzanne Collins'),
        (SELECT id FROM publishers WHERE name = 'Scholastic'),
        2008,
        '9780439023481',
        'English',
        374,
        'In a dystopian future, young Katniss Everdeen volunteers for a televised battle to the death in place of her sister.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780439023481-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780439023481&printsec=frontcover&img=1&zoom=1'
        ),
        4.5
    ); 