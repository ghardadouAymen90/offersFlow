# OffersFlow

A phone subscription management system with a Next.js frontend and NestJS backend, managed with Turborepo and pnpm.

## Key Features

- **User Authentication** - Secure registration and login with JWT tokens
- **Subscription Management** - Subscribe, upgrade, and cancel plans
- **Grace Period Cancellation** - 1-month grace period before final cancellation
- **Retention Offers** - Discounts offered during cancellation (20% on current plan, 30% on upgrades)
- **Responsive UI** - Mobile-first design with Material-UI
- **REST API with Swagger** - Interactive API documentation at `/api`

## Project Structure

MONO REPO

```
offersflow/
├── apps/
│   ├── frontend/        # Next.js React frontend
│   └── backend/         # NestJS REST API
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: Next.js, React, TypeScript, Material-UI, Zustand
- **Backend**: NestJS, PostgreSQL, Prisma ORM, JWT Auth
- **Documentation**: Swagger/OpenAPI

## ⚙️ Prerequisites

- Node.js 20+
- pnpm 7+ (`npm install -g pnpm@7.33.6`)
- PostgreSQL 12+ (or Docker)

## Quick Start

### 1. Install dependencies

```bash
pnpm install
```

### 2. Start PostgreSQL (Docker)

```bash
docker-compose up -d
```

### 3. Set up environment variables

```bash
# Backend
cp apps/backend/.env.example apps/backend/.env

# Frontend
cp apps/frontend/.env.example apps/frontend/.env
```

### 4. Initialize database

```bash
pnpm db:up
pnpm prisma:generate
pnpm db:migrate:deploy
pnpm db:seed
```

### 5. Start development servers

```bash
pnpm dev
```
Hint: think about restarting TS server if error in editor

**Access:**

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- **API Docs**: `http://localhost:3001/api` (Swagger)

## API Documentation

Interactive Swagger documentation is available at:

```
http://localhost:3001/api
```

### Core Endpoints

**Authentication**

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user profile

**Offers**

- `GET /offers` - List all subscription offers
- `GET /offers/:id` - Get offer details

**Subscriptions**

- `POST /subscriptions` - Create subscription
- `GET /subscriptions/current` - Get active subscription
- `POST /subscriptions/change` - Upgrade subscription
- `POST /subscriptions/request-cancellation` - Request cancellation with grace period
- `GET /subscriptions/suggest` - Get upgrade suggestions

## Development

### Frontend Development

```bash
# Start frontend only
pnpm -F frontend dev

# Build for production
pnpm -F frontend build
```

### Backend Development

```bash
# Start backend only
pnpm -F backend dev

# Run database migrations
pnpm -F backend run db:migrate:dev --name migration_name

# Open Prisma Studio
pnpm -F backend run db:studio
```

### Database

```bash
# Create migration
pnpm -F backend run db:migrate:dev --name <migration_name>

# Push schema (development only)
pnpm -F backend run db:push

# Seed database
pnpm -F backend run seed

# Reset database (⚠️ loses all data)
pnpm -F backend run db:reset
```

## Testing

```bash
# Run tests for specific app
pnpm -F backend run test
pnpm -F frontend run test
```

## Build for Production

```bash
# Build all apps
pnpm build

# Build specific app
pnpm -F backend build
pnpm -F frontend build
```

## Code Quality

```bash
# Lint code
pnpm lint

# Type check
pnpm type-check

# Format code
pnpm format
```

## Environment Variables

### Backend (`.env`)

```
DATABASE_URL="postgresql://user:password@localhost:5432/offersflow"
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="7d"
PORT=3001
```

### Frontend (`.env`)

```
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Backend error handling (Globals)

1. LoggingInterceptor (logging.interceptor.ts)
   Logs all HTTP requests:

- Request method, URL, status code, duration
- Catches errors and logs them with duration
- Formatted output: GET /subscriptions - 200 (45ms)

2. HttpExceptionFilter (http-exception.filter.ts)
   Handles all exceptions with proper logging:

- Catches HttpException and logs as warnings (400, 401, etc.)
- Catches unhandled Error exceptions and logs them as errors


## App Interfaces

![Offers](screenShots/Offers.png)

![Subscribe](screenShots/Subscribe.png)

![SuggestUpgrade](screenShots/SuggestUpgrade.png)

![Unsubscribe](screenShots/Unsubscribe.png)
