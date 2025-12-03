# SaaSKit - Full Stack SaaS Platform

A modern, scalable SaaS platform with a Next.js frontend and FastAPI backend.

## Project Structure

```
.
├── frontend/          # Next.js frontend application
├── backend/           # FastAPI backend application
└── README.md         # This file
```

## Quick Start

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.11+ (for backend)
- PostgreSQL 15+ (for database)
- Redis 7+ (for caching)

### Option 1: Using Docker (Recommended)

```bash
# Start all services (backend + database + redis)
cd backend
docker-compose up -d

# Start frontend
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/api/docs

### Option 2: Manual Setup

See individual README files:
- [Frontend Setup](./frontend/README.md)
- [Backend Setup](./backend/README.md)

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Email verification
  - Password reset flow
  - Role-based access control

- **Multi-Tenant Architecture**
  - Organizations/Teams support
  - Member invitations
  - Role management

- **Subscription & Billing**
  - Stripe integration
  - Multiple pricing tiers
  - Invoice management
  - Payment method management

- **Analytics Dashboard**
  - User metrics
  - Revenue tracking
  - Subscription analytics
  - Custom reports

- **Admin Panel**
  - User management
  - Organization management
  - Platform-wide settings
  - Audit logs

## Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Axios for API calls

### Backend
- FastAPI
- Python 3.11
- PostgreSQL (with SQLAlchemy)
- Redis
- JWT authentication
- Stripe for payments

## Development

### Frontend Development

```bash
cd frontend
npm run dev
```

### Backend Development

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Environment Variables

Copy the example environment files and update with your values:

```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
```

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
# saas
