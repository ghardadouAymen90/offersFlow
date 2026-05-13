#!/bin/sh
set -e

echo "Starting backend application..."

# Change to backend directory
cd /app/apps/backend

# Run database migrations
echo "Running database migrations..."
pnpm exec prisma migrate deploy

# Seed database (optional, ignore errors)
echo "Seeding database..."
pnpm exec prisma db seed 2>/dev/null || echo "Database seeding skipped or already seeded"

# Start the application - main.js is at dist/src/main.js due to tsconfig rootDir
echo "Starting NestJS application..."
exec node dist/src/main
