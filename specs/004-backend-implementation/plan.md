# Implementation Plan: Backend Implementation

**Branch**: `004-backend-implementation` | **Date**: 2026-05-10 | **Spec**: specs/004-backend-implementation/spec.md
**Input**: Feature specification from `specs/004-backend-implementation/spec.md`

## Summary

Implement the complete CraftCV FastAPI backend: user authentication via Supabase Auth, resume and template CRUD with data isolation, AI-powered chat for resume building (LiteLLM router with tool-based agent), and on-demand PDF generation via Playwright. All code follows the Route → Service → Repository architecture with Pydantic v2 validation.

## Technical Context

**Language/Version**: Python 3.12+
**Primary Dependencies**: FastAPI, SQLAlchemy async, Pydantic v2, Supabase PostgreSQL, LiteLLM, Playwright, python-multipart, httpx, Celery + Redis
**Storage**: PostgreSQL (via Supabase); JSONB for template definitions and resume content; Supabase Storage for uploads
**Testing**: pytest + pytest-asyncio, httpx AsyncClient, Playwright (E2E)
**Target Platform**: Linux server (containerized via Docker)
**Project Type**: web-service (RESTful JSON API)
**Performance Goals**: Auth < 2s p95; Resume CRUD < 500ms; Chat response < 10s for 95%; PDF generation < 30s for 5 sections
**Constraints**: Rate-limit auth endpoints (5/min per IP); optimistic locking on resume updates; indefinite data retention; on-demand PDF generation
**Scale/Scope**: 100+ concurrent users; single-region deployment in v1

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Rationale |
|------|--------|-----------|
| I. Architecture & Strict Layering | ✅ PASS | Feature implements Route → Service → Repository per constitution. Auth via Supabase (delegated auth), routes parse requests, services hold business logic, repos handle data access. |
| II. Tech Stack & Code Conventions | ✅ PASS | FastAPI, SQLAlchemy async, Pydantic v2, Supabase, Alembic — all per constitution. Async/await, type hints, snake_case DB columns, RESTful API under `/api/v1/`. |
| III. Design Patterns & Component Registry | ✅ PASS | Repository Pattern (`BaseRepository<T>`), Service Layer with FastAPI Depends(), DTO validation via Pydantic — all per established patterns. |
| IV. AI Agent & Content Quality | ✅ PASS | LiteLLM Router with multi-provider fallback (gpt-4o → claude-sonnet → gemini-pro → Ollama), tool-based agent, guided/free-form chat modes per constitution. |
| V. Testing & Quality Gates | ✅ PASS | Unit tests for every service; integration tests for all API endpoints; pytest + pytest-asyncio; no console.log/print in prod. |
| Security & Data | ✅ PASS | Auth delegated to Supabase Auth; JWT verification; RLS on all tables; API keys in env vars only; hard deletes with cascade. |
| Development Workflow | ✅ PASS | Single feature branch (`004-backend-implementation`); conventional commits. |
| Governance | ✅ PASS | No amendment needed. Constitution already defines all patterns this feature follows. |

**Result**: ALL GATES PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/004-backend-implementation/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── api-auth.json
│   ├── api-resumes.json
│   ├── api-templates.json
│   ├── api-chat.json
│   └── api-pdf.json
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
craftcv/backend/
├── app/
│   ├── __init__.py
│   ├── main.py                      # FastAPI app, middleware (CORS, rate-limit, logging), router includes
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py                # Pydantic Settings (env vars)
│   │   ├── database.py              # Async engine, session factory, Base, get_db
│   │   ├── dependencies.py          # get_supabase, get_current_user
│   │   ├── security.py              # Rate limiting middleware, JWT verification
│   │   └── supabase.py              # Supabase client singleton
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py                  # Profile model
│   │   ├── template.py              # Template model (JSONB definition, default_styles)
│   │   ├── resume.py                # Resume model (JSONB content, styles)
│   │   └── conversation.py          # Conversation + Message models
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py                  # SignUpRequest, SignInRequest, AuthResponse
│   │   ├── resume.py                # ResumeCreate, ResumeUpdate, ResumeResponse
│   │   ├── template.py              # TemplateCreate, TemplateResponse, TemplateDefinition
│   │   └── chat.py                  # SendMessageRequest, SendMessageResponse, SwitchModeRequest
│   ├── repositories/
│   │   ├── __init__.py
│   │   ├── base.py                  # BaseRepository<T> (CRUD)
│   │   ├── user_repo.py
│   │   ├── template_repo.py
│   │   ├── resume_repo.py
│   │   └── conversation_repo.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py          # Supabase Auth wrapper (signup, signin, signout)
│   │   ├── template_service.py      # Template CRUD + clone
│   │   ├── resume_service.py        # Resume CRUD + create-from-template + optimistic locking
│   │   ├── chat_service.py          # Conversation + message management + AI routing
│   │   ├── pdf_service.py           # Playwright HTML→PDF generation
│   │   └── studio_service.py        # Resume content editing via chat
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py                  # get_db, get_current_user FastAPI dependencies
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── auth.py              # POST /signup, /signin, /logout
│   │       ├── resumes.py           # GET/POST/PATCH/DELETE /resumes
│   │       ├── templates.py         # GET/POST /templates, GET /templates/public
│   │       ├── chat.py              # POST /chat/conversation, /chat/message, /chat/switch-mode
│   │       ├── studio.py            # Resume content editing endpoints
│   │       └── pdf.py               # GET /resumes/{id}/pdf
│   └── agents/
│       ├── __init__.py
│       ├── cv_agent.py              # CvAgent class with tool-based architecture
│       ├── router.py                # LiteLLM Router setup (multi-provider)
│       └── tools/
│           ├── __init__.py
│           ├── web_search.py        # DuckDuckGo search tool
│           ├── content_tools.py     # humanize_text, suggest_improvements
│           └── resume_tools.py      # get_section_info, update_section
├── pyproject.toml
├── alembic.ini
├── alembic/
│   ├── env.py
│   └── versions/
├── tests/
│   ├── __init__.py
│   ├── conftest.py                 # Fixtures: async client, test DB, auth headers
│   ├── test_auth.py
│   ├── test_resumes.py
│   ├── test_templates.py
│   ├── test_chat.py
│   └── test_pdf.py
├── Dockerfile
├── .env.example
└── ruff.toml
```

**Structure Decision**: Standard backend structure with Route → Service → Repository layers per constitution. The existing scaffold from Phase 1 already establishes the directory layout — this plan fills all files with implementations.

## Complexity Tracking

> No Constitution Check violations detected — this section is empty.
