import os
import sqlite3
from backend.core.security import hash_password


class Database:

    def __init__(self, db_path: str):
        self.db_path = db_path
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        self.init_db()

    def get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def init_db(self):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL,
                    role TEXT NOT NULL,
                    mfa_enabled INTEGER DEFAULT 0
                )
            """
            )

            # Seed admin user if non-existent
            cursor.execute("SELECT * FROM users WHERE username = ?", ("admin",))
            if not cursor.fetchone():
                admin_hash = hash_password("admin123")
                cursor.execute(
                    "INSERT INTO users (username, password_hash, role, mfa_enabled) VALUES (?, ?, ?, ?)",
                    ("admin", admin_hash, "ADMIN", 0),
                )
            conn.commit()

    def get_user_by_username(self, username: str):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
            row = cursor.fetchone()
            return dict(row) if row else None

    def get_user_by_id(self, user_id: int):
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            row = cursor.fetchone()
            return dict(row) if row else None