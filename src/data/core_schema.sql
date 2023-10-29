CREATE TYPE user_role AS ENUM ('Member', 'Creator', 'Moderator');
CREATE EXTENSION ltree;

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(250) UNIQUE NOT NULL,
  email VARCHAR(250) UNIQUE NOT NULL,        -- Emails are encypted non-deterministicaly.
  hashed_email VARCHAR(250) UNIQUE NOT NULL, -- Hashes used to check for existing emails.
  password VARCHAR(512) NOT NULL,
  password_reset_token VARCHAR(250),
  password_reset_expiry TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role user_role DEFAULT 'Member'
);

CREATE TABLE IF NOT EXISTS users_sessions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  session_token VARCHAR(250) UNIQUE NOT NULL,
  expiration_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS usage_devices (
    id SERIAL PRIMARY KEY,
    device_type VARCHAR(100),
    browser VARCHAR(100),
    os VARCHAR(100),
    country VARCHAR(100),
    language_locale VARCHAR(100),
    created_at DATE DEFAULT CURRENT_DATE
);

CREATE TABLE IF NOT EXISTS ratings (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    thumbnail TEXT
);
CREATE TABLE IF NOT EXISTS comics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(250) UNIQUE NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    tagline VARCHAR(250),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    thumbnail TEXT,
    comments BOOLEAN DEFAULT TRUE,
    critique BOOLEAN DEFAULT FALSE,
    is_unlisted BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    moderate_comments BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    likes INT DEFAULT 0,
    rating INT REFERENCES ratings(id),
    stylesheet_variables JSONB,
    UNIQUE (title, subdomain)
);

CREATE TABLE IF NOT EXISTS genres (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    path_name LTREE
);
CREATE TABLE IF NOT EXISTS comics_to_genres (
    id SERIAL PRIMARY KEY,
    comic_id INT REFERENCES comics(id) ON DELETE CASCADE,
    genre_id INT REFERENCES genres(id),
    UNIQUE (comic_id, genre_id)
);
CREATE TABLE IF NOT EXISTS styles (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    path_name LTREE
);
CREATE TABLE IF NOT EXISTS comics_to_styles (
    id SERIAL PRIMARY KEY,
    comic_id INT REFERENCES comics(id) ON DELETE CASCADE,
    style_id INT REFERENCES styles(id),
    UNIQUE (comic_id, style_id)
);
CREATE TABLE IF NOT EXISTS content_warnings (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id INT references styles(id)
);
CREATE TABLE IF NOT EXISTS comics_to_content_warnings (
    id SERIAL PRIMARY KEY,
    comic_id INT REFERENCES comics(id) ON DELETE CASCADE,
    content_warning_id INT REFERENCES content_warnings(id),
    frequent BOOLEAN DEFAULT false,
    UNIQUE (comic_id, content_warning_id)
);
CREATE TABLE IF NOT EXISTS comic_tags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    comic_id INT REFERENCES comics(id)
);
CREATE TABLE IF NOT EXISTS chapters (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    index INT NOT NULL,
    description TEXT NOT NULL,
    comic_id INT REFERENCES comics(id),
    thumbnail TEXT,
    UNIQUE (comic_id, index)
);
CREATE TABLE IF NOT EXISTS comic_pages (
    id SERIAL PRIMARY KEY,
    page_number INT,
    img TEXT NOT NULL UNIQUE,
    comic_id INT REFERENCES comics(id) ON DELETE CASCADE,
    chapter_id INT REFERENCES chapters(id),
    created_at TIMESTAMP DEFAULT NOW(),
    release_on TIMESTAMP DEFAULT NOW(),
    UNIQUE (comic_id, chapter_id, page_number),
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0
);
CREATE TABLE IF NOT EXISTS comics_to_authors (
    comic_id INT REFERENCES comics(id),
    user_id INT REFERENCES users(id),
    role TEXT,
    UNIQUE (user_id, comic_id)
);


CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

