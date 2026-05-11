# Tasks: Docker Compose Setup

**Input**: Design documents from `specs/006-docker-compose-setup/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks included — tests not requested in spec.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo root**: `./` for docker-compose.yml, `.env.example`, `.dockerignore`
- **Backend**: `backend/` for Dockerfile, backend .dockerignore
- **Frontend**: `frontend/` for Dockerfile, frontend .dockerignore
- Paths shown below assume the repository root prefix

---

## Phase 1: Setup (Infrastructure)

**Purpose**: Create Docker Compose orchestration at the project root

- [ ] T001 Create `docker-compose.yml` at project root with backend service definition (FastAPI, port 8000, hot-reload via --reload, shared .env, depends_on redis, bind mount ./backend:/app)
- [ ] T002 [P] Add frontend service to `docker-compose.yml` (Next.js, port 3000, shared .env, node_modules named volume, bind mount ./frontend:/app, depends_on redis, npm run dev)
- [ ] T003 [P] Add redis service to `docker-compose.yml` (redis:7-alpine, port 6379:6379)
- [ ] T004 [P] Add playwright service to `docker-compose.yml` (mcr.microsoft.com/playwright:v1.49.0, sleep infinity entrypoint)
- [ ] T005 [P] Verify backend Dockerfile exists at `backend/Dockerfile` with Python 3.12, uvicorn, and all pyproject.toml dependencies installed
- [ ] T006 [P] Verify frontend Dockerfile exists at `frontend/Dockerfile` with Node.js 20, Next.js, and all package.json dependencies installed
- [ ] T007 [P] Create `backend/.dockerignore` excluding `__pycache__/`, `.venv/`, `*.pyc`, `.env`, `.git`
- [ ] T008 [P] Create `frontend/.dockerignore` excluding `node_modules/`, `.next/`, `.env.local`, `.git`
- [ ] T009 [P] Create `.dockerignore` at project root excluding common build artifacts
- [ ] T010 Verify `.env.example` at project root documents all required env vars (SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_KEY, DATABASE_URL, JWT_SECRET, API keys, NEXT_PUBLIC_*)
- [ ] T011 Validate full stack: `docker compose up -d` and confirm all 4 services show "running" via `docker compose ps`, backend health endpoint responds 200, frontend loads at localhost:3000, Redis responds to PING

---

## Phase 2: Polish & Edge Cases

**Purpose**: Handle edge cases, add docker-compose refinements

- [ ] T012 Add port conflict documentation to `quickstart.md` with resolution steps for ports 3000/8000/6379
- [ ] T013 Add missing .env configuration error handling guidance to `quickstart.md`
- [ ] T014 Add Redis startup race condition recovery instructions to `quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — all service definitions and Dockerfiles can be created in any order
- **Polish (Phase 2)**: Depends on Phase 1 completion — edge case handling and documentation require working stack

### Parallel Opportunities

- T001 (docker-compose.yml creation) is the core task; all other Phase 1 tasks marked [P] can run in parallel with T001 or each other
- T005 (backend Dockerfile) and T006 (frontend Dockerfile) verify existing files — can run in parallel
- T007, T008, T009 (.dockerignore files) can all run in parallel
- T010 (.env.example verification) runs after T001 or independently

### Within Each Phase

- Core orchestration (T001) before service-specific refinement
- Dockerfile verification before .dockerignore creation
- All infrastructure in place before validation task (T011)

---

## Implementation Strategy

### MVP First

1. Complete T001, T005, T006 (core docker-compose.yml + Dockerfile verification)
2. Verify: `docker compose up -d` brings up backend and redis
3. Add T002, T003, T004 (remaining services)
4. Verify: all 4 services running
5. Polish: T007-T014

### Incremental Delivery

1. Backend + Redis services → backend API accessible → add frontend → add Playwright → Polish

---

## Notes

- [P] tasks = different files, no dependencies
- This feature has 1 user story (US1) — the entire docker-compose orchestration is a single coherent deliverable
- Dockerfiles at `backend/Dockerfile` and `frontend/Dockerfile` should already exist from previous features — verify they are correct
- The `.env` file is gitignored — `.env.example` serves as the reference for required variables
