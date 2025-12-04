# PostgreSQL Database Setup Guide

This guide explains how to migrate from SQLite to PostgreSQL for your SaaS application.

## Current Status

✅ **PostgreSQL Dependencies**: Already installed (`psycopg2-binary`, `asyncpg`)
✅ **Database Configuration**: Updated to use PostgreSQL
⏳ **PostgreSQL Database**: Needs to be created

## Option 1: Local PostgreSQL (Windows)

### Step 1: Install PostgreSQL

1. Download PostgreSQL from: https://www.postgresql.org/download/windows/
2. Run the installer
3. During installation:
   - **Password**: Set a password for the `postgres` user (default: `postgres`)
   - **Port**: Use default `5432`
   - **Locale**: Use default
4. Complete the installation

### Step 2: Create Database

After installation, open **SQL Shell (psql)** or **pgAdmin**:

#### Using psql (Command Line):
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE saaskit;

# Verify database was created
\l

# Exit
\q
```

#### Using pgAdmin (GUI):
1. Open **pgAdmin**
2. Connect to **PostgreSQL Server**
3. Right-click on **Databases** → **Create** → **Database**
4. **Database name**: `saaskit`
5. Click **Save**

### Step 3: Update .env File

Update `backend/.env` with your PostgreSQL credentials:

```env
# Database - PostgreSQL
DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@localhost:5432/saaskit
```

Replace `YOUR_PASSWORD` with the password you set during installation.

### Step 4: Create Database Schema

```bash
cd backend
python -m alembic upgrade head
```

Or run the backend server (it will auto-create tables):
```bash
python -m uvicorn app.main:app --reload
```

---

## Option 2: Cloud PostgreSQL (Recommended for Easy Setup)

### A. Supabase (Free Tier)

1. **Sign up**: https://supabase.com
2. **Create new project**:
   - Project name: `saaskit`
   - Database password: Choose a strong password
   - Region: Choose closest to you
3. **Get connection string**:
   - Go to **Project Settings** → **Database**
   - Scroll to **Connection string** → **URI**
   - Copy the connection string

4. **Update .env**:
```env
DATABASE_URL=postgresql+asyncpg://postgres.[PROJECT_REF]:[PASSWORD]@[HOST].pooler.supabase.com:5432/postgres
```

Example:
```env
DATABASE_URL=postgresql+asyncpg://postgres.abcdefgh:mypassword@aws-0-us-west-1.pooler.supabase.com:5432/postgres
```

### B. ElephantSQL (Free Tier)

1. **Sign up**: https://www.elephantsql.com
2. **Create new instance**:
   - Name: `saaskit`
   - Plan: **Tiny Turtle** (Free)
   - Region: Choose closest to you
3. **Get connection details**:
   - Click on your instance
   - Copy the **URL**

4. **Update .env**:
```env
DATABASE_URL=postgresql+asyncpg://username:password@host.db.elephantsql.com:5432/database
```

### C. Neon (Free Tier with Serverless PostgreSQL)

1. **Sign up**: https://neon.tech
2. **Create new project**:
   - Project name: `saaskit`
   - Region: Choose closest to you
3. **Get connection string**:
   - Copy the **Connection string**
   - Choose **asyncpg** format

4. **Update .env**:
```env
DATABASE_URL=postgresql+asyncpg://username:password@ep-xxx.region.aws.neon.tech/neondb
```

---

## Step 5: Initialize Database Schema

Once you've configured your PostgreSQL database (local or cloud), initialize the schema:

### Method 1: Using Alembic (Recommended)

```bash
cd backend

# Generate initial migration
alembic revision --autogenerate -m "Initial schema"

# Apply migrations
alembic upgrade head
```

### Method 2: Auto-creation (Development)

The application will automatically create tables when it starts:

```bash
cd backend
python -m uvicorn app.main:app --reload
```

Check the console output for:
```
Database initialized
```

---

## Verify Database Connection

### Check if tables were created:

**Using psql:**
```bash
psql -U postgres -d saaskit

# List tables
\dt

