import sqlite3

# Connect to the database
conn = sqlite3.connect('saaskit.db')
cursor = conn.cursor()

# Check if column exists
cursor.execute("PRAGMA table_info(users)")
columns = [column[1] for column in cursor.fetchall()]

if 'company_name' not in columns:
    # Add the column
    cursor.execute("ALTER TABLE users ADD COLUMN company_name TEXT")
    conn.commit()
    print("Added company_name column to users table")
else:
    print("company_name column already exists")

conn.close()
