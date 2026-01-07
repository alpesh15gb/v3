# Build Stage
FROM node:20-slim AS builder

WORKDIR /app

# Accept build argument
ARG VITE_API_URL=http://localhost:5001/api

# Set as environment variable for Vite build
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