# Should show:
# - users
# - organizations
# - organization_members
# - subscriptions
# - invoices
# - payment_methods
```

**Using pgAdmin:**
1. Expand **Databases** → **saaskit** → **Schemas** → **public** → **Tables**
2. You should see all 6 tables

---

## Migrate Data from SQLite (Optional)

If you have existing data in SQLite that you want to migrate:

### Step 1: Export Data from SQLite

```bash
cd backend
python -c "
import sqlite3
import json

conn = sqlite3.connect('saaskit.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# Export users
cursor.execute('SELECT * FROM users')
users = [dict(row) for row in cursor.fetchall()]

with open('users_export.json', 'w') as f:
    json.dump(users, f, indent=2, default=str)

print(f'Exported {len(users)} users')
conn.close()
"
```

### Step 2: Import Data to PostgreSQL

```python
# Create a script: import_data.py
import asyncio
import json
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.core.config import settings

async def import_users():
    engine = create_async_engine(settings.DATABASE_URL)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    with open('users_export.json', 'r') as f:
        users_data = json.load(f)

    async with async_session() as session:
        for user_data in users_data:
            user = User(**user_data)
            session.add(user)
        await session.commit()

    print(f'Imported {len(users_data)} users')

asyncio.run(import_users())
```

Then run:
```bash
python import_data.py
```

---

## Update .env.example

Don't forget to update `.env.example` for other developers:

```env
# Database - PostgreSQL
# Local PostgreSQL
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/saaskit

# Alternative: SQLite for development
# DATABASE_URL=sqlite+aiosqlite:///./saaskit.db

# Cloud PostgreSQL
# Supabase: DATABASE_URL=postgresql+asyncpg://postgres.[REF]:[PASSWORD]@[HOST].pooler.supabase.com:5432/postgres
# ElephantSQL: DATABASE_URL=postgresql+asyncpg://[CONNECTION_STRING]
# Neon: DATABASE_URL=postgresql+asyncpg://[CONNECTION_STRING]
```

---

## Troubleshooting

### Error: "Could not connect to database"

**Check PostgreSQL is running:**
```bash
# Windows
sc query postgresql-x64-16

# Or check in Services (services.msc)
# Look for "postgresql-x64-16" service
```

**Start PostgreSQL:**
```bash
# Windows (as Administrator)
net start postgresql-x64-16
```

### Error: "password authentication failed"

- Verify password in `.env` matches PostgreSQL password
- Check username is correct (usually `postgres`)

### Error: "database does not exist"

Create the database:
```bash
psql -U postgres
CREATE DATABASE saaskit;
\q
```

### Port 5432 already in use

Another PostgreSQL instance is running. Either:
1. Use the existing instance
2. Stop the other instance
3. Change port in `.env`

---

## Testing the Setup

### Test 1: Connect and Create User

```bash
cd backend
python
```

```python
import asyncio
from app.core.database import init_db
from app.models.user import User
from sqlalchemy import select
from app.core.database import get_db

async def test():
    await init_db()
    print("✅ Database connection successful")

asyncio.run(test())
```

### Test 2: Run the Application

```bash
cd backend
python -m uvicorn app.main:app --reload
```

Check console output for:
```
Database initialized
INFO: Application startup complete.
```

### Test 3: Test API Endpoints

```bash
# Health check
curl http://127.0.0.1:8000/health

# Register user
curl -X POST http://127.0.0.1:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","full_name":"Test User"}'
```

---

## Benefits of PostgreSQL vs SQLite

✅ **Production-ready**: Handles concurrent connections
✅ **Better performance**: For large datasets
✅ **Advanced features**: Full-text search, JSON support, etc.
✅ **Scalability**: Easy to scale vertically and horizontally
✅ **Data integrity**: Strong ACID compliance
✅ **Cloud-ready**: Works seamlessly with cloud deployments

---

## Next Steps

1. Choose your PostgreSQL setup (Local or Cloud)
2. Create the database
3. Update `.env` with connection string
4. Run migrations or start the server
5. Test the connection
6. Optionally migrate data from SQLite

For production deployment, consider using a managed PostgreSQL service like:
- **Supabase** (includes real-time, auth, storage)
- **Neon** (serverless, auto-scaling)
- **AWS RDS** (fully managed)
- **Google Cloud SQL** (fully managed)
- **DigitalOcean Managed Databases** (simple, affordable)
