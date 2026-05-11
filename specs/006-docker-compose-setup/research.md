# Research: Docker Compose Setup

**Date**: 2026-05-11 | **Feature**: [spec.md](./spec.md)

## Research Topics

### 1. Node.js Volume Mounting in Dev Containers

**Decision**: Use a named volume for `node_modules` to prevent host directory from overwriting container-installed modules.

**Rationale**: When mounting the host frontend directory into the container, the host's `node_modules` (if empty or mismatched) would shadow the container's installed modules. A named volume (`/app/node_modules`) is mounted at a higher priority, ensuring the container's `node_modules` is preserved.

**Alternatives considered**:
- Bind mount without exclusion: Breaks if host lacks `node_modules` or has different version
- Docker multi-stage build: Adds complexity, unsuitable for dev hot-reload

### 2. Playwright as a Sidecar Service

**Decision**: Run Playwright as a standalone service using `mcr.microsoft.com/playwright:v1.49.0` with `sleep infinity` as entrypoint, triggered on-demand by the backend.

**Rationale**: Playwright requires a full Chromium browser and system dependencies. Running it as a separate service isolates browser dependencies from the Python backend image, avoids bloating the backend image, and allows independent scaling. The `sleep infinity` pattern keeps the container alive so the backend can trigger browser operations via HTTP or shared volume.

**Alternatives considered**:
- Embed Playwright in backend image: Increases image size significantly (~1GB)
- Install Chromium at runtime: Slow startup, unreliable

### 3. Docker Service Health Checks

**Decision**: Do NOT add `healthcheck` directives to services in v1. Rely on `depends_on` with service readiness.

**Rationale**: Docker Compose's `depends_on` only waits for container start, not service readiness. However, adding proper health checks for FastAPI (HTTP health endpoint), Next.js (TCP check), and Redis (redis-cli ping) adds complexity with marginal benefit for local development. The services start fast enough (<30s) that developers can visually verify readiness. Health checks can be added in a later iteration if needed.

**Alternatives considered**:
- Add HTTP healthcheck for backend: `curl --fail http://localhost:8000/health`
- Add redis healthcheck: `redis-cli ping`
- Use `depends_on.condition: service_healthy` pattern

### 4. Environment File Strategy

**Decision**: Use a single `.env` file at the project root shared across all services.

**Rationale**: Simpler than per-service `.env` files for local development. Each service reads only the variables it needs from the shared file. Docker Compose automatically loads `.env` from the project root when placed next to `docker-compose.yml`. Backend-specific env vars are prefixed to avoid collision.

**Alternatives considered**:
- Per-service `.env` files (`.env.backend`, `.env.frontend`): More explicit but adds configuration overhead
- Compose `env_file` directive pointing to service-specific files: Cleaner isolation but more files to maintain

## Best Practices Applied

- Named volumes for `node_modules` to avoid host/container conflicts
- `depends_on` for service startup ordering
- Port mapping to avoid conflicts (host ports explicitly mapped)
- Volume mounts for hot-reload in both backend (`./backend:/app`) and frontend (`./frontend:/app`)
- `.env` file pattern for separating configuration from code
- Official base images (Redis 7 Alpine, Playwright official)
