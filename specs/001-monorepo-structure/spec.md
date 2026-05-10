# Feature Specification: Phase 1 - Monorepo Directory Structure

**Feature Branch**: `001-monorepo-structure`  
**Created**: 2026-05-10  
**Status**: Draft  
**Input**: User description: "read PLAN.md and create a specification for only phase 1 monorepo directory structure"

## Clarifications

### Session 2026-05-10

- Q: Should the monorepo include a root-level task runner file with common dev commands? → A: Yes, include a Makefile with common dev commands (install, dev, test, build, clean)
- Q: Should the initial scaffold include test directories in both sub-projects? → A: Yes, create `backend/tests/` and `frontend/src/__tests__/` with placeholder files
- Q: Should the initial scaffold include linter and formatter configuration files? → A: Yes, include ruff config for backend, prettier and eslint config for frontend

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Sets Up Project Scaffold (Priority: P1)

A developer clones the CraftCV repository and finds the complete monorepo directory structure already in place, with both `backend/` and `frontend/` sub-projects properly scaffolded with their respective configuration files and directory conventions.

**Why this priority**: This is the foundation — no work can begin without the project structure in place. All subsequent phases depend on it.

**Independent Test**: Can be fully tested by cloning the repo and verifying the complete directory tree matches the defined structure. Delivers the project skeleton ready for development.

**Acceptance Scenarios**:

1. **Given** a fresh clone of the repository, **When** a developer lists the root directory, **Then** they see `backend/`, `frontend/`, `docker-compose.yml`, `.gitignore`, `.env.example`, and `PLAN.md`
2. **Given** the monorepo is set up, **When** a developer navigates to `backend/`, **Then** they find `pyproject.toml`, `Dockerfile`, `alembic.ini`, `.env.example`, and an `app/` package directory
3. **Given** the monorepo is set up, **When** a developer navigates to `frontend/`, **Then** they find `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `Dockerfile`, `.env.local.example`, a `src/` directory and a `public/` directory

---

### User Story 2 - Developer Initializes Backend Project (Priority: P2)

A developer can set up and run the backend FastAPI project with its configuration, database setup, and dependency management.

**Why this priority**: The backend contains the core business logic, database models, APIs, and AI agent integration. A working backend scaffold enables parallel frontend development.

**Independent Test**: Can be fully tested by installing Python dependencies and starting the FastAPI dev server. Delivers a runnable backend with health check endpoint.

**Acceptance Scenarios**:

1. **Given** the backend directory exists, **When** a developer runs `pip install -e ".[dev]"`, **Then** all dependencies specified in `pyproject.toml` install successfully
2. **Given** the backend is installed, **When** a developer runs the FastAPI server, **Then** the application starts on the configured port and responds to requests
3. **Given** the backend app structure, **When** a developer inspects the `app/` package, **Then** they find subdirectories: `core/`, `models/`, `schemas/`, `repositories/`, `services/`, `api/v1/`, and `agents/` (with `tools/` and `prompts/`)

---

### User Story 3 - Developer Initializes Frontend Project (Priority: P3)

A developer can set up and run the frontend Next.js project with its configuration, UI components, and type definitions.

**Why this priority**: The frontend provides the user interface. A working frontend scaffold allows UI development to proceed independently once the backend APIs are ready.

**Independent Test**: Can be fully tested by installing npm dependencies and starting the Next.js dev server. Delivers a renderable frontend with routing structure.

**Acceptance Scenarios**:

1. **Given** the frontend directory exists, **When** a developer runs `npm install`, **Then** all dependencies specified in `package.json` install successfully
2. **Given** the frontend is installed, **When** a developer runs `npm run dev`, **Then** the Next.js development server starts and the application is accessible in a browser
3. **Given** the frontend src structure, **When** a developer inspects the `src/` directory, **Then** they find: `app/` (with route groups for auth, dashboard, studio, chat, resume), `components/` (with ui/, layout/, studio/, chat/, templates/, resume/), `lib/`, `hooks/`, `stores/`, and `types/`

---

### Edge Cases

- What happens when a developer clones the repo on a system without Python 3.12+ or Node.js?
- How does the project handle platform-specific differences in the Docker setup?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The monorepo MUST contain a `backend/` directory with a Python package at `app/` containing subdirectories: `core/`, `models/`, `schemas/`, `repositories/`, `services/`, `api/v1/`, and `agents/` (including `tools/` and `prompts/` subdirectories). A `tests/` directory with a `__init__.py` placeholder MUST exist at `backend/tests/`
- **FR-002**: The `backend/` directory MUST include `pyproject.toml` with Python 3.12+ and dependencies for FastAPI, SQLAlchemy, Supabase, LiteLLM, Playwright, Celery, and Redis (with dev dependencies including pytest and ruff). A `ruff.toml` configuration file MUST be present for Python linting
- **FR-003**: The `backend/` directory MUST include Alembic configuration (`alembic.ini` and `alembic/` directory with `env.py` and `versions/`)
- **FR-004**: The `backend/` directory MUST include a `Dockerfile` and `.env.example` for local development setup
- **FR-005**: The monorepo MUST contain a `frontend/` directory with a Next.js 15 project using the App Router and TypeScript. A `src/__tests__/` directory with a `.gitkeep` placeholder MUST exist for test files
- **FR-006**: The `frontend/src/app/` directory MUST include route groups: `(auth)` with login, signup, and reset-password pages; `(dashboard)` with templates, settings, and a layout; `studio/[resumeId]`; `chat/[resumeId]`; and `resume/[resumeId]/preview`
- **FR-007**: The `frontend/src/components/` directory MUST include subdirectories: `ui/` (for shadcn components), `layout/`, `studio/` (with `widgets/`), `chat/`, `templates/`, and `resume/`
- **FR-008**: The `frontend/` directory MUST include `lib/`, `hooks/`, `stores/`, and `types/` directories under `src/` for shared utilities
- **FR-009**: The `frontend/` directory MUST include configuration files: `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `package.json`, `components.json`, `.eslintrc.json`, `.prettierrc`, `Dockerfile`, and `.env.local.example`
- **FR-010**: The repository root MUST include `docker-compose.yml` for orchestrating backend and frontend services, `Makefile` with common development commands (install, dev, test, build, clean), `.gitignore`, and `.env.example`

### Key Entities

This phase does not define data entities — it establishes the project skeleton. Data models (Profile, Template, Resume, Conversation, Message) are defined in Phase 2 (Database Schema).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A developer can clone the repository and verify the full directory tree matches the PLAN.md section 1 structure within 5 minutes
- **SC-002**: Backend Python package installs successfully with `pip install -e ".[dev]"` without errors
- **SC-003**: Frontend npm dependencies install successfully with `npm install` without errors
- **SC-004**: Backend FastAPI server starts and responds to health check requests
- **SC-005**: Frontend Next.js dev server starts and renders the application homepage
- **SC-006**: `docker-compose up` builds and starts both backend and frontend services without configuration errors

## Assumptions

- Developers have Python 3.12+, Node.js 18+, and npm installed locally
- Docker and Docker Compose are available for containerized development
- The project uses SQLite for local development (with PostgreSQL via Supabase in production)
- All directory and file names follow the conventions defined in PLAN.md Section 1
- shadcn/ui components will be added later as needed — only the `ui/` directory placeholder is created now
- No business logic or data models are implemented in this phase — only project scaffolding
