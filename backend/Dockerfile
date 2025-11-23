# ===== Stage 1: Build =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

# ===== Stage 2: Production =====
FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

COPY --from=builder /app/prisma/dev.db ./prisma/dev.db

ENV NODE_ENV=production
ENV DATABASE_URL="file:./prisma/dev.db"

EXPOSE 3000

CMD npx prisma generate && npx prisma migrate deploy && node dist/src/main.js