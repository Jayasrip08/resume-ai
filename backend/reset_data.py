import os
import shutil
from database import get_connection
from vector_db import collection, client
import chromadb

def clean_postgres():
    print("CLEANING POSTGRESQL...")
    conn = get_connection()
    try:
        with conn:
            with conn.cursor() as cur:
                cur.execute("TRUNCATE TABLE candidates RESTART IDENTITY;")
        print("SUCCESS: PostgreSQL candidates table truncated.")
    except Exception as e:
        print(f"FAILED: Error cleaning PostgreSQL: {e}")
    finally:
        conn.close()

def clean_chromadb():
    print("\nCLEANING CHROMADB...")
    try:
        # Get all IDs and delete them
        results = collection.get()
        ids = results.get("ids", [])
        if ids:
            collection.delete(ids=ids)
            print(f"SUCCESS: Deleted {len(ids)} documents from ChromaDB collection 'resumes'.")
        else:
            print("INFO: ChromaDB was already empty.")
    except Exception as e:
        print(f"FAILED: Error cleaning ChromaDB: {e}")

def clean_local_uploads():
    print("\nCLEANING LOCAL UPLOADS FOLDER...")
    upload_dir = "uploads"
    if os.path.exists(upload_dir):
        try:
            for filename in os.listdir(upload_dir):
                file_path = os.path.join(upload_dir, filename)
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            print("SUCCESS: Local uploads folder cleared.")
        except Exception as e:
            print(f"FAILED: Error cleaning uploads folder: {e}")
    else:
        print("INFO: Uploads folder not found.")

if __name__ == "__main__":
    print("STARTING DATA CLEANUP MISSION...")
    print("-" * 40)
    clean_postgres()
    clean_chromadb()
    clean_local_uploads()
    print("-" * 40)
    print("CLEANUP COMPLETE!")
