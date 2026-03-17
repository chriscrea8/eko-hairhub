# ── Build stage ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

RUN npm install

# Generate Prisma client (does not need DB connection)
RUN npx prisma generate

COPY src ./src

RUN npm run build

# ── Production stage ──────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install openssl + dumb-init
RUN apk add --no-cache openssl dumb-init

RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY package*.json ./
RUN npm install --omit=dev

# Regenerate Prisma client in production image
COPY prisma ./prisma/
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 5000

# migrate deploy runs at RUNTIME when env vars are available
CMD ["dumb-init", "sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
