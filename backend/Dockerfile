# Build Stage
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL (required for Prisma)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (using install instead of ci since package-lock may be Windows-generated)
RUN npm install --production=false

# Copy source code
COPY . .

# Build TypeScript (skip prisma generate for now, do it at runtime)
RUN npm run build

# Production Stage
FROM node:20-slim

# Install OpenSSL for Prisma runtime
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Create startup script that generates Prisma client and starts the app
RUN echo '#!/bin/sh\necho "Generating Prisma Client..."\nnpx prisma generate\necho "Starting application..."\nnode dist/server.js' > /app/start.sh && chmod +x /app/start.sh

EXPOSE 5000

CMD ["/app/start.sh"]
