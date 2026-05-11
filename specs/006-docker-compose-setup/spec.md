# Feature Specification: Docker Compose Setup

**Feature Branch**: `006-docker-compose-setup`  
**Created**: 2026-05-11  
**Status**: Draft  
**Input**: User description: "section 6 from ocode/PLAN.md"

## User Scenarios & Testing

### User Story 1 - Developer starts the full application stack locally (Priority: P1)

A developer wants to run the entire CraftCV application locally for development or testing. They start all services with a single command and each service is properly configured with environment variables, dependencies, and volume mounts.

**Why this priority**: Without a working local development environment, no other features can be built or tested. This is the foundational developer experience.

**Independent Test**: Can be fully tested by running a single command and verifying all four services (backend, frontend, Redis, Playwright) are running and accessible.

**Acceptance Scenarios**:

1. **Given** a developer on the project, **When** they run `docker compose up -d`, **Then** all four services start without errors
2. **Given** all services are running, **When** the developer accesses `http://localhost:8000/health`, **Then** the backend returns a 200 OK response
3. **Given** all services are running, **When** the developer accesses `http://localhost:3000`, **Then** the frontend application loads
4. **Given** all services are running, **When** the developer checks Redis connectivity, **Then** Redis is accessible on port 6379
5. **Given** the Playwright service is running, **When** the backend triggers PDF generation, **Then** Playwright is available to render HTML to PDF

### Edge Cases

- What happens when a required port (3000, 8000, 6379) is already in use on the host?
- How does the system handle the frontend `node_modules` volume mounting (avoiding overwriting the container's installed modules)?
- What happens if the `.env` file is missing or has incomplete configuration?
- How does the system recover if Redis is unavailable when the backend starts?

## Requirements

### Functional Requirements

- **FR-001**: System MUST start all services (backend, frontend, Redis, Playwright) with a single `docker compose up` command
- **FR-002**: Backend service MUST expose FastAPI application on port 8000
- **FR-003**: Frontend service MUST expose Next.js development server on port 3000
- **FR-004**: Backend MUST be configured with hot-reload so code changes take effect immediately
- **FR-005**: Frontend MUST be configured with hot-reload via Next.js dev server
- **FR-006**: Backend service MUST read environment variables from a `.env` file at the project root
- **FR-007**: Frontend service MUST read environment variables from a shared `.env` file
- **FR-008**: Redis service MUST use the official Redis 7 Alpine image and expose port 6379
- **FR-009**: Playwright service MUST use the official Playwright image with Chromium for PDF generation
- **FR-010**: Frontend container MUST mount `node_modules` as a named volume to prevent host `node_modules` from overwriting container-installed dependencies
- **FR-011**: Backend and frontend services MUST depend on Redis being available before starting
- **FR-012**: System MUST define service dependencies so services start in the correct order

### Key Entities

- **Backend Service**: FastAPI application server handling API requests, AI chat, and PDF generation
- **Frontend Service**: Next.js application server providing the user interface
- **Redis Service**: In-memory data store for caching, Celery task queues, and session management
- **Playwright Service**: Headless browser service for server-side HTML-to-PDF rendering

## Success Criteria

### Measurable Outcomes

- **SC-001**: Developer can start the full stack with a single command and all services are healthy within 60 seconds
- **SC-002**: Backend health endpoint responds in under 2 seconds from container start
- **SC-003**: Frontend application loads and renders in under 5 seconds from container start
- **SC-004**: Code changes to backend or frontend are reflected in under 3 seconds without manual restart
- **SC-005**: PDF generation via Playwright completes successfully when backend is running

## Assumptions

- Docker and Docker Compose v2 are installed on the developer's machine
- The `.env` file at the project root contains all required environment variables (Supabase credentials, API keys, etc.)
- The frontend `node_modules` are installed inside the container (not expected to be present on the host)
- Network mode is the default bridge network provided by Docker Compose
- All services run on the same machine (localhost) for development
- The backend's `reload` flag is enabled for hot-reload (suitable for development, not production)
- Redis authentication is not required for local development
- The Playwright service runs in "sleep infinity" mode, waiting for backend to trigger browser operations
