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
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
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
    name TEXT UNIQUE NOT NULL
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
    likes BOOLEAN DEFAULT TRUE,
    like_count INT DEFAULT 0,
    rating INT REFERENCES ratings(id) ON DELETE CASCADE,
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
    genre_id INT REFERENCES genres(id) ON DELETE CASCADE,
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
    style_id INT REFERENCES styles(id) ON DELETE CASCADE,
    UNIQUE (comic_id, style_id)
);
CREATE TABLE IF NOT EXISTS content_warnings (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    parent_id INT references content_warnings(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comics_to_content_warnings (
    id SERIAL PRIMARY KEY,
    comic_id INT REFERENCES comics(id) ON DELETE CASCADE,
    content_warning_id INT REFERENCES content_warnings(id) ON DELETE CASCADE,
    frequent BOOLEAN DEFAULT false,
    UNIQUE (comic_id, content_warning_id)
);
CREATE TABLE IF NOT EXISTS comic_tags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    comic_id INT REFERENCES comics(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS chapters (
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
    like_count INT DEFAULT 0
);
CREATE TABLE IF NOT EXISTS comics_to_authors (
    id SERIAL PRIMARY KEY,
    comic_id INT REFERENCES comics(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
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

INSERT INTO genres (name) VALUES
  ('Action'),
  ('Adventure'),
  ('Comedy'),
  ('Drama'),
  ('Fantasy'),
  ('Horror'),
  ('Mystery'),
  ('Romance'),
  ('Sci-Fi'),
  ('Slice of Life'),
  ('Superhero'),
  ('Thriller'),
  ('Historical'),
  ('Western'),
  ('Noir'),
  ('Dystopian'),
  ('Mecha'),
  ('Magical Girl'),
  ('Pokemon'),
  ('Fandom');

INSERT INTO ratings (name) VALUES
  ('All Ages'),
  ('Ages 10+'),
  ('Teen (13+)'),
  ('Mature (17+)'),
  ('Adults Only (18+)');

TRUNCATE content_warnings RESTART IDENTITY CASCADE;

INSERT INTO content_warnings
  (id, name, parent_id)
  VALUES
  (1, 'sexualContent', null),
  (2, 'violentContent', null),
  (3, 'languageContent', null),
  (4, 'substanceContent', null),
  (5, 'nudity', 1),
  (6, 'someNudity', 5),
  (7, 'frequentNudity', 5),
  (11, 'sexScenes', 1),
  (12, 'someSexScenes', 11),
  (13, 'frequentSexScenes', 11),
  (14, 'sexualViolence', 1),
  (15, 'someSexualViolence', 14),
  (16, 'frequentSexualViolence', 14),
  (17, 'adultToysAndGear', 1),
  (18, 'someAdultToysAndGear', 17),
  (19, 'frequentAdultToysAndGear', 17),
  (20, 'violence', 2),
  (21, 'someViolence', 20),
  (22, 'frequentViolence', 20),
  (23, 'gore', 2),
  (24, 'someGore', 23),
  (25, 'frequentGore', 23),
  (26, 'blood', 2),
  (27, 'someBlood', 26),
  (28, 'frequentBlood', 26),
  (29, 'deathAndSuicide', 2),
  (30, 'someDeath', 29),
  (31, 'frequentDeath', 29),
  (32, 'sexualLanguage', 3),
  (33, 'someSexualLanguage', 32),
  (34, 'frequentSexualLanguage', 32),
  (35, 'swearing', 3),
  (36, 'someSwearing', 35),
  (37, 'frequentSwearing', 35),
  (38, 'slurs', 3),
  (39, 'someSlurs', 38),
  (40, 'frequentSlurs', 38),
  (41, 'abusiveLanguage', 3),
  (42, 'someAbusiveLanguage', 41),
  (43, 'frequentAbusiveLanguage', 41),
  (45, 'hardDrugUse', 4),
  (46, 'someHardDrugUse', 45),
  (47, 'frequentHardDrugUse', 45),
  (48, 'commonDrugUse', 4),
  (49, 'someCommonDrugUse', 48),
  (50, 'FrequentCommonDrugUse', 48),
  (51, 'alcoholUse', 4),
  (52, 'someAlcoholUse', 51),
  (53, 'frequentAlcoholUse', 51),
  (54, 'referencesToSubstances', 4),
  (55, 'someReferencesToSubstances', 54),
  (56, 'frequentReferencesToSubstances', 54);