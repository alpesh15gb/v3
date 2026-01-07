# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
# Remove package-lock.json to avoid Windows/Linux conflicts and force fresh resolution
RUN rm -f package-lock.json
RUN npm install
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
