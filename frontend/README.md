# SaaSKit Frontend

Next.js frontend application for the SaaSKit platform.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install
# or
pnpm install
```

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# API
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Application
NEXT_PUBLIC_APP_NAME=SaaSKit
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Analytics (optional)
NEXT_PUBLIC_ANALYTICS_ID=
```

### Development

```bash
# Run development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── admin/             # Admin pages
│   └── ...
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and configurations
│   ├── api.ts            # API client
│   └── utils.ts          # Utility functions
├── public/               # Static files
├── styles/               # Global styles
└── package.json
```

## Key Features

### Components

- Built with shadcn/ui components
- Fully typed with TypeScript
- Responsive design with Tailwind CSS
- Dark mode support

### API Integration

The frontend uses Axios to communicate with the FastAPI backend. The API client ([lib/api.ts](lib/api.ts)) includes:

- Automatic token management
- Request/response interceptors
- Token refresh logic
- Type-safe API calls

Example usage:

```typescript
import { authAPI, usersAPI } from '@/lib/api'

// Login
const response = await authAPI.login('user@example.com', 'password')

// Get current user
const user = await usersAPI.getCurrentUser()
```

### Authentication

Authentication is handled via JWT tokens stored in localStorage:
- Access tokens for API requests
- Refresh tokens for token renewal
- Automatic token refresh on expiry
- Redirect to login on authentication failure

### Pages

- **Landing Page** (`/`) - Marketing homepage
- **Authentication** (`/auth/*`) - Login, signup, password reset
- **Dashboard** (`/dashboard`) - Main user dashboard
- **Admin Panel** (`/admin`) - Platform administration
- **Settings** - User and organization settings

## Styling

The project uses:
- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for pre-built components
- **next-themes** for dark mode support
- **Lucide Icons** for icons

## Development Tips

### Adding New Components

Use the shadcn/ui CLI to add components:

```bash
npx shadcn@latest add button
```

### API Calls

Always use the API client in `lib/api.ts` for consistency and proper error handling.

### Type Safety

Define types for API responses to maintain type safety:

```typescript
interface User {
  id: string
  email: string
  full_name: string
}

const user = await usersAPI.getCurrentUser() as User
```

## Deployment

### Vercel (Recommended)

```bash
# Deploy to Vercel
vercel
```

### Docker

```bash
# Build Docker image
docker build -t saaskit-frontend .

# Run container
docker run -p 3000:3000 saaskit-frontend
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
