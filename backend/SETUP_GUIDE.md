# Backend Setup Guide

Complete guide to set up the backend with PostgreSQL database.

## Prerequisites

- Python 3.11+
- PostgreSQL 15+ (local or cloud)

## Step-by-Step Setup

### 1. Install Python Dependencies

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Set Up PostgreSQL Database

#### Option A: Local PostgreSQL (Windows)

1. **Download and Install**:
   - Go to https://www.postgresql.org/download/windows/
   - Download the installer (version 15 or higher)
   - Run the installer
   - **Important**: Remember the password you set for the `postgres` user!
   - Default port: 5432 (keep this unless you have conflicts)

2. **Verify Installation**:
   ```bash
   # Check PostgreSQL is running
   psql --version
   ```

3. **Create Database**:
   ```bash
   # Open Command Prompt or PowerShell
   psql -U postgres
   # Enter your password when prompted

   # In psql console, run:
   CREATE DATABASE saaskit_db;
   \l  # List databases to verify
   \q  # Exit
   ```

#### Option B: Cloud PostgreSQL (Free - No Installation)

**Supabase (Recommended)**:
1. Sign up at https://supabase.com
2. Create a new project
3. Wait for project to initialize (~2 minutes)
4. Go to: Settings → Database
5. Copy the "URI" connection string
6. You'll use this in your .env file

**ElephantSQL**:
1. Sign up at https://www.elephantsql.com
2. Create a new instance (Tiny Turtle - FREE)
3. Copy the URL from the instance details

### 3. Configure Environment Variables

Create `.env` file in the backend directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file:

```env
# Application
APP_NAME=SaaSKit API
APP_VERSION=1.0.0
ENVIRONMENT=development
DEBUG=True
SECRET_KEY=your-super-secret-key-change-this-in-production

# Server
HOST=0.0.0.0
PORT=8000

# CORS
FRONTEND_URL=http://localhost:3000

# Database - UPDATE THIS!
# For local PostgreSQL:
DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@localhost:5432/saaskit_db

# For Supabase:
# DATABASE_URL=postgresql+asyncpg://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres

# For ElephantSQL:
# DATABASE_URL=postgresql+asyncpg://[YOUR_CONNECTION_STRING]

# Redis (optional - for production features)
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=another-super-secret-key-for-jwt-tokens
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email (optional - for production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EMAILS_FROM_EMAIL=noreply@saaskit.com
EMAILS_FROM_NAME=SaaSKit

# Stripe (optional - for billing features)
STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
```

### 4. Initialize Database

**Option A: Using Alembic (Recommended)**

```bash
# Create initial migration
alembic revision --autogenerate -m "Initial migration"

# Apply migration
alembic upgrade head
```

**Option B: Using Init Script**

```bash
# Run the initialization script
python scripts/init_db.py
```

### 5. Start the Backend Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload

# Or using Python
python -m app.main
```

You should see:
```
✓ Database initialized
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### 6. Test the API

Open your browser and visit:
- **API Health**: http://localhost:8000/health
- **API Docs**: http://localhost:8000/api/docs (Swagger UI)
- **ReDoc**: http://localhost:8000/api/redoc

## Troubleshooting

### Issue: "connection refused" or "could not connect to server"

**Solution**:
1. Check if PostgreSQL is running:
   ```bash
   # Windows: Check Services
   services.msc
   # Look for "postgresql-x64-15" service

   # Or using psql
   psql -U postgres -c "SELECT version();"
   ```

2. Verify the DATABASE_URL in your .env file
3. Make sure the password is correct
4. Check if port 5432 is correct

### Issue: "password authentication failed"

**Solution**:
- Double-check the password in your .env file
- Reset PostgreSQL password:
  ```bash
  psql -U postgres
  ALTER USER postgres WITH PASSWORD 'new_password';
  ```

### Issue: "database does not exist"

**Solution**:
```bash
psql -U postgres
CREATE DATABASE saaskit_db;
```

### Issue: "ModuleNotFoundError"

**Solution**:
```bash
# Make sure virtual environment is activated
# Windows:
venv\Scripts\activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: Alembic migration errors

**Solution**:
```bash
# Reset migrations (WARNING: deletes all data!)
# Drop all tables
psql -U postgres -d saaskit_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# Delete version files
rm -rf alembic/versions/*.py

# Create fresh migration
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## Database Management Commands

```bash
# Create new migration after model changes
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1

# Check current migration
alembic current

# View migration history
alembic history
```

## Next Steps

1. ✓ Backend is running
2. Go to frontend directory and set it up
3. Start building features!

## Need Help?

- FastAPI docs: https://fastapi.tiangolo.com
- SQLAlchemy docs: https://docs.sqlalchemy.org
- Alembic docs: https://alembic.sqlalchemy.org
- PostgreSQL docs: https://www.postgresql.org/docs/
