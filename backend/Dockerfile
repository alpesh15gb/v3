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

# Set Prisma environment variables for binary platform
ENV PRISMA_CLI_BINARY_TARGETS="linux-musl-openssl-3.0.x,debian-openssl-3.0.x"

# Generate Prisma Client (now that all files are present)
RUN npx prisma generate

# Build TypeScript
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

EXPOSE 5000

CMD ["node", "dist/server.js"]
