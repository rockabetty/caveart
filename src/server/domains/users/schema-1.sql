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

CREATE TRIGGER update_users_modtime
BEFORE UPDATE ON users FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
