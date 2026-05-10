<!--
  Sync Impact Report
  Version change: N/A (initial) → 1.0.0
  Modified principles: N/A (initial constitution)
  Added sections: All 5 principles + Security & Data + Development Workflow + Governance
  Removed sections: N/A
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ (already aligned — Constitution Check gate references correct)
    - .specify/templates/spec-template.md ✅ (already aligned)
    - .specify/templates/tasks-template.md ✅ (already aligned)
    - .specify/templates/constitution-template.md ✅ (template consumed, no further updates needed)
  Follow-up TODOs: None
-->

# CraftCV Constitution

## Core Principles

### I. Architecture & Strict Layering

Every feature MUST follow a strict layered architecture. The backend enforces
three non-negotiable layers: **Route → Service → Repository**. Routes parse
requests and delegate — they MUST NOT contain business logic. Services contain
all business rules and depend on repository abstractions. Repositories handle
data access exclusively and MUST return domain models, not dicts. Dependency
inversion is enforced via FastAPI `Depends()` — no service instantiates its own
dependencies. The frontend follows the same discipline: **Page → Component →
Store/Hook → API Client**. Zustand stores manage client state only; server
state is managed by TanStack Query.

Rationale: Strict layering ensures each piece is independently testable,
swappable, and understandable without reading the entire codebase.

### II. Tech Stack & Code Conventions

The project uses a fixed tech stack and all code MUST follow its conventions.

**Backend**: FastAPI (Python 3.12+), SQLAlchemy async with Supabase PostgreSQL,
Alembic for migrations, Pydantic v2 for all schema validation, LiteLLM for AI
routing, Playwright for PDF generation.

**Frontend**: Next.js 15 App Router (TypeScript strict mode), Tailwind CSS v3,
shadcn/ui component library, @dnd-kit for drag-and-drop, TipTap for rich text,
Zustand for client state, TanStack Query for server state.

**Conventions**:
- Python: async/await everywhere, type hints on all functions, snake_case for
  variables and DB columns, PascalCase for models.
- TypeScript: strict mode enabled, PascalCase for components and types,
  camelCase for functions and variables, kebab-case for file names.
- APIs: RESTful with camelCase JSON keys, versioned under `/api/v1/`.
- Database: snake_case column names, UUID primary keys, `created_at`/`updated_at`
  on all tables via triggers.
- CSS: Tailwind utility classes only. No inline styles except dynamic runtime
  values. CSS variables for the theming system.

Rationale: A fixed, opinionated stack eliminates decision fatigue and ensures
every contributor produces consistent code without context switching.

### III. Design Patterns & Component Registry

The project enforces specific design patterns across both backend and frontend.

**Backend patterns**:
- **Repository Pattern**: `BaseRepository<T>` generic with CRUD defaults. Each
  entity gets its own repo subclass for custom queries.
- **Service Layer**: Services orchestrate business logic and coordinate multiple
  repositories. Never expose repos directly to routes.
- **DTO Validation**: Every API input/output has a Pydantic schema. No raw
  request body access.
- **Dependency Injection**: FastAPI `Depends()` wires services and repos.
  No `__init__` instantiation of collaborators.

**Frontend patterns**:
- **Widget Registry**: Section types are rendered via a registry map
  (`Record<string, React.ComponentType>`). Adding a new section type means
  adding an entry to the registry — no conditional logic.
- **Memento (Undo/Redo)**: Zustand store maintains a history stack. Every
  mutating action pushes state before changing.
- **Store per Domain**: One Zustand store per domain (studio, chat). No
  monolithic stores.

Rationale: These patterns solve the specific problems of this app — dynamic
section rendering, real-time editing with undo, and clean data access — without
over-engineering.

### IV. AI Agent & Content Quality (NON-NEGOTIABLE)

The AI agent powers the resume-building conversation and content editing.
It MUST follow these rules without exception.

**Agent architecture**:
- LiteLLM Router with multi-provider fallback: `gpt-4o` primary,
  `claude-sonnet` secondary, `gemini-pro` tertiary, local Ollama as last resort.
- All AI interactions go through the router. No direct provider API calls.
- Agent uses a tool-based architecture: `web_search`, `humanize_text`,
  `suggest_improvements`, `update_section`, `get_section_info`.

**Content rules**:
- The agent MUST detect and remove AI-sounding phrases. Terms like
  "leveraged", "utilized", "dynamic", "results-driven", "proven track record"
  MUST be flagged and replaced.
- Every experience bullet MUST start with a strong action verb
  (Led, Developed, Designed, Architected, etc.).
