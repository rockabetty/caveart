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
    -- thumbnail is direct upload for gallery tab view
    thumbnail_image_url TEXT,
    -- cover image is a big hero image for the comic profile
    cover_image INT REFERENCES comic_pages(id),
    comments BOOLEAN DEFAULT TRUE,
    critique BOOLEAN DEFAULT FALSE,
    is_unlisted BOOLEAN DEFAULT FALSE,
    is_private BOOLEAN DEFAULT FALSE,
    moderate_comments BOOLEAN DEFAULT FALSE,
    /* view_count here is intended to be an eventually-accurate amount, not updated in real time */
    view_count INT DEFAULT 0,
    /* whether a comic can be liked by a user */
    likes BOOLEAN DEFAULT TRUE,
    /* like_count is, like view_count, not intended to be updated in real time */
    like_count INT DEFAULT 0,
    rating INT REFERENCES ratings(id) ON DELETE CASCADE,
    stylesheet_variables JSONB,
    UNIQUE (title, subdomain),
    language VARCHAR(250)
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

CREATE TABLE IF NOT EXISTS comics_to_authors (
    id SERIAL PRIMARY KEY,
    comic_id INT REFERENCES comics(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    role TEXT,
    UNIQUE (user_id, comic_id)
);

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
  ('Fandom')
  ('Young Adult');

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