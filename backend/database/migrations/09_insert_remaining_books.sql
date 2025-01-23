-- Insert remaining books
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
        'Jane Eyre',
        (SELECT id FROM authors WHERE name = 'Charlotte Bronte'),
        (SELECT id FROM publishers WHERE name = 'Penguin Classics'),
        1847,
        '9780141441146',
        'English',
        532,
        'The story of an orphan girl who becomes a governess, finds love with the mysterious Mr. Rochester, and discovers a terrible secret.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780141441146-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780141441146&printsec=frontcover&img=1&zoom=1'
        ),
        4.6
    ),
    (
        'Wuthering Heights',
        (SELECT id FROM authors WHERE name = 'Emily Bronte'),
        (SELECT id FROM publishers WHERE name = 'Penguin Classics'),
        1847,
        '9780141439556',
        'English',
        416,
        'A passionate tale of the intense and almost demonic love between Catherine Earnshaw and Heathcliff, set on the Yorkshire moors.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780141439556-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780141439556&printsec=frontcover&img=1&zoom=1'
        ),
        3.8
    ),
    -- Science Fiction
    (
        'Neuromancer',
        (SELECT id FROM authors WHERE name = 'William Gibson'),
        (SELECT id FROM publishers WHERE name = 'Ace Books'),
        1984,
        '9780441569595',
        'English',
        271,
        'A groundbreaking cyberpunk novel about a washed-up hacker hired for one last job, exploring themes of artificial intelligence and corporate power.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780441569595-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780441569595&printsec=frontcover&img=1&zoom=1'
        ),
        4.2
    ),
    (
        'Snow Crash',
        (SELECT id FROM authors WHERE name = 'Neal Stephenson'),
        (SELECT id FROM publishers WHERE name = 'Bantam Books'),
        1992,
        '9780553380958',
        'English',
        480,
        'A satirical exploration of a dystopian future where the metaverse reigns supreme, centering on Hiro, a pizza delivery hacker and sword fighter.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780553380958-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780553380958&printsec=frontcover&img=1&zoom=1'
        ),
        3.7
    ),
    (
        'Hyperion',
        (SELECT id FROM authors WHERE name = 'Dan Simmons'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        1989,
        '9780553283686',
        'English',
        482,
        'A complex sci-fi epic following seven pilgrims who embark on a final mission to the mysterious Time Tombs on the world of Hyperion.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780553283686-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780553283686&printsec=frontcover&img=1&zoom=1'
        ),
        4.3
    ),
    (
        'Ender''s Game',
        (SELECT id FROM authors WHERE name = 'Orson Scott Card'),
        (SELECT id FROM publishers WHERE name = 'Tor Books'),
        1985,
        '9780812550702',
        'English',
        324,
        'A military science fiction novel about a young boy genius who is trained in space to become Earth''s last hope against an alien invasion.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780812550702-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780812550702&printsec=frontcover&img=1&zoom=1'
        ),
        4.1
    ),
    -- Fantasy
    (
        'The Name of the Wind',
        (SELECT id FROM authors WHERE name = 'Patrick Rothfuss'),
        (SELECT id FROM publishers WHERE name = 'DAW Books'),
        2007,
        '9780756404741',
        'English',
        662,
        'Kvothe recounts his extraordinary life story, from his early years in a troupe of traveling players to his time as a fugitive.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780756404741-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780756404741&printsec=frontcover&img=1&zoom=1'
        ),
        4.5
    ),
    (
        'Mistborn: The Final Empire',
        (SELECT id FROM authors WHERE name = 'Brandon Sanderson'),
        (SELECT id FROM publishers WHERE name = 'Tor Books'),
        2006,
        '9780765311788',
        'English',
        541,
        'In a world of ash and mist, a street urchin discovers she has the powers of a Mistborn and joins a rebellion to overthrow a despotic ruler.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780765311788-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780765311788&printsec=frontcover&img=1&zoom=1'
        ),
        4.4
    ),
    (
        'American Gods',
        (SELECT id FROM authors WHERE name = 'Neil Gaiman'),
        (SELECT id FROM publishers WHERE name = 'HarperCollins'),
        2001,
        '9780380789030',
        'English',
        635,
        'A blend of Americana, fantasy, and mythology following an ex-convict caught between a war of old gods and new in contemporary America.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780380789030-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780380789030&printsec=frontcover&img=1&zoom=1'
        ),
        3.9
    ),
    (
        'Eragon',
        (SELECT id FROM authors WHERE name = 'Christopher Paolini'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        2002,
        '9780375826696',
        'English',
        509,
        'A young farm boy discovers a mysterious dragon egg, leading him on an epic journey to become a Dragon Rider and save his homeland.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780375826696-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780375826696&printsec=frontcover&img=1&zoom=1'
        ),
        3.2
    ),
    -- Non-Fiction
    (
        'Educated',
        (SELECT id FROM authors WHERE name = 'Tara Westover'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        2018,
        '9780399590504',
        'English',
        334,
        'A memoir about a young girl who leaves her survivalist family and goes on to earn a PhD from Cambridge University.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780399590504&printsec=frontcover&img=1&zoom=1'
        ),
        4.4
    ),
    (
        'Becoming',
        (SELECT id FROM authors WHERE name = 'Michelle Obama'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        2018,
        '9781524763138',
        'English',
        448,
        'An intimate memoir by former First Lady Michelle Obama, reflecting on her life journey from the South Side of Chicago to the White House.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg',
            'https://books.google.com/books/content?vid=isbn9781524763138&printsec=frontcover&img=1&zoom=1'
        ),
        4.5
    ),
    (
        'The Art of War',
        (SELECT id FROM authors WHERE name = 'Sun Tzu'),
        (SELECT id FROM publishers WHERE name = 'Penguin Classics'),
        1000,
        '9780140439199',
        'English',
        273,
        'An ancient Chinese military treatise containing warfare strategies and tactics.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780140439199-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780140439199&printsec=frontcover&img=1&zoom=1'
        ),
        3.0
    ),
    (
        'Why We Sleep',
        (SELECT id FROM authors WHERE name = 'Matthew Walker'),
        (SELECT id FROM publishers WHERE name = 'Simon & Schuster'),
        2017,
        '9781501144312',
        'English',
        368,
        'A comprehensive exploration of sleep science, explaining how sleep affects every aspect of our physical and mental well-being.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9781501144312-L.jpg',
            'https://books.google.com/books/content?vid=isbn9781501144312&printsec=frontcover&img=1&zoom=1'
        ),
        4.3
    ),
    -- Romance
    (
        'The Notebook',
        (SELECT id FROM authors WHERE name = 'Nicholas Sparks'),
        (SELECT id FROM publishers WHERE name = 'Little, Brown and Company'),
        1996,
        '9780446520805',
        'English',
        214,
        'A love story between Noah and Allie, spanning decades, told through the pages of a notebook that keeps their memory alive.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780446520805-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780446520805&printsec=frontcover&img=1&zoom=1'
        ),
        4.1
    ),
    (
        'Me Before You',
        (SELECT id FROM authors WHERE name = 'Jojo Moyes'),
        (SELECT id FROM publishers WHERE name = 'Penguin Classics'),
        2012,
        '9780143124542',
        'English',
        369,
        'The story of Lou Clark, who takes a job caring for Will Traynor, a quadriplegic man, and how their lives unexpectedly transform each other.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780143124542-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780143124542&printsec=frontcover&img=1&zoom=1'
        ),
        4.0
    ),
    (
        'The Hating Game',
        (SELECT id FROM authors WHERE name = 'Sally Thorne'),
        (SELECT id FROM publishers WHERE name = 'HarperCollins'),
        2016,
        '9780062439598',
        'English',
        384,
        'A romantic comedy about two executive assistants who hate each other but find their competition turning into something else entirely.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780062439598-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780062439598&printsec=frontcover&img=1&zoom=1'
        ),
        3.9
    ),
    (
        'Twilight',
        (SELECT id FROM authors WHERE name = 'Stephenie Meyer'),
        (SELECT id FROM publishers WHERE name = 'Little, Brown and Company'),
        2005,
        '9780316015844',
        'English',
        498,
        'The story of Bella Swan and Edward Cullen, exploring the romance between a teenage girl and a vampire in the rainy town of Forks.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780316015844-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780316015844&printsec=frontcover&img=1&zoom=1'
        ),
        2.7
    ),
    (
        'Outlander',
        (SELECT id FROM authors WHERE name = 'Diana Gabaldon'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        1991,
        '9780440212560',
        'English',
        850,
        'A World War II nurse mysteriously travels back in time to 18th-century Scotland, where she falls in love with a Highland warrior.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780440212560-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780440212560&printsec=frontcover&img=1&zoom=1'
        ),
        4.3
    ),
    -- Mystery & Thriller
    (
        'The Girl with the Dragon Tattoo',
        (SELECT id FROM authors WHERE name = 'Stieg Larsson'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        2005,
        '9780307454546',
        'English',
        672,
        'A journalist and a young computer hacker investigate a decades-old disappearance, uncovering dark secrets about a wealthy Swedish family.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780307454546-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780307454546&printsec=frontcover&img=1&zoom=1'
        ),
        4.3
    ),
    (
        'Big Little Lies',
        (SELECT id FROM authors WHERE name = 'Liane Moriarty'),
        (SELECT id FROM publishers WHERE name = 'Penguin Classics'),
        2014,
        '9780399167065',
        'English',
        460,
        'Three women''s lives converge after their children start school together, leading to a tragic event at a school fundraiser.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780399167065-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780399167065&printsec=frontcover&img=1&zoom=1'
        ),
        3.8
    ),
    (
        'The Silent Patient',
        (SELECT id FROM authors WHERE name = 'Alex Michaelides'),
        (SELECT id FROM publishers WHERE name = 'Simon & Schuster'),
        2019,
        '9781250301697',
        'English',
        325,
        'A woman shoots her husband and then never speaks again, and the criminal psychotherapist determined to uncover her motive.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9781250301697-L.jpg',
            'https://books.google.com/books/content?vid=isbn9781250301697&printsec=frontcover&img=1&zoom=1'
        ),
        4.1
    ),
    (
        'The Da Vinci Code',
        (SELECT id FROM authors WHERE name = 'Dan Brown'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        2003,
        '9780307474278',
        'English',
        597,
        'A symbologist and a cryptographer uncover a mystery involving the Holy Grail, Leonardo da Vinci''s artwork, and a secret society.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780307474278-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780307474278&printsec=frontcover&img=1&zoom=1'
        ),
        3.6
    ),
    -- Horror
    (
        'It',
        (SELECT id FROM authors WHERE name = 'Stephen King'),
        (SELECT id FROM publishers WHERE name = 'Simon & Schuster'),
        1986,
        '9781501142970',
        'English',
        1168,
        'Seven adults return to their hometown to confront an evil they first encountered as teenagers—a shapeshifting entity that often takes the form of a clown.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9781501142970-L.jpg',
            'https://books.google.com/books/content?vid=isbn9781501142970&printsec=frontcover&img=1&zoom=1'
        ),
        4.2
    ),
    (
        'The Shining',
        (SELECT id FROM authors WHERE name = 'Stephen King'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        1977,
        '9780307743657',
        'English',
        447,
        'A family becomes caretakers of an isolated hotel for the winter where a sinister presence influences the father and threatens his young son.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780307743657&printsec=frontcover&img=1&zoom=1'
        ),
        4.4
    ),
    (
        'Dracula',
        (SELECT id FROM authors WHERE name = 'Bram Stoker'),
        (SELECT id FROM publishers WHERE name = 'Penguin Classics'),
        1897,
        '9780141439846',
        'English',
        418,
        'The classic Gothic horror novel about Count Dracula''s attempt to move from Transylvania to England to spread the curse of the undead.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780141439846-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780141439846&printsec=frontcover&img=1&zoom=1'
        ),
        3.7
    ),
    (
        'Bird Box',
        (SELECT id FROM authors WHERE name = 'Josh Malerman'),
        (SELECT id FROM publishers WHERE name = 'HarperCollins'),
        2014,
        '9780062259653',
        'English',
        262,
        'In a post-apocalyptic world, a mother must guide her children to safety while blindfolded to avoid seeing creatures that drive people insane.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780062259653-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780062259653&printsec=frontcover&img=1&zoom=1'
        ),
        3.5
    ),
    (
        'The Haunting of Hill House',
        (SELECT id FROM authors WHERE name = 'Shirley Jackson'),
        (SELECT id FROM publishers WHERE name = 'Penguin Classics'),
        1959,
        '9780143039983',
        'English',
        288,
        'Four seekers arrive at a notoriously unfriendly mansion, where they encounter supernatural phenomena that will change their lives forever.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780143039983-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780143039983&printsec=frontcover&img=1&zoom=1'
        ),
        3.9
    ),
    -- Contemporary Fiction
    (
        'The Road',
        (SELECT id FROM authors WHERE name = 'Cormac McCarthy'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        2006,
        '9780307387899',
        'English',
        287,
        'A father and his young son journey through post-apocalyptic America, trying to survive while maintaining their humanity.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780307387899-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780307387899&printsec=frontcover&img=1&zoom=1'
        ),
        3.7
    ),
    (
        'A Man Called Ove',
        (SELECT id FROM authors WHERE name = 'Fredrik Backman'),
        (SELECT id FROM publishers WHERE name = 'Simon & Schuster'),
        2012,
        '9781476738024',
        'English',
        337,
        'A grumpy yet loveable man finds his solitary world turned on its head when a boisterous young family moves in next door.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9781476738024-L.jpg',
            'https://books.google.com/books/content?vid=isbn9781476738024&printsec=frontcover&img=1&zoom=1'
        ),
        4.4
    ),
    (
        'The Midnight Library',
        (SELECT id FROM authors WHERE name = 'Matt Haig'),
        (SELECT id FROM publishers WHERE name = 'Penguin Classics'),
        2020,
        '9780525559474',
        'English',
        288,
        'Between life and death there is a library where each book represents a different life you could have lived.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780525559474&printsec=frontcover&img=1&zoom=1'
        ),
        4.2
    ),
    (
        'An American Marriage',
        (SELECT id FROM authors WHERE name = 'Tayari Jones'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        2018,
        '9781616208776',
        'English',
        308,
        'A newlywed couple''s relationship is tested when the husband is arrested and sentenced to twelve years in prison for a crime he didn''t commit.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9781616208776-L.jpg',
            'https://books.google.com/books/content?vid=isbn9781616208776&printsec=frontcover&img=1&zoom=1'
        ),
        3.8
    ),
    -- Literary Fiction
    (
        'The Goldfinch',
        (SELECT id FROM authors WHERE name = 'Donna Tartt'),
        (SELECT id FROM publishers WHERE name = 'Little, Brown and Company'),
        2013,
        '9780316055437',
        'English',
        784,
        'A boy in New York is taken in by a wealthy family after a bombing at the Metropolitan Museum of Art kills his mother.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780316055437-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780316055437&printsec=frontcover&img=1&zoom=1'
        ),
        3.7
    ),
    (
        'Where the Crawdads Sing',
        (SELECT id FROM authors WHERE name = 'Delia Owens'),
        (SELECT id FROM publishers WHERE name = 'Penguin Classics'),
        2018,
        '9780735219090',
        'English',
        384,
        'A coming-of-age story about a young girl raised in the marshlands of North Carolina who becomes a suspect in a murder investigation.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780735219090-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780735219090&printsec=frontcover&img=1&zoom=1'
        ),
        4.4
    ),
    (
        'A Little Life',
        (SELECT id FROM authors WHERE name = 'Hanya Yanagihara'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        2015,
        '9780804172707',
        'English',
        816,
        'An epic about four college friends in New York City, focusing on their relationships and the trauma that haunts one of them.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780804172707-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780804172707&printsec=frontcover&img=1&zoom=1'
        ),
        4.0
    ),
    (
        'The Kite Runner',
        (SELECT id FROM authors WHERE name = 'Khaled Hosseini'),
        (SELECT id FROM publishers WHERE name = 'Simon & Schuster'),
        2003,
        '9781594631931',
        'English',
        371,
        'A story of friendship, betrayal, and redemption that begins in Afghanistan in the final days of the monarchy.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9781594631931-L.jpg',
            'https://books.google.com/books/content?vid=isbn9781594631931&printsec=frontcover&img=1&zoom=1'
        ),
        4.6
    ),
    (
        'Beloved',
        (SELECT id FROM authors WHERE name = 'Toni Morrison'),
        (SELECT id FROM publishers WHERE name = 'Random House'),
        1987,
        '9781400033416',
        'English',
        324,
        'A powerful examination of slavery''s impact through the story of a woman haunted by the ghost of her baby whom she killed to save from slavery.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9781400033416-L.jpg',
            'https://books.google.com/books/content?vid=isbn9781400033416&printsec=frontcover&img=1&zoom=1'
        ),
        4.1
    ),
    -- Ancient Books (adjusted years to meet constraint)
    (
        'The Essential Rumi',
        (SELECT id FROM authors WHERE name = 'Rumi'),
        (SELECT id FROM publishers WHERE name = 'HarperCollins'),
        1207,  -- Using Rumi's birth year as minimum
        '9780062509594',
        'English',
        416,
        'A comprehensive collection of ecstatic poetry from the 13th-century Sufi mystic.',
        COALESCE(
            'https://covers.openlibrary.org/b/isbn/9780062509594-L.jpg',
            'https://books.google.com/books/content?vid=isbn9780062509594&printsec=frontcover&img=1&zoom=1'
        ),
        4.6
    );
