# Quickstart: Docker Compose Setup

**Feature**: Docker Compose orchestration for CraftCV local development.

## Prerequisites

- Docker Engine 24+
- Docker Compose v2 plugin (`docker compose` command)

## Setup

### 1. Configure Environment

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
# Edit .env with your Supabase URL, keys, and LLM API keys
```

Required variables in `.env`:
- `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`

### 2. Start All Services

```bash
docker compose up -d
```

This starts 4 services: backend, frontend, redis, playwright.

### 3. Verify Services

```bash
# Check all services are running
docker compose ps

# Backend health check
curl http://localhost:8000/health
# Expected: {"status":"ok"}

# Frontend
open http://localhost:3000

# Redis
docker compose exec redis redis-cli ping
# Expected: PONG
```

### 4. View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

### 5. Stop Services

```bash
docker compose down

# To also remove volumes (will delete node_modules cache)
docker compose down -v
```

## Common Tasks

### Rebuild a Service

```bash
docker compose build backend
docker compose up -d backend
```

### Run Backend Tests

```bash
docker compose exec backend pytest
```

### Run Frontend Commands

```bash
docker compose exec frontend npm run lint
docker compose exec frontend npm run build
```

## Troubleshooting

### Port Conflicts

If you see `port is already allocated` errors, another process is using ports 3000, 8000, or 6379:

```bash
# Find what's using the port
sudo lsof -i :3000
sudo lsof -i :8000
sudo lsof -i :6379

# Stop the conflicting process or change the host port in docker-compose.yml
# Example: map frontend to port 3001 instead
#   ports:
#     - "3001:3000"
```

### Missing .env Configuration

If the backend crashes on startup with connection errors, your `.env` is missing required variables:

```bash
# Check which variables are missing
docker compose logs backend | grep -i error

# Ensure these are set:
# SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY
# DATABASE_URL, JWT_SECRET
# NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_API_URL
```

### Redis Startup Race Condition

The backend may attempt to connect to Redis before it's ready, especially on first start:

```bash
# Restart the backend after Redis is up
docker compose restart backend

# Or wait a few seconds and check again
sleep 3 && docker compose ps

# If it persists, rebuild without cache
docker compose build --no-cache backend
docker compose up -d
```

### Frontend Module Not Found

If the frontend shows `module not found` errors, `node_modules` may be stale:

```bash
docker compose exec frontend npm install
```

### Playwright Browser Issues

If PDF generation fails with browser errors:

```bash
# Install Playwright browsers inside the backend container
docker compose exec backend playwright install chromium
```

| Problem | Likely Cause | Solution |
|---------|-------------|----------|
| Port already in use | Another process on 3000/8000/6379 | Stop the conflicting service or change port mapping |
| Backend crashes on startup | Missing .env or incomplete config | Check .env has all required variables |
| Frontend shows module not found | node_modules not installed | `docker compose exec frontend npm install` |
| Playwright unavailable | Service not started | `docker compose up -d playwright` |
| Redis connection refused | Backend started before Redis ready | `docker compose restart backend` |
