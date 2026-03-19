import sqlite3

def upgrade_database():
    try:
        conn = sqlite3.connect('scam_detector.db')
        cursor = conn.cursor()
        
        # This command adds the missing column to your existing table
        cursor.execute("ALTER TABLE predictions ADD COLUMN user_id INTEGER DEFAULT NULL")
        
        conn.commit()
        print("Success: user_id column added to the predictions table!")
    except sqlite3.OperationalError:
        print("Note: Column might already exist or the table wasn't found.")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    upgrade_database()