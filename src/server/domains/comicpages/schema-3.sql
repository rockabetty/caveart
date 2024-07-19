CREATE TABLE IF NOT EXISTS comic_chapters (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    index INT NOT NULL,
    description TEXT NOT NULL,
    comic_id INT REFERENCES comics(id) ON DELETE CASCADE,
    thumbnail TEXT,
    UNIQUE (comic_id, index)
);

CREATE TABLE IF NOT EXISTS comic_pages (
    id SERIAL PRIMARY KEY,
    page_number INT,
    img TEXT NOT NULL UNIQUE,
    comic_id INT REFERENCES comics(id) ON DELETE CASCADE,
    chapter_id INT REFERENCES chapters(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    release_on TIMESTAMP DEFAULT NOW(),
    UNIQUE (comic_id, chapter_id, page_number),
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    author_comment TEXT
);