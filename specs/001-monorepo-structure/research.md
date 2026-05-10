# Research: Phase 1 - Monorepo Directory Structure

**Phase**: 0 (Research) | **Status**: No unresolved clarifications

## Summary

All technical decisions for Phase 1 scaffolding are pre-defined by the [CraftCV Constitution](../../.specify/memory/constitution.md) and [PLAN.md](../../PLAN.md). No research was required — all choices were confirmed against existing authoritative sources.

## Decisions

### Technology Stack

| Decision | Chosen Value | Rationale | Source |
|----------|-------------|-----------|--------|
| Backend language | Python 3.12+ | Constitution mandates async Python with FastAPI | Constitution §II |
| Frontend framework | Next.js 15 App Router | Constitution mandates Next.js 15 with TypeScript strict | Constitution §II |
| Backend framework | FastAPI | Constitution mandates FastAPI async endpoints | Constitution §II, PLAN.md §4 |
| ORM | SQLAlchemy async | Constitution mandates SQLAlchemy async with Supabase PostgreSQL | Constitution §II |
| Auth | Supabase Auth (delegated) | Constitution mandates no custom auth — delegate to Supabase | Constitution §Security |
| AI router | LiteLLM with multi-provider fallback | Constitution mandates LiteLLM Router (GPT-4o primary, Claude secondary, Gemini tertiary, Ollama fallback) | Constitution §IV, PLAN.md §4.8 |
| PDF generation | Playwright (headless HTML→PDF) | Specified in PLAN.md | PLAN.md §4.9 |
| Frontend styling | Tailwind CSS v3 + shadcn/ui | Constitution mandates Tailwind utility classes only + shadcn component library | Constitution §II |
| Drag & drop | @dnd-kit | Specified in PLAN.md | PLAN.md Tech Stack |
| Rich text | TipTap | Specified in PLAN.md | PLAN.md Tech Stack |
| Client state | Zustand | Constitution mandates store-per-domain with Zustand | Constitution §III |
| Server state | TanStack Query | Constitution mandates TanStack Query for server state | Constitution §I |
| DB migrations | Alembic | Constitution mandates Alembic for all schema changes | Constitution §Security, PLAN.md §4 |
| Testing (backend) | pytest + pytest-asyncio | Constitution mandates pytest for all backend tests | Constitution §V |
| Testing (frontend) | Vitest + React Testing Library | Constitution mandates Vitest + RTL for component tests | Constitution §V |
| Linting (backend) | ruff | Constitution mandates ruff for Python linting | Constitution §V |
| Linting (frontend) | ESLint | Constitution mandates ESLint for TypeScript | Constitution §V |
| Formatting (frontend) | Prettier | Industry standard paired with ESLint | Industry convention |
| Task runner | Makefile | Clarified during spec phase — portable, zero-dependency | Spec clarifications |

### Alternatives Considered

| Rejected Alternative | Why Rejected |
|---------------------|--------------|
| Taskfile.yml (go-task) | Requires additional dependency installation; Makefile is universally available on Unix systems |
| No root-level task runner | Inconsistent developer experience — each developer must remember per-project commands |
| No test directories in scaffold | Would create friction for first test PR; placeholder files are zero-cost |
| Defer linting configs | Would lead to inconsistent first commits; configs are declarative and add no maintenance burden |

## Notes

- Phase 1 is pure scaffolding — no runtime code, no data models, no external interfaces
- All non-functional attributes (performance, scalability, security) are N/A until runtime code is implemented in later phases
