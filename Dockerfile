# -----------------------------------------------------------------------------
# Stage 1: Build Application
# -----------------------------------------------------------------------------
FROM node:20-slim AS builder

WORKDIR /app

# Copy package descriptors
COPY package.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm install

# Copy application source code
COPY . .

# Build Vite frontend assets and compile server.ts to dist/server.js
RUN npm run build

# -----------------------------------------------------------------------------
# Stage 2: Production Runtime
# -----------------------------------------------------------------------------
FROM node:20-slim AS runner

WORKDIR /app

# Configure Cloud Run environment
ENV NODE_ENV=production
ENV PORT=8080

# Install production dependencies only
COPY package.json ./
RUN npm install --omit=dev

# Copy compiled distribution output from the builder stage
COPY --from=builder /app/dist ./dist

# Expose Cloud Run default port
EXPOSE 8080

# Execute server directly from the compiled dist directory
CMD ["node", "dist/server.js"]
