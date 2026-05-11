# Implementation Plan: Docker Compose Setup

**Branch**: `006-docker-compose-setup` | **Date**: 2026-05-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/006-docker-compose-setup/spec.md`

## Summary

Create a `docker-compose.yml` file at the project root that orchestrates four services — backend (FastAPI), frontend (Next.js), Redis, and Playwright — enabling developers to start the entire CraftCV stack with a single command. Each service is configured with environment variables, volume mounts for hot-reload, dependency ordering, and proper networking.

## Technical Context

**Language/Version**: Docker Compose v2 (compose specification), Docker Engine 24+  
**Primary Dependencies**: Docker, Docker Compose v2 plugin  
**Storage**: Named volumes for `node_modules` to avoid host/container conflicts  
**Testing**: Manual verification via `docker compose ps` and health check endpoints  
**Target Platform**: Linux x86_64 (primary), macOS/Windows via Docker Desktop  
**Project Type**: Infrastructure/container orchestration (docker-compose.yml)  
**Performance Goals**: Full stack healthy within 60s of `docker compose up -d`  
**Constraints**: Ports 3000, 8000, 6379 must be available on host; .env file must exist at project root  
**Scale/Scope**: Single-machine local development only; no production orchestration (k8s/Docker Swarm) in scope

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Architecture & Strict Layering | ✅ PASS | Docker Compose is infrastructure orchestration, not application code. No layering violation. |
| II. Tech Stack & Code Conventions | ✅ PASS | Compose file does not introduce new tech stack items. Orchestrates existing stack (FastAPI, Next.js). |
| III. Design Patterns | ✅ PASS | Not applicable to infrastructure configuration. No pattern violations. |
| IV. AI Agent & Content Quality | ✅ PASS | Docker Compose does not interact with the AI agent. No violations. |
| V. Testing & Quality Gates | ✅ PASS | Compose file is tested by verifying services start and respond. Test infrastructure is separate. |

**No violations found.** Complexity tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/006-docker-compose-setup/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
.                           # docker-compose.yml at project root
├── backend/
│   ├── Dockerfile
│   └── .env.example
├── frontend/
│   ├── Dockerfile
│   └── .env.local.example
├── docker-compose.yml      # THIS FEATURE - new file
└── .env                    # shared environment (gitignored)
```

**Structure Decision**: Single `docker-compose.yml` at the monorepo root orchestrates all 4 services using Dockerfiles located in each sub-project directory. No separate infrastructure directory needed for v1.

## Complexity Tracking

> Not required — all gates pass.

## Phase 0: Research

### Unknowns Resolution

This feature has no unresolved unknowns. The PLAN.md Section 6 defines the exact docker-compose configuration. Research focuses on best-practice validation:

| Topic | Research Question | Source |
|-------|------------------|--------|
| Volume mounting for Node.js | Best practice for node_modules in dev containers | Docker docs |
| Playwright service pattern | How to run Playwright as a sidecar service | Playwright docs |
| Service health checks | Should we add healthcheck directives? | Docker Compose spec |
| .env file sharing | Single .env vs per-service .env files | Docker Compose docs |

## Phase 1: Design & Contracts

### Artifacts to Generate

- `data-model.md` — Service definitions, environment schema, volume/network topology
- `contracts/` — `docker-compose.yml` manifest (the file itself), environment variable schema
- `quickstart.md` — Commands to start, stop, and verify the stack
- Agent context update — Add plan reference to AGENTS.md
