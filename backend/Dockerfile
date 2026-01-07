# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL and Build Tools (needed for some npm packages)
RUN apk add --no-cache openssl python3 make g++

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
# Remove package-lock.json to avoid Windows/Linux conflicts
RUN rm -f package-lock.json
# Install without running scripts first to prevent postinstall failures (like Prisma engine download issues) blocking the build
RUN npm install --ignore-scripts --no-audit
# Explicitly generate Prisma client (this will download engines if needed)
RUN npx prisma generate

COPY . .

# Build TypeScript
RUN npm run build

# Production Stage
FROM node:20-alpine

# Install OpenSSL for Prisma (needed for runtime too)
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Prune dev dependencies
RUN npm prune --production

EXPOSE 5000

# Start command
CMD ["node", "dist/server.js"]
