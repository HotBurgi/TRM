# Multi-stage Dockerfile for SvelteKit (adapter-node)
# 1) Builder: install deps and build
# 2) Runner: copy only runtime artifacts and run `node build`

# ---- Builder ----
FROM node:20-alpine AS builder

# Ensure reproducible installs (optional but recommended)
ENV NODE_ENV=development

WORKDIR /app

# Install OS deps if needed (git for some installs). Keep minimal.
RUN apk add --no-cache --virtual .builds-deps python3 make g++

# Copy package manifests first to leverage Docker layer caching
COPY package.json package-lock.json* pnpm-lock.yaml* bun.lockb* ./

# If using npm
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then npm -g i pnpm && pnpm i --frozen-lockfile; \
    elif [ -f bun.lockb ]; then npm -g i bun && bun install --frozen-lockfile; \
    else npm i; fi

# Copy the rest of the app
COPY . .

# Build the app (SvelteKit)
RUN npm run build

# ---- Runner ----
FROM node:20-alpine AS runner
ENV NODE_ENV=production

WORKDIR /app

# Copy only what we need at runtime
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules

# You may expose a different port; SvelteKit adapter-node defaults to 3000
EXPOSE 3000

# SvelteKit respects HOST/PORT env vars
ENV PORT=3000 HOST=0.0.0.0

# Default command
CMD ["node", "build"]
