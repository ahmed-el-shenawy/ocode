# Tasks: Seeding Predefined Templates

**Input**: Design documents from `/specs/008-seeding-predefined-templates/`
**Prerequisites**: plan.md (required), spec.md, research.md, data-model.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend root**: `craftcv/backend/`
- **Seed script**: `craftcv/backend/supabase/seed.py`
- **Models**: `craftcv/backend/app/models/`
- **Repos**: `craftcv/backend/app/repositories/`
- **Services**: `craftcv/backend/app/services/`
- **API**: `craftcv/backend/app/api/v1/`
- **Tests**: `craftcv/backend/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Verify existing backend project structure at `craftcv/backend/` — no new dependencies needed
- [X] T002 Confirm `Template` model (`craftcv/backend/app/models/template.py`) and `TemplateRepository` (`craftcv/backend/app/repositories/template_repo.py`) are functional

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [X] T003 [P] Define template definition JSON constants for all 3 templates in `craftcv/backend/supabase/seed.py` per PLAN.md Section 3 format

**Checkpoint**: Foundation ready — seed script template data prepared

---

## Phase 3: User Story 1 - Browse Public Templates (Priority: P1) 🎯 MVP

**Goal**: The 3 seeded templates appear in `GET /api/v1/templates/` response with `is_public=True`.

**Independent Test**: Run seed script, then call `GET /api/v1/templates/` — verify exactly 3 templates with correct names and structure.

- [X] T004 [P] [US1] Create seed script entry point at `craftcv/backend/supabase/seed.py` with database session and main function
- [X] T005 [P] [US1] Implement Modern Clean template definition as JSON constant in `craftcv/backend/supabase/seed.py` (single-column, blue accent `#2563eb`, Inter font, all standard sections)
- [X] T006 [P] [US1] Implement Executive template definition as JSON constant in `craftcv/backend/supabase/seed.py` (dark header, serif fonts, summary + certifications focus)
- [X] T007 [P] [US1] Implement Creative template definition as JSON constant in `craftcv/backend/supabase/seed.py` (two-column, `#7c3aed` primary, `#ec4899` accent, skills sidebar)
- [X] T008 [US1] Implement `seed_templates()` function in `craftcv/backend/supabase/seed.py` that inserts all 3 templates via `TemplateRepository`

**Checkpoint**: Seeding works — public templates visible via API

---

## Phase 4: User Story 2 - Create Resume from Seeded Template (Priority: P1)

**Goal**: A user can create a resume from any seeded template via `POST /api/v1/resumes/`.

**Independent Test**: Call `POST /api/v1/resumes/` with a seeded template UUID — verify new resume has correct initial sections matching template definition.

- [X] T009 [US2] Verify resume creation from seeded template works through existing `ResumeService.create_from_template()` in `craftcv/backend/app/services/resume_service.py`
- [X] T010 [US2] Add minimal validation in resume creation to reject attempts using non-existent template UUIDs

**Checkpoint**: Users can pick any seeded template and create a resume

---

## Phase 5: User Story 3 - Seed Script Idempotency (Priority: P2)

**Goal**: Running the seed script multiple times does not create duplicate templates.

**Independent Test**: Run seed script twice — verify templates table still contains exactly 3 public templates with same names.

- [X] T011 [US3] Implement upsert logic in `craftcv/backend/supabase/seed.py` — case-insensitive name lookup, update existing or create new
- [X] T012 [US3] Wrap all 3 upserts in a single database transaction for atomicity
- [X] T013 [US3] Add script output — print summary of inserts vs updates to stdout

**Checkpoint**: Seed script is safe to re-run in CI/CD

---

## Phase 6: Read-Only System Templates (Cross-Cutting)

**Purpose**: Enforce that seeded templates (`user_id IS NULL`, `is_public = True`) cannot be modified or deleted by end users.

- [X] T014 Add read-only guard in template update endpoint in `craftcv/backend/app/api/v1/templates.py` — reject updates where `template.user_id IS NULL`
- [X] T015 Add read-only guard in template delete endpoint in `craftcv/backend/app/api/v1/templates.py` — reject deletes where `template.user_id IS NULL`

---

## Phase 7: Polish & Documentation

- [X] T016 [P] Update `craftcv/backend/supabase/seed.py` with `if __name__ == "__main__":` entry point for `python -m supabase.seed` execution
- [X] T017 Run quickstart.md verification steps — confirm seed script runs and produces expected output
- [ ] T018 Update README or deployment docs with seed script instructions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — constants needed before seed script
- **US1 — Browse (Phase 3)**: Depends on Phase 2 — seed script with template data
- **US2 — Create Resume (Phase 4)**: Depends on Phase 3 — needs seeded templates to exist
- **US3 — Idempotency (Phase 5)**: Depends on Phase 3 — upsert logic built on seed script
- **Read-Only Guard (Phase 6)**: No dependencies on user stories — can be done in parallel with any phase
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2)
- **User Story 2 (P1)**: Depends on US1 completion (needs seeded templates)
- **User Story 3 (P2)**: Depends on US1 completion (needs seed script structure)
- **Read-Only Guard**: No story dependency — independent

### Within Each User Story

- Template data constants before seed function
- Seed function before upsert logic
- Implementation before verification

### Parallel Opportunities

- T003, T004, T005, T006, T007 (template constants) can run in parallel
- T014, T015 (read-only guards) can run with any phase — no dependencies

---

## Parallel Example: User Story 1

```bash
# Launch all template definitions together:
Task: "Implement Modern Clean template definition in craftcv/backend/supabase/seed.py"
Task: "Implement Executive template definition in craftcv/backend/supabase/seed.py"
Task: "Implement Creative template definition in craftcv/backend/supabase/seed.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (template constants)
3. Complete Phase 3: User Story 1 — Browse Public Templates
4. **STOP and VALIDATE**: Run seed script, hit `GET /api/v1/templates/`, verify 3 templates
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Template constants ready
2. Add US1 (Browse templates) → Deploy/Demo (MVP!)
3. Add US2 (Create resume from template) → Deploy/Demo
4. Add US3 (Idempotency) → Deploy/Demo
5. Add Read-Only Guard → Deploy/Demo
6. Each step adds value without breaking previous steps

### Parallel Team Strategy

With multiple developers:
1. Developer A: US1 template definitions + seed function
2. Developer B: Read-only guards (Phase 6) — fully independent
3. Once US1 done: Developer A continues to US2, Developer B to US3

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
