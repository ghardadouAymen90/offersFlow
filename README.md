# OffersFlow

A monorepo application with a Next.js frontend and NestJS backend, managed with Turborepo and pnpm.

## Project Structure

```
offersflow/
├── apps/
│   ├── frontend/        # Next.js frontend application
│   └── backend/         # NestJS backend API with Prisma
├── packages/            # Shared packages (if needed)
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: Next.js, React , TypeScript
- **Backend**: NestJS, PostgreSQL, Prisma ORM
- **Package Manager**: pnpm

## Prerequisites

- Node.js 20+
- pnpm 7 (install with `npm install -g pnpm@7.33.6`)
- PostgreSQL 12+ (for the backend)

## Installation

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Start the database with Docker**

   ```bash
   pnpm db:up
   ```

   ===> This starts PostgreSQL in a Docker container

3. **Set up environment variables**

   Copy `.env.example` files and configure them:

   ```bash
   # Root
   cp .env.example .env

   # Backend
   cp apps/backend/.env.example apps/backend/.env
   # The default .env.example already has the Docker database URL configured

   # Frontend (optional)
   cp apps/frontend/.env.example apps/frontend/.env
   ```

4. **Set up the database schema**

   ```bash
   # Generate Prisma client and push schema to database
   pnpm db:push

   # Or run migrations (after new migrations)
   pnpm db:migrate:deploy
   ```

## Development

### Run all apps in development mode

```bash
pnpm dev
```

This starts:

- Frontend on `http://localhost:3000`
- Backend on `http://localhost:3001`

### Run individual apps

```bash
# Frontend only
pnpm -F frontend dev

# Backend only
pnpm -F backend dev

# Open Prisma Studio
pnpm -F backend run db:studio
```

## Building

Build all apps for production:

```bash
pnpm build
```

Build a specific app:

```bash
pnpm -F frontend build
pnpm -F backend build
```

## Database Migrations

After modifying `prisma/schema.prisma`:

```bash
# Create a new migration
pnpm db:migrate:dev --name migration_name

# Push changes to database (development)
pnpm db:push

# Deploy migrations (production)
pnpm db:migrate:deploy
```

## Docker Database Management

Manage PostgreSQL container from the root directory:

```bash
# Start the database
pnpm db:up

# Stop the database
pnpm db:down

# View database logs
pnpm db:logs

# Reset database (removes all data and recreates)
pnpm db:reset
```

## Linting & Type Checking

```bash
# Run linters across all apps
pnpm lint

# Type check across all apps
pnpm type-check

# Format code
pnpm format

# Check formatting
pnpm format:check
```

## Troubleshooting

### Database connection issues

- Ensure PostgreSQL is running
- Verify `DATABASE_URL` in `.env`
- Check credentials and database name

### pnpm issues

- Clear cache: `pnpm store prune`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`

## License

MIT