- Quantified achievements MUST be preferred over vague descriptions.
- The agent MUST NOT generate fake facts or hallucinated company details.
  When uncertain, it MUST use the web search tool.

**Conversation UX**:
- Hybrid mode: guided step-by-step by default, user can switch to free-form.
- The agent asks ONE question at a time. Never multi-part questions.
- Responses MUST be concise (under 150 words) and conversational.
- Progress tracking per section is persisted in the conversation record.

Rationale: Resume content is high-stakes. A bad AI suggestion can cost a user
a job opportunity. These rules make the agent helpful without being harmful.

### V. Testing & Quality Gates

Testing is mandatory and follows a strict order. No code ships without passing
the appropriate gate.

**Backend testing**:
- Unit tests for every service method (pytest + pytest-asyncio).
- Integration tests for every API endpoint (httpx AsyncClient).
- Repository tests with a test database.

**Frontend testing**:
- Component tests for every studio widget and chat component
  (Vitest + React Testing Library).
- Store tests for every Zustand action.
- E2E critical paths via Playwright (auth flow, resume creation, PDF download).

**Quality gates** (enforced in this order):
1. TypeScript strict compilation passes / Python type checks pass (mypy).
2. All tests pass (pytest, vitest).
3. Lint passes (ruff for Python, ESLint for TypeScript).
4. No console.log / print statements in production code.
5. Every new file has a corresponding test file.

Rationale: Automated gates catch regressions early. Manual review catches
everything else. Without both, quality is a hope, not a guarantee.

## Security & Data

### Authentication & Authorization
- All authentication is delegated to **Supabase Auth**. No custom auth
  implementation.
- JWTs from Supabase are verified on every protected route via FastAPI
  middleware / dependency.
- Supabase **Row Level Security (RLS)** MUST be enabled on every table.
  Policies restrict access to owned data only.
- User IDs are UUIDs from `auth.users`. The `profiles` table mirrors
  `auth.users` via a trigger or application-level sync.

### Data Protection
- API keys for LLM providers live in environment variables only. Never
  hardcoded, never committed.
- Resumes and uploaded content are stored in **Supabase Storage** with RLS.
- PDF downloads require authentication and are served via signed URLs or
  server-side streaming.
- `.env` files are in `.gitignore`. `.env.example` files document required
  vars without secrets.

### Database
- All timestamps use `TIMESTAMPTZ` (timezone-aware).
- Soft deletes are NOT used. Hard delete with cascade is the standard.
- Migrations are managed by Alembic. Never alter tables directly in SQL.

## Development Workflow

### Feature Lifecycle (speckit Phases)
Every feature follows speckit's sequential phases:
1. **Specify**: Write feature spec at `.specify/specs/[###-name]/spec.md`.
2. **Clarify** (optional gate): Resolve ambiguities with stakeholders.
3. **Plan**: Generate plan.md with technical approach and structure.
4. **Tasks**: Break plan into individual tasks per user story.
5. **Implement**: Build in priority order (P1 → P2 → P3).
6. **Checklist**: Verify compliance with this constitution.
7. **Analyze** (optional gate): Post-implementation review.

### Branching & Commits
- Branches follow speckit sequential numbering: `001-feature-name`.
- One feature per branch. No multi-feature branches.
- Commits use conventional commits format: `type(scope): description`.
  Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`.
- Every task in tasks.md gets its own commit.

### Code Review
- All code MUST be reviewed before merging.
- Reviewers check: constitution compliance, test coverage, edge case handling,
  and security (no leaked secrets, no SQL injection vectors).
- The reviewer is the gatekeeper. If unsure, ask for clarification rather than
  approving.

## Governance

This constitution is the foundational rulebook for CraftCV. It supersedes all
other documentation, verbal agreements, and personal preferences.

### Amendment Process
1. Propose the change with rationale and specific wording.
2. Update the constitution file with the new text.
3. Increment the version per semantic versioning rules:
   - **MAJOR**: Backward-incompatible principle removal or redefinition.
   - **MINOR**: New principle or materially expanded guidance.
   - **PATCH**: Clarifications, typo fixes, non-semantic refinements.
4. Record the `LAST_AMENDED_DATE`.
5. Propagate changes to dependent templates if needed.

### Compliance Review
- Every plan must pass a **Constitution Check** gate before Phase 0 research.
- Complexity must be justified in the plan if it violates constitution rules.
- The checklist phase explicitly verifies constitution compliance.

### Version
**Version**: 1.0.0 | **Ratified**: 2026-05-10 | **Last Amended**: 2026-05-10
