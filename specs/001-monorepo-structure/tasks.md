# Tasks: CraftCV Monorepo (All Phases)

**Input**: Design documents from `specs/001-monorepo-structure/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md
**Organization**: Tasks grouped by phase and user story for independent implementation and testing

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Root-level project files that establish the monorepo foundation

**No tests required** — these are configuration files verified by existence

- [X] T001 Create root `.gitignore` ignoring `node_modules/`, `.venv/`, `__pycache__/`, `.env`, `.env.local`, `*.pyc`, `.DS_Store`, `.pytest_cache/`, `dist/`, `.next/`
- [X] T002 Create root `.env.example` with placeholder vars: `SUPABASE_URL=`, `SUPABASE_SERVICE_KEY=`, `SUPABASE_ANON_KEY=`, `DATABASE_URL=`, `JWT_SECRET=`, `OPENAI_API_KEY=`, `ANTHROPIC_API_KEY=`, `GEMINI_API_KEY=`, `REDIS_URL=`
- [X] T003 Create `docker-compose.yml` with two services: `backend` (build: `./backend`, ports `8000:8000`, env_file `./backend/.env`) and `frontend` (build: `./frontend`, ports `3000:3000`, depends_on: backend)
- [X] T004 Create root `Makefile` with targets: `install` (pip install + npm install), `dev` (docker-compose up), `test` (placeholder), `build` (placeholder), `clean` (remove __pycache__, .venv, node_modules)

---

## Phase 2: Supabase Setup

**Purpose**: Configure Supabase project with database schema, RLS policies, auth trigger, seed data, and client infrastructure

**No tests required** — verified by applying migrations against a Supabase instance

- [X] T101 [P] Create `backend/supabase/migrations/00001_initial_schema.sql` with DDL for all tables:
  - `profiles` (id UUID PK, full_name text, avatar_url text, created_at timestamptz, updated_at timestamptz)
  - `templates` (id UUID PK, user_id UUID FK, name text, description text, thumbnail_url text, is_public boolean default false, definition jsonb, default_styles jsonb, created_at timestamptz, updated_at timestamptz)
  - `resumes` (id UUID PK, user_id UUID FK NOT NULL, template_id UUID FK, title text, content jsonb, styles jsonb, status text default 'draft', created_at timestamptz, updated_at timestamptz)
  - `conversations` (id UUID PK, resume_id UUID FK NOT NULL, user_id UUID FK NOT NULL, mode text default 'guided', created_at timestamptz, updated_at timestamptz)
  - `messages` (id UUID PK, conversation_id UUID FK NOT NULL, role text NOT NULL, content text NOT NULL, metadata jsonb default '{}', created_at timestamptz)
  - All FKs with ON DELETE CASCADE, indexes on all FK columns and `created_at`
- [X] T102 [P] Create auth trigger function `handle_new_user()` that auto-inserts a profile row when a user signs up via Supabase Auth (inserts id, full_name, avatar_url from `raw_user_meta_data`)
- [X] T103 [P] Enable RLS on all tables and create policies:
  - `profiles`: SELECT/INSERT/UPDATE for own row (`auth.uid() = id`)
  - `templates`: SELECT public + ALL for own; `templates` table: `is_public = true` for all, `auth.uid() = user_id` for own
  - `resumes`: ALL for own (`auth.uid() = user_id`)
  - `conversations`: ALL for own (`auth.uid() = user_id`)
  - `messages`: ALL for messages in own conversations (via subquery on conversations)
- [X] T104 Create `backend/supabase/seed.sql` with sample public templates and optional demo data
- [X] T105 Create `backend/app/core/supabase.py` with:
  - `get_supabase_admin()` — returns Supabase client initialized with `service_role` key
  - `get_supabase_anon()` — returns Supabase client initialized with `anon` key
  - Both functions cache clients as module-level singletons
- [X] T106 Update `backend/app/core/dependencies.py` — refactor `get_supabase` to use the new `supabase.py` module
- [X] T107 Update `backend/.env.example` — ensure all Supabase vars are documented with comments (SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_ANON_KEY, SUPABASE_JWT_SECRET)
- [X] T108 Update `frontend/.env.local.example` — ensure all Supabase public vars are documented (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)
- [X] T109 Update `frontend/src/lib/supabase.ts` — ensure client uses the correct env vars from `.env.local`

**Checkpoint**: Supabase setup complete — migrations can be applied with `supabase db push`, RLS policies protect all tables, auth trigger auto-creates profiles.

---

## Phase 3: Foundational (Blocking Prerequisites)

**Purpose**: Empty directory trees that MUST exist before any source files can be created

**⚠️ CRITICAL**: No user story work can begin until Phase 3 is complete

- [X] T005 [P] Create `backend/app/` directory tree with `__init__.py` in: `app/`, `app/core/`, `app/models/`, `app/schemas/`, `app/repositories/`, `app/services/`, `app/api/`, `app/api/v1/`, `app/agents/`, `app/agents/tools/`, `app/agents/prompts/` (each `__init__.py` is an empty file)
- [X] T006 [P] Create `backend/tests/` with empty `__init__.py`, `backend/alembic/` with empty `versions/` subdir, and `backend/alembic/` with empty `env.py` stub
- [X] T007 [P] Create `frontend/` directory tree: `frontend/src/app/(auth)/login/`, `frontend/src/app/(auth)/signup/`, `frontend/src/app/(auth)/reset-password/`, `frontend/src/app/(dashboard)/templates/[id]/`, `frontend/src/app/(dashboard)/settings/`, `frontend/src/app/studio/[resumeId]/`, `frontend/src/app/chat/[resumeId]/`, `frontend/src/app/resume/[resumeId]/preview/`, `frontend/src/__tests__/`, `frontend/src/components/ui/`, `frontend/src/components/layout/`, `frontend/src/components/studio/widgets/`, `frontend/src/components/chat/`, `frontend/src/components/templates/`, `frontend/src/components/resume/`, `frontend/src/lib/`, `frontend/src/hooks/`, `frontend/src/stores/`, `frontend/src/types/`, `frontend/public/`

**Checkpoint**: Foundation ready — all directories exist with `__init__.py` or `.gitkeep` stubs

---

## Phase 4: User Story 1 - Developer Sets Up Project Scaffold (Priority: P1) 🎯 MVP

**Goal**: A developer can clone the repository and find the complete monorepo directory tree with all backend source files, configuration, and stub content in place

**Independent Test**: Run `tree backend/ frontend/` and verify all files from PLAN.md Section 1 exist

### Backend Core Files

- [X] T008 [US1] Create `backend/app/core/config.py` with `Settings(BaseSettings)` class reading env vars: `supabase_url`, `supabase_service_key`, `supabase_anon_key`, `database_url`, `jwt_secret`, `jwt_algorithm="HS256"`, `openai_api_key`, `anthropic_api_key`, `gemini_api_key`, `redis_url`, `storage_bucket`, `pdf_storage_path` — model_config `env_file=".env"`
- [X] T009 [P] [US1] Create `backend/app/core/__init__.py` (empty), `backend/app/core/database.py` (async SQLAlchemy engine + session factory + `get_db` dependency), `backend/app/core/security.py` (stub with password hashing + JWT util placeholders), `backend/app/core/dependencies.py` (stub `get_current_user` + `get_supabase` dependencies)
- [X] T010 [P] [US1] Create `backend/app/models/__init__.py`, `backend/app/models/user.py` (Profile model with id/UUID, full_name, avatar_url, timestamps), `backend/app/models/template.py` (Template model with id, user_id FK, name, description, thumbnail_url, is_public, definition/JSONB, default_styles/JSONB, timestamps), `backend/app/models/resume.py` (Resume model with id, user_id FK, template_id FK, title, content/JSONB, styles/JSONB, status, timestamps), `backend/app/models/conversation.py` (Conversation + Message models with ids, FKs, content, metadata/JSONB, timestamps)
- [X] T011 [P] [US1] Create `backend/app/schemas/__init__.py`, `backend/app/schemas/auth.py` (SignUpRequest, SignInRequest, AuthResponse Pydantic models), `backend/app/schemas/template.py` (TemplateField, SectionDefinition, LayoutDefinition, TemplateDefinition, TemplateCreate, TemplateResponse), `backend/app/schemas/resume.py` (SectionItemData, ResumeContent, ResumeCreate, ResumeUpdate, ResumeResponse), `backend/app/schemas/chat.py` (SendMessageRequest, SendMessageResponse, SwitchModeRequest)
- [X] T012 [P] [US1] Create `backend/app/repositories/__init__.py`, `backend/app/repositories/base.py` (BaseRepository[T] generic with get_by_id, list, create, update, delete, count), `backend/app/repositories/user_repo.py` (ProfileRepository extending BaseRepository[Profile]), `backend/app/repositories/template_repo.py` (TemplateRepository with get_public_templates, get_user_templates, get_available_for_user), `backend/app/repositories/resume_repo.py` (ResumeRepository with get_by_user_id), `backend/app/repositories/conversation_repo.py` (ConversationRepository with get_by_resume_and_user, get_messages, add_message)
- [X] T013 [P] [US1] Create `backend/app/services/__init__.py`, `backend/app/services/auth_service.py` (stub), `backend/app/services/template_service.py` (TemplateService with get_by_id, get_public_templates, get_user_templates, get_available_for_user, create_from_template), `backend/app/services/resume_service.py` (ResumeService with get_by_id, get_user_resumes, create_from_template, update_content, update_styles), `backend/app/services/studio_service.py` (stub), `backend/app/services/chat_service.py` (ChatService with get_or_create_conversation, send_message, switch_mode), `backend/app/services/pdf_service.py` (stub with Playwright HTML-to-PDF placeholder)
- [X] T014 [P] [US1] Create `backend/app/api/__init__.py`, `backend/app/api/deps.py` (re-export dependencies), `backend/app/api/v1/__init__.py`, `backend/app/api/v1/auth.py` (POST /signup, /signin, /logout endpoints delegating to Supabase), `backend/app/api/v1/templates.py` (GET /, GET /{id}, POST / routes), `backend/app/api/v1/resumes.py` (GET /, POST /, GET /{id}, PATCH /{id}, DELETE /{id} routes), `backend/app/api/v1/studio.py` (stub router), `backend/app/api/v1/chat.py` (POST /conversation/{resume_id}, POST /message/{conversation_id}, POST /switch-mode/{conversation_id}), `backend/app/api/v1/pdf.py` (stub router)
- [X] T015 [P] [US1] Create `backend/app/agents/__init__.py`, `backend/app/agents/router.py` (LiteLLM Router with GPT-4o primary, Claude Sonnet secondary, Gemini Pro tertiary, Ollama fallback — each with env var API keys), `backend/app/agents/cv_agent.py` (CvAgent class with process, _build_resume_context, _detect_intent, _handle_guided_answer, _handle_free_form, _handle_tool_request methods), `backend/app/agents/tools/__init__.py`, `backend/app/agents/tools/web_search.py` (async web_search using duckduckgo_search), `backend/app/agents/tools/resume_tools.py` (get_section_info, update_section), `backend/app/agents/tools/content_tools.py` (humanize_text, suggest_improvements using LiteLLM), `backend/app/agents/prompts/system.md` (resume writing coach system prompt), `backend/app/agents/prompts/sections.py` (section-specific prompts data structure)
- [X] T016 [US1] Create `backend/app/main.py` with FastAPI app instance, CORS middleware (allow all origins for dev), lifespan, and router includes for auth, templates, resumes, studio, chat, pdf — mount at `/api/v1/`

### Backend Configuration Files

- [X] T017 [US1] Create `backend/pyproject.toml` with Python >=3.12 dependencies
- [X] T018 [P] [US1] Create `backend/alembic.ini` with sqlalchemy.url = `%(DATABASE_URL)s` and script_location = alembic
- [X] T019 [P] [US1] Create `backend/ruff.toml` with target-version = `py312`, select = `["E", "F", "I", "N", "W"]`, ignore = `["E501"]`
- [X] T020 [P] [US1] Create `backend/Dockerfile` using python:3.12-slim
- [X] T021 [P] [US1] Create `backend/.env.example` with all env vars from config.py as empty KEY=VALUE pairs with comments

**Checkpoint**: User Story 1 complete — `tree backend/` shows all ~56 files.

---

## Phase 5: User Story 2 - Developer Initializes Frontend Project (Priority: P2)

**Goal**: A developer can set up and run the Next.js frontend with all page routes, components, stores, hooks, and configuration files

**Independent Test**: Run `npm install && npm run dev` — dev server starts on port 3000 and renders the homepage

### Frontend App Pages

- [X] T022 [P] [US2] Create `frontend/src/app/layout.tsx`, `frontend/src/app/page.tsx`, `frontend/src/app/globals.css`
- [X] T023 [P] [US2] Create auth page stubs
- [X] T024 [P] [US2] Create dashboard page stubs
- [X] T025 [P] [US2] Create studio/chat/preview page stubs

### Frontend Components

- [X] T026 [P] [US2] Create layout components (Navbar, Sidebar, DashboardShell)
- [X] T027 [P] [US2] Create studio components (Canvas, Widget, WidgetToolbar, StylePanel, SectionPicker)
- [X] T028 [P] [US2] Create widget components (HeaderWidget, SummaryWidget, ExperienceWidget, EducationWidget, SkillsWidget, ProjectsWidget, CertificationsWidget, LanguagesWidget, CustomWidget)
- [X] T029 [P] [US2] Create chat components (ChatPanel, MessageBubble, ChatInput, GuidedFlowIndicator, QuickActions, SectionProgress)
- [X] T030 [P] [US2] Create template and resume components

### Frontend Lib, Hooks, Stores, Types

- [X] T031 [P] [US2] Create lib modules (supabase.ts, api.ts, utils.ts, constants.ts)
- [X] T032 [P] [US2] Create hooks (useAuth, useStudio, useChat, useResume, useTemplates)
- [X] T033 [P] [US2] Create stores (studio-store, chat-store)
- [X] T034 [P] [US2] Create types (template, resume, chat)
- [X] T035 Create `frontend/src/__tests__/.gitkeep`

### Frontend Configuration Files

- [X] T036 [P] [US2] Create next.config.ts, tailwind.config.ts, tsconfig.json
- [X] T037 [P] [US2] Create package.json with all dependencies
- [X] T038 [P] [US2] Create .eslintrc.json, .prettierrc
- [X] T039 [P] [US2] Create components.json, Dockerfile, .env.local.example

**Checkpoint**: User Story 2 complete — `tree frontend/` shows all ~67 files.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification that the complete monorepo works end-to-end

- [X] T040 [P] Verify `docker-compose.yml` references correct Dockerfile paths, port mappings, and env files for both backend and frontend
- [X] T041 Verify the full directory tree matches PLAN.md — run `find backend frontend -type f | sort` and compare against the plan
- [X] T042 [P] Update `AGENTS.md` SPECKIT section to reference `specs/001-monorepo-structure/plan.md`
- [X] T043 Verify `Makefile` targets run without errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Supabase Setup (Phase 2)**: No dependencies — start immediately
- **Foundational (Phase 3)**: Depends on Setup — BLOCKS all user stories
- **User Story 1 (Phase 4)**: Depends on Foundational — backend directory tree must exist
- **User Story 2 (Phase 5)**: Depends on Foundational — frontend directory tree must exist
- **Polish (Phase 6)**: Depends on Phase 4 + Phase 5 complete

### Parallel Opportunities

| Parallel Group | Tasks |
|----------------|-------|
| Root files | T001, T002, T003, T004 |
| Supabase migration files | T101, T102, T103 (independently) |
| Supabase integration | T105, T106 (in order) |
| Backend directory tree | T005, T006 |
| Backend core files | T009, T010, T011, T012, T013, T014, T015 |
| Backend configs | T018, T019, T020, T021 |
| Frontend pages | T022, T023, T024, T025 |
| Frontend components | T026, T027, T028, T029, T030 |
| Frontend lib/hooks/stores/types | T031, T032, T033, T034 |
| Frontend configs | T036, T037, T038, T039 |
| Polish | T040, T042 |

---

## Implementation Strategy

### Complete Full Scope

1. Phase 1: Setup — root config files
2. Phase 2: Supabase Setup — database schema, RLS, auth trigger, seed data, client infra
3. Phase 3: Foundational — directory trees
4. Phase 4: User Story 1 — backend scaffold
5. Phase 5: User Story 2 — frontend scaffold
6. Phase 6: Polish — final verification
