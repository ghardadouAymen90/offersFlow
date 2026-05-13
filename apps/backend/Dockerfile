FROM node:20-alpine

WORKDIR /app

# Install all build tools and runtime dependencies
RUN npm install -g pnpm && apk add --no-cache curl openssl python3 make g++

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json turbo.json ./

COPY apps ./apps

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/backend
RUN pnpm exec prisma generate

WORKDIR /app
RUN pnpm --filter backend run build

RUN test -d ./apps/backend/dist && echo "✓ Build successful" || (echo "ERROR: Build failed" && exit 1)

COPY apps/backend/docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Start backend
ENTRYPOINT ["/app/docker-entrypoint.sh"]
