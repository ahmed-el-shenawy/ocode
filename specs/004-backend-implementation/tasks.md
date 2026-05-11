# Tasks: Backend Implementation

**Input**: Design documents from `specs/004-backend-implementation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Service-layer unit tests and API integration tests included per constitution requirements.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `craftcv/backend/app/`
- All paths are relative to the repository root

---

## Phase 1: Setup

**Purpose**: Dependencies and project configuration

- [X] T001 Add `jsonschema`, `structlog` dependencies to `craftcv/backend/pyproject.toml` (verify existing deps include fastapi, uvicorn, sqlalchemy, asyncpg, alembic, pydantic, supabase, litellm, playwright, jinja2, python-multipart, httpx, duckduckgo-search, celery, redis, python-dotenv)
- [X] T002 [P] Create `craftcv/backend/.env.example` with all required env vars (supabase_url, supabase_service_key, supabase_anon_key, database_url, jwt_secret, openai_api_key, anthropic_api_key, gemini_api_key, redis_url, storage_bucket, ollama_api_base)
- [X] T003 [P] Configure `craftcv/backend/alembic.ini` and `craftcv/backend/alembic/env.py` to point to `app.core.database.Base` for auto-detection and `app.core.config.settings.database_url` as the target database

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T04 Complete `Settings` class in `craftcv/backend/app/core/config.py` — add `app_name`, `debug`, `ollama_api_base`, `app_name: str = "CraftCV"`, `debug: bool = False`, and ensure all env vars use proper typing (str | None for optional keys)
- [X] T005 Complete `craftcv/backend/app/core/database.py` — implement async engine from `settings.database_url`, `async_session_factory`, `Base`, and `get_db` async generator with commit/rollback/close lifecycle
- [X] T006 Complete `craftcv/backend/app/core/supabase.py` — implement `get_supabase` dependency that creates a `supabase.Client` using `settings.supabase_url` and `settings.supabase_service_key`
- [X] T007 Complete `craftcv/backend/app/core/dependencies.py` — implement `get_current_user` dependency that extracts and verifies the JWT from `Authorization` header using Supabase client, returns user UUID
- [X] T008 [P] Create `craftcv/backend/app/core/security.py` — implement rate-limiting middleware (in-memory, 5 req/min per IP for auth routes only) using FastAPI middleware pattern with IP tracking dict
- [X] T009 [P] Create `craftcv/backend/app/core/logging.py` — configure structured JSON logging with correlation ID; add middleware in `main.py` to log method, path, status, duration on every request
- [X] T010 Wire up all middleware and router includes in `craftcv/backend/app/main.py` — add rate-limiting and logging middleware before router includes; ensure lifespan handler initializes Playwright browser and Supabase client

**Checkpoint**: Foundation ready — config, database, auth deps, rate limiting, and logging all operational

---

## Phase 3: User Story 1 - User registers and authenticates (Priority: P1) 🎯 MVP

**Goal**: Users can sign up, sign in, and sign out via the API

**Independent Test**: Register a new user via POST /signup, sign in with the same credentials, and receive an access token. Verify protected routes reject unauthenticated requests.

### Implementation for User Story 1

- [X] T011 [P] [US1] Complete `Profile` model in `craftcv/backend/app/models/user.py` — fields: id (UUID PK FK to auth.users), full_name, avatar_url, created_at, updated_at
- [X] T012 [P] [US1] Create `craftcv/backend/app/schemas/auth.py` — Pydantic models: `SignUpRequest` (email, password), `SignInRequest` (email, password), `AuthResponse` (user_id, email, access_token optional)
- [X] T013 [P] [US1] Create `craftcv/backend/app/repositories/user_repo.py` — `UserRepository(BaseRepository[Profile])` with `get_by_id`, `create` methods
- [X] T014 [US1] Implement `AuthService` in `craftcv/backend/app/services/auth_service.py` — `signup(email, password)` calls Supabase auth.sign_up and creates Profile record; `signin(email, password)` calls Supabase auth.sign_in_with_password and returns token; `signout()` calls Supabase auth.sign_out
- [X] T015 [US1] Implement auth routes in `craftcv/backend/app/api/v1/auth.py` — POST `/signup` (201), POST `/signin` (200 with token), POST `/logout` (200) — wire through AuthService via Depends
- [X] T016 [P] [US1] Create `craftcv/backend/tests/test_auth.py` — integration tests: signup success, signin success, signin wrong password returns 401, signout invalidates session, protected route without token returns 401, rate limit after 5 attempts returns 429

**Checkpoint**: At this point, User Story 1 should be fully functional — auth flow works end-to-end

---

## Phase 4: User Story 2 - User creates and manages resumes (Priority: P1)

**Goal**: Authenticated users can create, read, update, and delete their resumes

**Independent Test**: Create a resume from a template, verify it appears in the list, update its content, and delete it. Verify another user cannot access the resume.

### Implementation for User Story 2

- [X] T017 [P] [US2] Complete `Resume` model in `craftcv/backend/app/models/resume.py` — fields: id (UUID PK), user_id (FK profiles), template_id (FK templates, nullable), title, content (JSONB), styles (JSONB), status, created_at, updated_at. Add `updated_at` for optimistic locking.
- [X] T018 [P] [US2] Create `craftcv/backend/app/schemas/resume.py` — Pydantic models: `ResumeCreate` (template_id, title), `ResumeUpdate` (title, content, styles, status all optional), `ResumeResponse`
- [X] T019 [P] [US2] Create `craftcv/backend/app/repositories/resume_repo.py` — `ResumeRepository(BaseRepository[Resume])` with `get_by_user_id(user_id)`, `get_by_id_and_user(resume_id, user_id)`
- [X] T020 [US2] Implement `ResumeService` in `craftcv/backend/app/services/resume_service.py` — `create_from_template(user_id, template_id, title)` builds empty sections from template definition; `update_content(resume_id, content)` with `updated_at` optimistic locking check (409 if stale); `get_user_resumes(user_id)`; `delete(resume_id, user_id)` with ownership check
- [X] T021 [US2] Implement resume routes in `craftcv/backend/app/api/v1/resumes.py` — GET `/` (list), POST `/` (create), GET `/{resume_id}`, PATCH `/{resume_id}` (with updated_at check), DELETE `/{resume_id}` — all require auth, all filter by ownership
- [X] T022 [P] [US2] Create `craftcv/backend/tests/test_resumes.py` — integration tests: create resume, list resumes, get by id, update content, update with stale updated_at returns 409, delete resume, access another user's resume returns 403

**Checkpoint**: At this point, Users Stories 1 + 2 work — resume CRUD with data isolation

---

## Phase 5: User Story 3 - User manages templates (Priority: P2)

**Goal**: Users can browse public templates, view their custom templates, and clone templates

**Independent Test**: List public templates, clone one to create a custom template, verify it appears in the user's template list

### Implementation for User Story 3

- [X] T023 [P] [US3] Complete `Template` model in `craftcv/backend/app/models/template.py` — fields: id (UUID PK), user_id (FK profiles, nullable), name, description, thumbnail_url, is_public, definition (JSONB), default_styles (JSONB), created_at, updated_at
- [X] T024 [P] [US3] Create `craftcv/backend/app/schemas/template.py` — Pydantic models: `TemplateCreate` (name, description, definition, default_styles, is_public), `TemplateResponse`, `TemplateDefinition`
- [X] T025 [P] [US3] Create `craftcv/backend/app/repositories/template_repo.py` — `TemplateRepository(BaseRepository[Template])` with `get_public_templates()`, `get_user_templates(user_id)`, `get_available_for_user(user_id)` (public OR owned)
- [X] T026 [US3] Implement `TemplateService` in `craftcv/backend/app/services/template_service.py` — `get_public_templates()`, `get_user_templates(user_id)`, `get_available_for_user(user_id)`, `create_from_template(user_id, template_id)` clones a template as user's own
- [X] T027 [US3] Implement template routes in `craftcv/backend/app/api/v1/templates.py` — GET `/public` (no auth), GET `/` (auth, user's templates), GET `/{template_id}` (public or owned), POST `/` (create custom)
- [X] T028 [P] [US3] Create `craftcv/backend/tests/test_templates.py` — integration tests: list public templates, create custom template, clone public template, access control

**Checkpoint**: Templates, auth, and resume CRUD all operational

---

## Phase 6: User Story 4 - User builds resume through AI chat (Priority: P2)

**Goal**: Users can start an AI-powered chat conversation for a resume and send messages

**Independent Test**: Start a conversation for a resume, send a message, and receive an AI response

### Implementation for User Story 4

- [X] T029 [P] [US4] Complete `Conversation` and `Message` models in `craftcv/backend/app/models/conversation.py` — Conversation: id, resume_id (FK), user_id (FK), progress (JSONB), mode (guided/free), timestamps. Message: id, conversation_id (FK), role (user/assistant/system), content, metadata (JSONB), created_at
- [X] T030 [P] [US4] Create `craftcv/backend/app/schemas/chat.py` — Pydantic models: `SendMessageRequest` (content), `SendMessageResponse` (content, role), `SwitchModeRequest` (mode)
- [X] T031 [P] [US4] Create `craftcv/backend/app/repositories/conversation_repo.py` — `ConversationRepository(BaseRepository[Conversation])` with `get_by_resume_and_user(resume_id, user_id)`, `get_messages(conversation_id, limit)`, `add_message(message)`
- [X] T032 [US4] Implement `LiteLLM Router` in `craftcv/backend/app/agents/router.py` — configure Router with gpt-4o (primary), claude-sonnet (secondary), gemini-pro (tertiary), Ollama (local fallback); implement `generate(messages, model, temperature)` with retry and fallback logic
- [X] T033 [US4] Implement `CvAgent` in `craftcv/backend/app/agents/cv_agent.py` — `process(resume, conversation, messages, user_input)` method that builds context, detects intent (guided_answer/free_form/tool_request), routes to appropriate handler, returns response + progress update
- [X] T034 [P] [US4] Create agent tools: `web_search` (DuckDuckGo) in `craftcv/backend/app/agents/tools/web_search.py`, `humanize_text` and `suggest_improvements` (via LiteLLM) in `content_tools.py`, `get_section_info` and `update_section` in `resume_tools.py`
- [X] T035 [US4] Implement `ChatService` in `craftcv/backend/app/services/chat_service.py` — `get_or_create_conversation(resume_id, user_id)`, `send_message(conversation_id, content)` that saves user msg, calls agent, saves assistant msg, updates progress; `switch_mode(conversation_id, mode)`
- [X] T036 [US4] Implement chat routes in `craftcv/backend/app/api/v1/chat.py` — POST `/conversation/{resume_id}`, POST `/message/{conversation_id}`, POST `/switch-mode/{conversation_id}` — all require auth
- [X] T037 [P] [US4] Create `craftcv/backend/tests/test_chat.py` — integration tests: start conversation, send message, receive AI response, switch mode, conversation persists across messages

**Checkpoint**: AI chat flow fully operational — users can build resumes through conversation

---

## Phase 7: User Story 5 - User downloads resume as PDF (Priority: P3)

**Goal**: Users can download a completed resume as a PDF file

**Independent Test**: Request a PDF download for a completed resume and verify a PDF is returned

### Implementation for User Story 5

- [X] T038 [P] [US5] Implement `PdfService` in `craftcv/backend/app/services/pdf_service.py` — render resume content + styles to HTML with Jinja2 template, launch Playwright headless Chromium, generate PDF, stream response
- [X] T039 [US5] Implement PDF route in `craftcv/backend/app/api/v1/pdf.py` — GET `/resumes/{resume_id}/pdf` (auth required), returns application/pdf on success, 500 on generation failure
- [X] T040 [P] [US5] Create `craftcv/backend/tests/test_pdf.py` — integration tests: request PDF for existing resume returns 200 with PDF content type; request PDF for non-existent resume returns 404

**Checkpoint**: PDF download works end-to-end

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Observability, metrics, error tracking, and verification

- [X] T041 [P] Add error tracking middleware in `craftcv/backend/app/main.py` — capture all 4xx and 5xx errors with correlation ID, log structured error details including request path and user ID
- [X] T042 [P] Add Prometheus-style metrics endpoint at `GET /metrics` in `craftcv/backend/app/main.py` — expose latency, error rate, and throughput counters per endpoint
- [X] T043 Add Celery config and task queue setup in `craftcv/backend/app/core/celery_app.py` — configure Redis broker for async PDF generation fallback if needed
- [X] T044 Run quickstart.md validation scenarios to verify all 5 user stories pass acceptance criteria

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 Auth (Phase 3)**: Depends on Phase 2 — no other story dependencies
- **US2 Resumes (Phase 4)**: Depends on Phase 2 — needs templates (Phase 5) for create-from-template
- **US3 Templates (Phase 5)**: Depends on Phase 2 — no other story dependencies (can run in parallel with US1)
- **US4 Chat (Phase 6)**: Depends on US2 (resumes) and Phase 2
- **US5 PDF (Phase 7)**: Depends on US2 (resumes) and Phase 2 — independent of US3, US4
- **Polish (Phase 8)**: Depends on all user stories

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational
- **User Story 2 (P1)**: Depends on US3 templates (needs template to create resume from)
- **User Story 3 (P2)**: Can start after Foundational (independent of US1)
- **User Story 4 (P2)**: Depends on US2 (needs resume for conversation)
- **User Story 5 (P3)**: Depends on US2 (needs resume for PDF) — independent of US3, US4

### Within Each User Story

- Models before repositories
- Repositories before services
- Services before API routes
- Integration tests after routes

### Parallel Opportunities

| Tasks | Reason |
|-------|--------|
| T002, T003 | Different config files |
| T008, T009 | Different files (security.py vs logging.py) |
| T011, T012, T013 | Model, schemas, repo — no cross-deps |
| T017, T018, T019 | Same pattern as above |
| T023, T024, T025 | Same pattern as above |
| T029, T030, T031 | Same pattern as above |
| T034 with T032, T033 | Agent tools independent of router/agent class |
| T038 with T037 | PDF service independent of chat tests |
| T041, T042 | Different concerns (error tracking vs metrics) |

---

## Parallel Example: User Story 1

```bash
# Launch model, schemas, and repo together:
Task: "T011 Complete Profile model in models/user.py"
Task: "T012 Create auth schemas"
Task: "T013 Create user repository"
```

## Parallel Example: User Story 2

```bash
# Launch model, schemas, and repo together:
Task: "T017 Complete Resume model"
Task: "T018 Create resume schemas"
Task: "T019 Create resume repository"
```

## Parallel Example: User Story 4

```bash
# Launch models, schemas, and repo together:
Task: "T029 Complete Conversation/Message models"
Task: "T030 Create chat schemas"
Task: "T031 Create conversation repository"
# Launch agent tools after models:
Task: "T034 Create agent tools (web_search, content_tools, resume_tools)"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 — Auth
4. **STOP and VALIDATE**: Register, sign in, access protected route
5. Deploy/demo if ready — auth works

### Incremental Delivery

1. Setup + Foundational → Server boots with middleware
2. Add US1 Auth → User registration + sign in → **MVP!**
3. Add US3 Templates → Browse and create templates
4. Add US2 Resumes → Create and manage resumes
5. Add US4 Chat → AI-powered resume building
6. Add US5 PDF → Download completed resume
7. Each story adds value without breaking previous stories

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
