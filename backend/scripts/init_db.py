"""
Script to initialize the database and create tables.
Run this before starting the application for the first time.
"""
import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import init_db


async def main():
    print("Initializing database...")
    try:
        await init_db()
        print("✓ Database initialized successfully!")
        print("\nTables created:")
        print("  - users")
        print("  - organizations")
        print("  - organization_members")
        print("  - subscriptions")
        print("  - invoices")
        print("  - payment_methods")
    except Exception as e:
        print(f"✗ Error initializing database: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
