# Implementation Plan: Template JSON Definition Format

**Branch**: `003-template-json-format` | **Date**: 2026-05-10 | **Spec**: specs/003-template-json-format/spec.md
**Input**: Feature specification from `specs/003-template-json-format/spec.md`

## Summary

Define and implement the JSON schema that governs template definitions and resume content in the CraftCV system. This includes JSON Schema files for validation, a versioning strategy for template updates, and validation logic that enforces format compliance — all following the existing Route → Service → Repository architecture.

## Technical Context

**Language/Version**: Python 3.12+
**Primary Dependencies**: FastAPI, SQLAlchemy async, Pydantic v2, Supabase PostgreSQL (JSONB)
**Storage**: PostgreSQL JSONB columns (`templates.definition`, `templates.default_styles`, `resumes.content`, `resumes.styles`)
**Testing**: pytest + pytest-asyncio, httpx AsyncClient
**Target Platform**: Linux server (containerized via Docker)
**Project Type**: web-service (backend API — JSON schema consumed by both backend validation and frontend rendering)
**Performance Goals**: Template validation under 100ms; resume content validation under 1s for up to 20 sections (per SC-002)
**Constraints**: Section IDs: lowercase alphanumeric + hyphens, max 64 chars; Labels: max 255 chars; Custom sections limited to text/richtext/url field types
**Scale/Scope**: Template format consumed by backend (validation, AI generation) and frontend (rendering); version snapshots retained per resume

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Rationale |
|------|--------|-----------|
| I. Architecture & Strict Layering | ✅ PASS | Feature extends existing Template → Resume domain model; no new layers needed. Validation logic belongs in a service, not routes or repositories. |
| II. Tech Stack & Code Conventions | ✅ PASS | Uses Pydantic v2 (already established), Python 3.12+, async patterns per convention. JSON Schema validation is a natural extension of existing Pydantic schemas. |
| III. Design Patterns & Component Registry | ✅ PASS | No new patterns introduced. Validation follows existing service pattern. Template definition registry (section types) already established in models. |
| IV. AI Agent & Content Quality | ✅ PASS (N/A) | Pure data format definition — no AI agent changes. The format enables the agent to read/write structured data, but agent behavior is out of scope per clarification. |
| V. Testing & Quality Gates | ✅ PASS | Validation logic will have unit tests (service methods) and integration tests (API endpoints) per constitution. |
| Security & Data | ✅ PASS | No new auth/security concerns. Template data is already protected by RLS in Supabase. |
| Development Workflow | ✅ PASS | Single feature branch (`003-template-json-format`). No violations. |
| Governance | ✅ PASS | No amendment needed. Constitution already references the layered architecture this feature follows. |

**Result**: ALL GATES PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/003-template-json-format/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── template-definition-schema.json
│   └── resume-content-schema.json
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
craftcv/
├── backend/
│   └── app/
│       ├── schemas/
│       │   ├── template.py     # Update: add TemplateDefinition/TemplateField/SectionDefinition (already scaffolded)
│       │   └── resume.py       # Update: add ResumeContent/SectionItemData validation (already scaffolded)
│       ├── services/
│       │   ├── template_service.py   # Update: add template validation using JSON Schema
│       │   └── resume_service.py     # Update: add resume content validation using JSON Schema
│       ├── models/
│       │   ├── template.py     # Update: ensure definition/default_styles JSONB fields are typed
│       │   └── resume.py       # Update: ensure content/styles JSONB fields are typed
│       ├── api/v1/
│       │   ├── templates.py    # Update: integrate template validation on create/update
│       │   └── resumes.py      # Update: integrate resume content validation on update
│       └── core/
│           └── validation.py   # NEW: JSON Schema loader and validation utility
```

**Structure Decision**: The feature extends the existing backend service layer. No new top-level directories needed. Validation schemas live in `app/schemas/` (Pydantic models already exist) and a new `app/core/validation.py` for JSON Schema machinery.

## Complexity Tracking

> No Constitution Check violations detected — this section is empty.
