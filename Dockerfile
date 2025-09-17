# Use Node.js 18 LTS as base image
FROM node:18-alpine AS base

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install dependencies in a separate stage for better caching
FROM base AS dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
RUN pnpm prisma generate

# Build stage
FROM base AS build
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:18-alpine AS production

# Install pnpm in production image
RUN npm install -g pnpm

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install only production dependencies
RUN pnpm install --prod --frozen-lockfile

# Generate Prisma client in production
RUN pnpm prisma generate

# Copy built application from build stage
COPY --from=build /app/dist ./dist

# Copy any additional files needed at runtime
COPY --from=build /app/generated ./generated

# Change ownership to non-root user
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose the port the app runs on
EXPOSE 5000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node --version || exit 1

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD ["pnpm", "run", "start:prod"]
