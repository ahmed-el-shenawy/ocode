# Data Model: Docker Compose Setup

**Date**: 2026-05-11 | **Feature**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Service Definitions

### Backend Service

| Property | Value |
|----------|-------|
| Name | `backend` |
| Build context | `./backend` |
| Port | `8000:8000` |
| Env file | `.env` (project root) |
| Volume | `./backend:/app` (bind mount for hot-reload) |
| Depends on | `redis` |
| Command | `uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload` |

### Frontend Service

| Property | Value |
|----------|-------|
| Name | `frontend` |
| Build context | `./frontend` |
| Port | `3000:3000` |
| Env file | `.env` (project root) |
| Volumes | `./frontend:/app` (bind mount), `node_modules:/app/node_modules` (named volume) |
| Depends on | `redis` |
| Command | `npm run dev` |

### Redis Service

| Property | Value |
|----------|-------|
| Name | `redis` |
| Image | `redis:7-alpine` |
| Port | `6379:6379` |
| Env file | None needed |

### Playwright Service

| Property | Value |
|----------|-------|
| Name | `playwright` |
| Image | `mcr.microsoft.com/playwright:v1.49.0` |
| Port | None exposed |
| Entrypoint | `["sleep", "infinity"]` |

## Volume Definitions

| Volume Name | Purpose |
|-------------|---------|
| `node_modules` | Named volume to prevent host `node_modules` from shadowing container-installed dependencies |

## Network Topology

- All services share the default bridge network created by Docker Compose
- Services communicate via container hostnames (service name)
- No external network configuration needed for v1

## Environment Variables (shared `.env`)

| Variable | Used By | Required | Description |
|----------|---------|----------|-------------|
| `APP_NAME` | backend | Yes | Application name |
| `DEBUG` | backend | No | Debug mode flag |
| `SUPABASE_URL` | backend | Yes | Supabase project URL |
| `SUPABASE_SERVICE_KEY` | backend | Yes | Supabase service role key |
| `SUPABASE_ANON_KEY` | backend, frontend | Yes | Supabase anonymous key |
| `DATABASE_URL` | backend | Yes | Async PostgreSQL connection string |
| `JWT_SECRET` | backend | Yes | JWT signing secret |
| `JWT_ALGORITHM` | backend | No | JWT algorithm (default: HS256) |
| `OPENAI_API_KEY` | backend | No | OpenAI API key |
| `ANTHROPIC_API_KEY` | backend | No | Anthropic API key |
| `GEMINI_API_KEY` | backend | No | Google Gemini API key |
| `REDIS_URL` | backend | No | Redis connection string (default: redis://redis:6379/0) |
| `STORAGE_BUCKET` | backend | No | Supabase Storage bucket name |
| `PDF_STORAGE_PATH` | backend | No | Path for PDF storage |
| `NEXT_PUBLIC_SUPABASE_URL` | frontend | Yes | Supabase URL (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | frontend | Yes | Supabase anon key (public) |
| `NEXT_PUBLIC_API_URL` | frontend | Yes | Backend API URL (http://localhost:8000/api/v1) |
