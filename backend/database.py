import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()

DB_CONFIG = {
    "dbname": os.getenv("DB_NAME", "resume_ai"),
    "user": os.getenv("DB_USER", "postgres"),
    "password": os.getenv("DB_PASSWORD", "root"),
    "host": os.getenv("DB_HOST", "localhost"),
    "port": os.getenv("DB_PORT", "5432")
}

def get_connection():
    """Always returns a fresh connection."""
    return psycopg2.connect(**DB_CONFIG)

def insert_candidate(name, filename, skills):
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO candidates (name, filename, skills) VALUES (%s, %s, %s)",
                    (name, filename, skills)
                )
    finally:
        conn.close()

def get_all_candidates():
    conn = get_connection()
    try:
        with conn:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    "SELECT id, name, filename, skills, uploaded_at FROM candidates ORDER BY uploaded_at DESC"
                )
                rows = cur.fetchall()
                return [
                    {
                        "id": row["id"],
                        "name": row["name"],
                        "filename": row["filename"],
                        "skills": row["skills"],
                        "uploaded_at": str(row["uploaded_at"])
                    }
                    for row in rows
                ]
    finally:
        conn.close()