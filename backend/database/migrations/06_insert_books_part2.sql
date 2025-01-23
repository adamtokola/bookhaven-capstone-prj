-- Continue inserting books
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
    -- Non-Fiction
    (
        'Sapiens',
        (SELECT id FROM authors WHERE name = 'Yuval Noah Harari'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        2011,
        '9780062316097',
        'English',
        443,
        'A brief history of humankind, exploring how biology and history have defined us and enhanced our understanding of what it means to be "human."',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780062316097&printsec=frontcover&img=1&zoom=1'
        ),
        4.6
    ),
    -- Historical Fiction
    (
        'The Book Thief',
        (SELECT id FROM authors WHERE name = 'Markus Zusak'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        2005,
        '9780375842207',
        'English',
        584,
        'Set during World War II in Germany, this novel follows Liesel Meminger, a young girl living with foster parents who learns to read and shares books with neighbors during bombing raids.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780375842207&printsec=frontcover&img=1&zoom=1'
        ),
        4.8
    ),
    -- Graphic Novel
    (
        'Maus',
        (SELECT id FROM authors WHERE name = 'Art Spiegelman'),
        (SELECT id FROM publishers WHERE name = 'Pantheon'),
        1986,
        '9780394747231',
        'English',
        296,
        'A powerful graphic novel depicting the Holocaust through cats and mice, telling the story of the author''s father''s experiences as a Polish Jew and Holocaust survivor.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780394747231-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780394747231&printsec=frontcover&img=1&zoom=1'
        ),
        4.8
    ),
    -- Contemporary
    (
        'Normal People',
        (SELECT id FROM authors WHERE name = 'Sally Rooney'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        2018,
        '9781984822178',
        'English',
        288,
        'A story about mutual fascination, friendship and love between two very different young people at school and university.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9781984822178-L.jpg',
            'https://books.google.com/books/content?vid=isbn9781984822178&printsec=frontcover&img=1&zoom=1'
        ),
        3.9
    ),
    -- Poetry
    (
        'Milk and Honey',
        (SELECT id FROM authors WHERE name = 'Rupi Kaur'),
        (SELECT id FROM publishers WHERE name = 'Simon & Schuster'),
        2014,
        '9781449474256',
        'English',
        208,
        'A collection of poetry and prose about survival, the experience of violence, abuse, love, loss, and femininity.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9781449474256-L.jpg',
            'https://books.google.com/books/content?vid=isbn9781449474256&printsec=frontcover&img=1&zoom=1'
        ),
        3.7
    ),
    -- Additional Classics
    (
        'Moby-Dick',
        (SELECT id FROM authors WHERE name = 'Herman Melville'),
        (SELECT id FROM publishers WHERE name = 'Penguin Classics'),
        1851,
        '9780142437247',
        'English',
        720,
        'The epic tale of Captain Ahab''s obsessive quest for the white whale Moby Dick, exploring themes of obsession, nature, and human nature.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780142437247-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780142437247&printsec=frontcover&img=1&zoom=1'
        ),
        3.5
    ),
    (
        'The Scarlet Letter',
        (SELECT id FROM authors WHERE name = 'Nathaniel Hawthorne'),
        (SELECT id FROM publishers WHERE name = 'Penguin Classics'),
        1850,
        '9780142437261',
        'English',
        238,
        'Set in Puritan Boston, this tale of passion, punishment, and redemption centers on Hester Prynne and her daughter Pearl.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780142437261-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780142437261&printsec=frontcover&img=1&zoom=1'
        ),
        2.9
    );

-- Add missing books
INSERT INTO books (title, author_id, publisher_id, publication_year, isbn, language, page_count, description, rating) VALUES
    ('Moby-Dick', 
        (SELECT id FROM authors WHERE name = 'Herman Melville'),
        (SELECT id FROM publishers WHERE name = 'Penguin Classics'),
        1851,
        '9780142437247',
        'English',
        720,
        'The epic tale of Captain Ahab''s obsessive quest for the white whale Moby Dick.',
        3.5
    ),
    ('The Scarlet Letter',
        (SELECT id FROM authors WHERE name = 'Nathaniel Hawthorne'),
        (SELECT id FROM publishers WHERE name = 'Penguin Classics'),
        1850,
        '9780142437261',
        'English',
        238,
        'Set in Puritan Boston, this tale of passion, punishment, and redemption centers on Hester Prynne.',
        2.9
    ); 