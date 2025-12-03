# SaaSKit Backend

FastAPI backend application for the SaaSKit platform.

## Getting Started

### Prerequisites

- Python 3.11 or higher
- PostgreSQL 15+
- Redis 7+

### Installation

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Application
APP_NAME=SaaSKit API
APP_VERSION=1.0.0
ENVIRONMENT=development
DEBUG=True
SECRET_KEY=your-secret-key-here

# Server
HOST=0.0.0.0
PORT=8000

# CORS
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/saaskit_db

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
JWT_SECRET_KEY=your-jwt-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAILS_FROM_EMAIL=noreply@saaskit.com
EMAILS_FROM_NAME=SaaSKit

# Stripe
STRIPE_API_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### PostgreSQL Database Setup

#### Option 1: Install PostgreSQL locally (Windows)

1. **Download PostgreSQL**:
   - Visit https://www.postgresql.org/download/windows/
   - Download and install PostgreSQL 15 or higher
   - During installation, remember the password you set for the `postgres` user

2. **Create the database**:
   ```bash
   # Open Command Prompt or PowerShell
   # Login to PostgreSQL (enter your password when prompted)
   psql -U postgres

   # Create database
   CREATE DATABASE saaskit_db;

   # Create user (optional, for better security)
   CREATE USER saaskit_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE saaskit_db TO saaskit_user;

   # Exit psql
   \q
   ```

3. **Update your .env file**:
   ```env
   # If using postgres user
   DATABASE_URL=postgresql+asyncpg://postgres:your_password@localhost:5432/saaskit_db

   # If using custom user
   DATABASE_URL=postgresql+asyncpg://saaskit_user:your_password@localhost:5432/saaskit_db
   ```

#### Option 2: Use Cloud PostgreSQL (Free Tier)

**Using Supabase (Recommended)**:
1. Go to https://supabase.com
2. Create a free account and new project
3. Go to Settings > Database
4. Copy the connection string (URI mode)
5. Convert to async format in your .env:
   ```env
   # Change postgresql:// to postgresql+asyncpg://
   DATABASE_URL=postgresql+asyncpg://[YOUR_CONNECTION_STRING]
   ```

**Using ElephantSQL**:
1. Go to https://www.elephantsql.com
2. Create free account (20MB free tier)
3. Create new instance
4. Copy the URL and convert to async format

### Run Database Migrations

```bash
# Initialize Alembic (first time only)
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head

# Check current migration status
alembic current
```

### Development

```bash
# Run development server with auto-reload
uvicorn app.main:app --reload

# Or use the main.py script
python -m app.main
```

The API will be available at:
- API: http://localhost:8000
- Interactive Docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Project Structure

```
backend/
├── app/
│   ├── api/               # API routes
│   │   ├── endpoints/    # API endpoint modules
│   │   │   ├── auth.py
│   │   │   ├── users.py
│   │   │   ├── organizations.py
│   │   │   ├── billing.py
│   │   │   └── analytics.py
│   │   └── api.py        # API router aggregation
│   ├── core/             # Core functionality
│   │   ├── config.py     # Configuration
│   │   └── security.py   # Security utilities
│   ├── models/           # Database models
│   ├── schemas/          # Pydantic schemas
│   │   ├── auth.py
│   │   ├── user.py
│   │   ├── organization.py
│   │   └── billing.py
│   ├── services/         # Business logic
│   └── main.py           # Application entry point
├── alembic/              # Database migrations
│   ├── versions/         # Migration files
│   └── env.py           # Alembic environment
├── .env.example          # Example environment variables
├── .gitignore
├── requirements.txt      # Python dependencies
└── alembic.ini          # Alembic configuration
```

## API Endpoints

### Authentication (`/api/v1/auth`)

- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /refresh` - Refresh access token
- `POST /logout` - Logout user
- `POST /forgot-password` - Send password reset email
- `POST /reset-password` - Reset password
- `POST /verify-email` - Verify email
- `POST /resend-verification` - Resend verification email

### Users (`/api/v1/users`)

- `GET /me` - Get current user
- `PUT /me` - Update current user
- `DELETE /me` - Delete current user
- `GET /{user_id}` - Get user by ID (admin)
- `GET /` - List all users (admin)

### Organizations (`/api/v1/organizations`)

- `POST /` - Create organization
- `GET /` - List user's organizations
- `GET /{org_id}` - Get organization
- `PUT /{org_id}` - Update organization
- `DELETE /{org_id}` - Delete organization
- `POST /{org_id}/members` - Invite member
- `DELETE /{org_id}/members/{user_id}` - Remove member

### Billing (`/api/v1/billing`)

- `GET /subscription` - Get subscription
- `POST /subscription` - Create/update subscription
- `DELETE /subscription` - Cancel subscription
- `GET /invoices` - List invoices
- `GET /invoices/{invoice_id}` - Get invoice
- `GET /payment-methods` - List payment methods
- `POST /payment-methods` - Add payment method
- `DELETE /payment-methods/{pm_id}` - Remove payment method
- `POST /webhook` - Stripe webhook handler

### Analytics (`/api/v1/analytics`)

- `GET /dashboard` - Dashboard analytics
- `GET /users` - User analytics
- `GET /revenue` - Revenue analytics
- `GET /subscriptions` - Subscription analytics

## Development

### Adding New Endpoints

1. Create endpoint file in `app/api/endpoints/`
2. Define routes using FastAPI decorators
3. Create Pydantic schemas in `app/schemas/`
4. Register router in `app/api/api.py`

Example:

```python
# app/api/endpoints/example.py
from fastapi import APIRouter
from app.schemas.example import ExampleSchema

router = APIRouter()

@router.get("/")
async def get_examples():
    return {"examples": []}
```

### Database Models

Database models are created using SQLAlchemy in `app/models/`:

- `user.py` - User model with authentication fields
- `organization.py` - Organization and membership models
- `subscription.py` - Subscription, invoice, and payment method models

To create a new migration after modifying models:
```bash
alembic revision --autogenerate -m "Description of changes"
alembic upgrade head
```

### Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

## Deployment

### Production Server

```bash
# Install production server
pip install gunicorn

# Run with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS configured for frontend domain
- Environment variables for sensitive data
- SQL injection protection via SQLAlchemy

## API Documentation

FastAPI automatically generates interactive API documentation:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **OpenAPI JSON**: http://localhost:8000/api/openapi.json

## Learn More

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org)
- [Pydantic Documentation](https://docs.pydantic.dev)
