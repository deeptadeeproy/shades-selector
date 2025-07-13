# Stage 1: Build the Vite app
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve the built app with a lightweight static server
FROM node:18-alpine AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 5991
CMD ["serve", "-s", "dist", "-l", "5991"] 