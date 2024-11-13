CREATE TABLE IF NOT EXISTS comic_chapters (
    id SERIAL PRIMARY KEY,
    name TEXT, -- a nameless chapter will default to the chapter number as its name for display.
    chapter_number INT NOT NULL,
    description TEXT,
    thumbnail TEXT,
    comic_id INT REFERENCES comics(id) ON DELETE CASCADE,
    CONSTRAINT unique_chapter_number UNIQUE (comic_id, chapter_number)
    -- future potential index on comic_id, chapter_number but it feels too soon
);

CREATE TABLE IF NOT EXISTS comic_pages (
    id SERIAL PRIMARY KEY,
    page_number INT,
    comic_id INT REFERENCES comics(id) ON DELETE CASCADE,
    chapter_id INT REFERENCES comic_chapters(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    release_on TIMESTAMP DEFAULT NOW(),
    -- view_count and like_count are not updated in real time - some stats feature will take care of this.
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    author_comment TEXT,
    high_res_image_url TEXT,
    thumbnail_image_url TEXT,
    low_res_image_url TEXT,
    CONSTRAINT unique_comic_chapter_pages UNIQUE (comic_id, chapter_id, page_number)
);

-- Users can free-form tag pages with whatever they like, like "mermaids" or "sword fight".
CREATE TABLE IF NOT EXISTS comic_pages_tags (
    id SERIAL PRIMARY KEY,
    tag_name TEXT NOT NULL,
    page_id INT REFERENCES comic_pages(id) ON DELETE CASCADE,
    CONSTRAINT unique_page_tags UNIQUE (page_id, tag_name)
    -- potentially index tag_name
);