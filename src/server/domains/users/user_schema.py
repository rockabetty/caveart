import enum
from sqlalchemy import MetaData, TIMESTAMP, Table, Column, Integer, Enum, String

metadata_obj = MetaData()

class UserRole(enum.Enum):
    MEMBER = "Member"
    CREATOR = "Creator"
    MODERATOR = "Moderator"


CREATE TABLE IF NOT EXISTS users (
  password_reset_expiry TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role user_role DEFAULT 'Member'
);


user_table = Table(
  "user",
  metadata_obj,
  Column(
    "id", Integer, Sequence("user_id_sequence"), primary_key=True
  ),
  Column("username", String(250), nullable=False),
  column("email", String(250), nullable=False),
  Column("password", String(512), nullable=False),
  Column("password_reset_token", String(250)),
  Column("password_reset_expiry", ),
  Column("verified"),
  Column("created_at"),
  Column("updated_at"),
  Column("role", UserRole),
  UniqueConstraint("username", name="unique_usernames")
  UniqueConstraint("email", name="unique_emails")
  password VARCHAR(512) NOT NULL,
  password_reset_token VARCHAR(250),
  password_reset_expiry TIMESTAMP,
  verified BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  role user_role DEFAULT 'Member'
)

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
