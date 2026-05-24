FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm && apk add --no-cache curl

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json turbo.json ./

COPY apps/frontend ./apps/frontend

RUN pnpm install --frozen-lockfile

RUN pnpm --filter frontend build && echo "✓ Frontend build successful"

RUN test -d ./apps/frontend/.next && echo "✓ .next directory exists" || (echo "ERROR: .next not found" && exit 1)

EXPOSE 3000

CMD ["pnpm", "--filter", "frontend", "start"]
