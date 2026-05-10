# Implementation Plan: Phase 2 - Database Schema

**Branch**: `002-database-schema` | **Date**: 2026-05-10 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/002-database-schema/spec.md`

## Summary

Define and implement the CraftCV database schema including 5 tables (profiles, templates, resumes, conversations, messages) with cascading relationships, constraints, indexes, Row Level Security policies, and seed data for system templates. The schema is defined as a Supabase SQL migration and deployed via Alembic.

## Technical Context

**Language/Version**: SQL (PostgreSQL 15+ via Supabase)  
**Primary Dependencies**: Supabase PostgreSQL, `moddatetime` extension, `pgcrypto` extension (for `gen_random_uuid()`)  
**Storage**: PostgreSQL database managed by Supabase  
**Testing**: N/A — schema validated by migration execution and seed data verification  
**Target Platform**: Supabase PostgreSQL  
**Project Type**: Database schema (5 tables, 8 indexes, RLS policies)  
**Performance Goals**: Indexed foreign keys and commonly queried fields for sub-millisecond lookups at expected scale (<10k users)  
**Constraints**: UUID primary keys, TIMESTAMPTZ for all timestamps, JSONB for flexible content fields, hard deletes (no soft deletes), snake_case column names, `created_at`/`updated_at` on all tables via triggers  
**Scale/Scope**: 5 tables, 8 indexes, 4 update triggers, RLS policies on each table

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Architecture & Strict Layering | PASS | Schema defines data layer supporting Route → Service → Repository pattern. All FK relationships enforce referential integrity. |
| II. Tech Stack & Code Conventions | PASS | PostgreSQL, UUID PKs, TIMESTAMPTZ timestamps, snake_case column names, JSONB for flexible data — all match constitution conventions. |
| III. Design Patterns & Component Registry | PASS | Schema enables Repository pattern (BaseRepository CRUD), DTO validation (Pydantic schemas map to these tables), and JSONB supports widget registry definitions. |
| IV. AI Agent & Content Quality | PASS | N/A — no AI logic in schema phase. |
| V. Testing & Quality Gates | PASS | Schema is validated by successful migration execution. Seed data verification confirms correctness. No application-level tests in this phase. |
| Security & Data | PASS | RLS policies defined per table restricting access to owned data. Hard deletes with cascade. .env.example documents required vars. |
| Development Workflow | PASS | Feature branch `002-database-schema` follows speckit numbering convention. |

**Decision**: GATE PASSED — no violations. Proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/002-database-schema/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Phase 0 — technology decisions
├── data-model.md        # Phase 1 — entities, attributes, relationships
├── quickstart.md        # Phase 1 — local DB setup guide
├── contracts/           # Phase 1 — N/A for database schema
└── tasks.md             # Phase 2 (/speckit.tasks)
```

### Source Code (repository root)

```text
craftcv/
└── backend/
    ├── supabase/
    │   ├── migrations/
    │   │   └── 00001_initial_schema.sql   # Full DDL: tables, indexes, triggers, RLS
    │   └── seed.sql                        # System template seed data
    ├── alembic/
    │   ├── env.py                           # Migration environment
    │   └── versions/                        # Alembic migration versions
    ├── alembic.ini                          # Alembic configuration
    └── app/
        ├── core/
        │   └── database.py                  # Async SQLAlchemy engine + session
        └── models/
            ├── user.py                      # SQLAlchemy Profile model
            ├── template.py                  # SQLAlchemy Template model
            ├── resume.py                    # SQLAlchemy Resume model
            └── conversation.py              # SQLAlchemy Conversation + Message models

specs/002-database-schema/
└── checklists/
    └── requirements.md     # Quality checklist
```

**Structure Decision**: Database schema lives under `backend/supabase/migrations/` for Supabase-managed deployment. SQLAlchemy models mirror the schema in `backend/app/models/` for application-level access. The Alembic setup provides migration management per constitution convention.

## Complexity Tracking

No constitution violations detected. Complexity tracking is N/A.

> **Fill ONLY if Constitution Check has violations that must be justified**
