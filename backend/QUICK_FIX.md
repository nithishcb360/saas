# Quick Fix Guide

## Issue 1: Port 8000 Already in Use ✅ FIXED

**Error**: `[Errno 10048] error while attempting to bind on address`

**Solution - Kill the existing process**:
```bash
# Find the process (already running - PID 8108)
netstat -ano | findstr :8000

# Kill it
taskkill /PID 8108 /F

# Or just restart your computer if you're unsure
```

**Alternative - Use a different port**:
```bash
# Run on port 8001 instead
uvicorn app.main:app --port 8001
```

## Issue 2: Using SQLite Instead of PostgreSQL ✅ FIXED

**Problem**: Your `.env` file had `DATABASE_URL=sqlite+aiosqlite:///./saaskit.db`

**Fixed**: Updated to PostgreSQL format in `.env` file

## Next Steps:

### 1. Set Up PostgreSQL Database

You have **3 options**:

#### Option A: Use Supabase (Easiest - No Installation) ⭐ RECOMMENDED

1. Go to https://supabase.com and sign up (free)
2. Click "New Project"
3. Fill in:
   - Project name: `saaskit`
   - Database password: (choose a strong password)
   - Region: Choose closest to you
4. Wait 2 minutes for setup
5. Go to: **Settings** → **Database**
6. Scroll to "Connection String" → Click **URI** tab
7. Copy the connection string
8. In your `.env` file, update line 17:
   ```env
   DATABASE_URL=postgresql+asyncpg://YOUR_COPIED_STRING_HERE
   ```
   Make sure to change `postgresql://` to `postgresql+asyncpg://`

#### Option B: Install PostgreSQL Locally

1. Download from https://www.postgresql.org/download/windows/
2. Install (remember the password!)
3. Create database:
   ```bash
   psql -U postgres
   CREATE DATABASE saaskit_db;
   \q
   ```
4. Update line 17 in `.env`:
   ```env
   DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@localhost:5432/saaskit_db
   ```

#### Option C: Use ElephantSQL (Free 20MB)

1. Go to https://www.elephantsql.com
2. Sign up and create a "Tiny Turtle" instance (free)
3. Copy the URL from instance details
4. Update line 17 in `.env`:
   ```env
   DATABASE_URL=postgresql+asyncpg://YOUR_ELEPHANTSQL_URL
   ```

### 2. Kill the Process on Port 8000

```bash
# Kill the existing process
taskkill /PID 8108 /F
```

### 3. Update .env with Your Database URL

Edit `backend/.env` line 17 with your actual database connection string.

### 4. Install Missing Dependencies

If you get errors about missing packages:
```bash
pip install asyncpg psycopg2-binary
```

### 5. Initialize Database Tables

```bash
cd backend

# Create migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

### 6. Start the Server

```bash
uvicorn app.main:app --reload
```

You should see:
```
✓ Database initialized
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 7. Test It!

Open browser: http://localhost:8000/api/docs

## Still Having Issues?

### Can't connect to database?
- Double-check your DATABASE_URL in `.env`
- Make sure PostgreSQL is running (if local)
- Test connection:
  ```bash
  psql "YOUR_DATABASE_URL"
  ```

### Module not found?
```bash
pip install -r requirements.txt
```

### Alembic errors?
```bash
# Make sure you're in backend directory
cd backend
alembic revision --autogenerate -m "Initial"
alembic upgrade head
```

## Summary

1. ✅ Fixed `.env` file to use PostgreSQL
2. ⚠️ You need to set up a PostgreSQL database (Supabase recommended)
3. ⚠️ Kill process on port 8000: `taskkill /PID 8108 /F`
4. ⚠️ Update line 17 in `.env` with your actual database URL
5. ⚠️ Run migrations: `alembic revision --autogenerate -m "Initial" && alembic upgrade head`
6. ✅ Start server: `uvicorn app.main:app --reload`
