# Implementation Plan: CraftCV Monorepo

**Branch**: `master` (recommended: `001-monorepo-structure`) | **Date**: 2026-05-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-monorepo-structure/spec.md`

**Phases**: Setup → Supabase Setup → Foundational → Backend Scaffold → Frontend Scaffold → Polish

## Summary

Scaffold the CraftCV monorepo with `backend/` (Python FastAPI) and `frontend/` (Next.js 15) sub-projects, including all directory trees, configuration files, linter/formatter setup, Supabase database schema & RLS policies, test directories, root-level task runner (Makefile), and Docker Compose orchestration. This is the foundational project skeleton upon which all subsequent phases build.

## Technical Context

**Language/Version**: Python 3.12+ (backend), TypeScript with Next.js 15 (frontend)  
**Primary Dependencies**: FastAPI, SQLAlchemy async, Supabase, LiteLLM, Playwright, Celery, Redis (backend); Next.js 15, Tailwind CSS v3, shadcn/ui, @dnd-kit, TipTap, Zustand, TanStack Query (frontend)  
**Storage**: PostgreSQL via Supabase (production + local dev via `supabase start`)  
**Testing**: pytest + pytest-asyncio (backend), Vitest + React Testing Library (frontend)  
**Target Platform**: Linux server (backend), modern web browsers (frontend)  
**Project Type**: Web application monorepo (backend API + frontend SPA)  
**Performance Goals**: N/A — no runtime code in this phase  
**Constraints**: N/A — no runtime code in this phase  
**Scale/Scope**: 2 sub-projects (backend + frontend), ~80+ files/directories total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Architecture & Strict Layering | PASS | Backend scaffold creates `api/v1/`, `services/`, `repositories/`, `models/`, `schemas/` directories enforcing Route → Service → Repository layering. Frontend scaffold creates `components/`, `hooks/`, `stores/`, `types/` directories supporting Page → Component → Store/Hook → API Client. |
| II. Tech Stack & Code Conventions | PASS | `pyproject.toml` specifies Python 3.12+, FastAPI, SQLAlchemy async. Frontend configs specify Next.js 15 App Router, TypeScript strict, Tailwind CSS. RESTful API directory at `app/api/v1/`. Linting configs scaffolded (ruff, eslint, prettier). |
| III. Design Patterns & Component Registry | PASS | Repository (`repositories/`), Service (`services/`), DTO (`schemas/`) directories scaffolded. Frontend widget registry pattern supported by `components/studio/widgets/` structure. |
| IV. AI Agent & Content Quality | PASS | N/A for scaffolding phase — no AI code implemented. |
| V. Testing & Quality Gates | PASS | Test directories scaffolded (`backend/tests/`, `frontend/src/__tests__/`). Linting/formatter configs in place. No actual tests required in this phase. |
| Security & Data | PASS | Supabase setup phase creates SQL migration with all tables, RLS policies on every table, auth trigger for profile auto-creation, and Supabase client configuration. `.env.example` provides required Supabase connection vars. |
| Development Workflow | ADVISORY | Currently on `master` branch. Recommend creating `001-monorepo-structure` feature branch before implementation to comply with branching convention. |

**Decision**: GATE PASSED — no violations require justification. Proceed to Phase 0.

## Project Structure

## Phase 2: Supabase Setup

**Purpose**: Configure Supabase project, create database schema with SQL migrations, set up Row Level Security policies, configure Supabase Auth triggers, and establish the Supabase client infrastructure.

### Database Schema (SQL Migration)

All tables use UUID primary keys with `created_at` / `updated_at` timestamps:

- **`profiles`**: Mirrors `auth.users` via DB trigger. Columns: `id` (UUID PK → auth.users), `full_name` (text), `avatar_url` (text), `created_at` (timestamptz), `updated_at` (timestamptz).
- **`templates`**: Resume template definitions. Columns: `id` (UUID PK), `user_id` (UUID FK → profiles, nullable for system templates), `name` (text), `description` (text), `thumbnail_url` (text), `is_public` (boolean), `definition` (jsonb), `default_styles` (jsonb), `created_at`, `updated_at`.
- **`resumes`**: User resume instances. Columns: `id` (UUID PK), `user_id` (UUID FK → profiles), `template_id` (UUID FK → templates), `title` (text), `content` (jsonb), `styles` (jsonb), `status` (text, default 'draft'), `created_at`, `updated_at`.
- **`conversations`**: Chat conversations per resume. Columns: `id` (UUID PK), `resume_id` (UUID FK → resumes), `user_id` (UUID FK → profiles), `mode` (text, default 'guided'), `created_at`, `updated_at`.
- **`messages`**: Individual messages within conversations. Columns: `id` (UUID PK), `conversation_id` (UUID FK → conversations), `role` (text), `content` (text), `metadata` (jsonb), `created_at`.

### Row Level Security (RLS)

Every table has RLS enabled with the following policies:

| Table | Policy | Action | Using/Check |
|-------|--------|--------|-------------|
| profiles | Users can read own profile | SELECT | `auth.uid() = id` |
| profiles | Users can update own profile | UPDATE | `auth.uid() = id` |
| profiles | Insert for own user on signup | INSERT | `auth.uid() = id` |
| templates | Public templates readable by all | SELECT | `is_public = true` |
| templates | Users can CRUD own templates | ALL | `auth.uid() = user_id` |
| resumes | Users can CRUD own resumes | ALL | `auth.uid() = user_id` |
| conversations | Users can CRUD own conversations | ALL | `auth.uid() = user_id` |
| messages | Users can CRUD messages in own conversations | ALL | via conversation join |

### Auth Trigger

A `handle_new_user()` trigger function auto-creates a profile row when a new user signs up via Supabase Auth:

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Supabase Client

`backend/app/core/supabase.py` initializes the Supabase admin and anon clients using `Settings` env vars:

- **Admin client**: Uses `service_role` key for server-side operations (migrations, storage admin).
- **Anon client**: Uses `anon` key for public operations (signup, signin).
- Both clients are cached as module-level singletons.

### Files Created

```text
backend/
├── supabase/
│   ├── migrations/
│   │   └── 00001_initial_schema.sql   # Full DDL: tables, indexes, triggers, RLS
│   └── seed.sql                        # Optional seed data (public templates)
├── app/
│   └── core/
│       └── supabase.py                 # Admin + anon Supabase clients
└── .env.example                        # Updated with all Supabase vars
```

### Documentation (this feature)

```text
specs/001-monorepo-structure/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 — technology decisions (no unknowns)
├── quickstart.md        # Phase 2 — development setup guide (updated)
├── contracts/           # Phase 2 — Supabase contract
├── data-model.md        # Phase 2 — database schema documentation
└── tasks.md             # Phase 2 (/speckit.tasks)
```

### Source Code (repository root)

```text
ocode/                          # Git repository root
├── AGENTS.md                   # Agent instructions
├── PLAN.md                     # Master plan
├── .specify/                   # Speckit tooling config
├── specs/                      # Feature specifications
│   └── 001-monorepo-structure/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       ├── quickstart.md
│       └── tasks.md
│
└── craftcv/                    # Application source root
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   ├── dependencies.py
│   │   │   ├── security.py
│   │   │   └── supabase.py
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── conversation.py
│   │   │   ├── resume.py
│   │   │   ├── template.py
│   │   │   └── user.py
│   │   ├── schemas/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py
│   │   │   ├── chat.py
│   │   │   ├── resume.py
│   │   │   └── template.py
│   │   ├── repositories/
│   │   │   ├── __init__.py
│   │   │   ├── base.py
│   │   │   ├── conversation_repo.py
│   │   │   ├── resume_repo.py
│   │   │   ├── template_repo.py
│   │   │   └── user_repo.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   ├── chat_service.py
│   │   │   ├── pdf_service.py
│   │   │   ├── resume_service.py
│   │   │   ├── studio_service.py
│   │   │   └── template_service.py
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   ├── deps.py
│   │   │   └── v1/
│   │   │       ├── __init__.py
│   │   │       ├── auth.py
│   │   │       ├── chat.py
│   │   │       ├── pdf.py
│   │   │       ├── resumes.py
│   │   │       ├── studio.py
│   │   │       └── templates.py
│   │   └── agents/
│   │       ├── __init__.py
│   │       ├── cv_agent.py
│   │       ├── router.py
│   │       ├── tools/
│   │       │   ├── __init__.py
│   │       │   ├── content_tools.py
│   │       │   ├── resume_tools.py
│   │       │   └── web_search.py
│   │       └── prompts/
│   │           ├── sections.py
│   │           └── system.md
│   ├── supabase/
│   │   ├── migrations/
│   │   │   └── 00001_initial_schema.sql
│   │   └── seed.sql
│   ├── tests/
│   │   └── __init__.py
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   │       └── .gitkeep
│   ├── alembic.ini
│   ├── .env.example
│   ├── Dockerfile
│   ├── pyproject.toml
│   └── ruff.toml
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   ├── signup/page.tsx
│   │   │   │   └── reset-password/page.tsx
│   │   │   ├── (dashboard)/
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx
│   │   │   │   ├── settings/page.tsx
│   │   │   │   └── templates/
│   │   │   │       ├── page.tsx
│   │   │   │       └── [id]/page.tsx
│   │   │   ├── studio/
│   │   │   │   └── [resumeId]/page.tsx
│   │   │   ├── chat/
│   │   │   │   └── [resumeId]/page.tsx
│   │   │   └── resume/
│   │   │       └── [resumeId]/preview/page.tsx
│   │   ├── __tests__/
│   │   │   └── .gitkeep
│   │   ├── components/
│   │   │   ├── ui/  (shadcn components — added as needed)
│   │   │   ├── layout/
│   │   │   │   ├── DashboardShell.tsx
│   │   │   │   ├── Navbar.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── studio/
│   │   │   │   ├── Canvas.tsx
│   │   │   │   ├── SectionPicker.tsx
│   │   │   │   ├── StylePanel.tsx
│   │   │   │   ├── Widget.tsx
│   │   │   │   ├── WidgetToolbar.tsx
│   │   │   │   └── widgets/
│   │   │   │       ├── CertificationsWidget.tsx
│   │   │   │       ├── CustomWidget.tsx
│   │   │   │       ├── EducationWidget.tsx
│   │   │   │       ├── ExperienceWidget.tsx
│   │   │   │       ├── HeaderWidget.tsx
│   │   │   │       ├── LanguagesWidget.tsx
│   │   │   │       ├── ProjectsWidget.tsx
│   │   │   │       ├── SkillsWidget.tsx
│   │   │   │       └── SummaryWidget.tsx
│   │   │   ├── chat/
│   │   │   │   ├── ChatInput.tsx
│   │   │   │   ├── ChatPanel.tsx
│   │   │   │   ├── GuidedFlowIndicator.tsx
│   │   │   │   ├── MessageBubble.tsx
│   │   │   │   ├── QuickActions.tsx
│   │   │   │   └── SectionProgress.tsx
│   │   │   ├── templates/
│   │   │   │   ├── TemplateCard.tsx
│   │   │   │   ├── TemplateGrid.tsx
│   │   │   │   └── TemplatePreview.tsx
│   │   │   └── resume/
│   │   │       ├── ResumeListItem.tsx
│   │   │       └── ResumePreview.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useChat.ts
│   │   │   ├── useResume.ts
│   │   │   ├── useStudio.ts
│   │   │   └── useTemplates.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── constants.ts
│   │   │   ├── supabase.ts
│   │   │   └── utils.ts
│   │   ├── stores/
│   │   │   ├── chat-store.ts
│   │   │   └── studio-store.ts
│   │   └── types/
│   │       ├── chat.ts
│   │       ├── resume.ts
│   │       └── template.ts
│   ├── public/
│   ├── components.json
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── .env.local.example
│   ├── .eslintrc.json
│   ├── next.config.ts
│   ├── package.json
│   ├── .prettierrc
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── .dockerignore
├── docker-compose.yml
├── .env.example
├── .gitignore
└── Makefile
```

**Structure Decision**: Option 2 (Web application monorepo) — expanded with the exact directory tree synced to the actual files on disk. Includes backend (core, models, schemas, repositories, services, API routes, agents), frontend (App Router pages, components, hooks, stores, types, configs), Supabase migrations and seed data, and root-level config files.

## Complexity Tracking

No constitution violations detected. Complexity tracking is N/A.

> **Fill ONLY if Constitution Check has violations that must be justified**
