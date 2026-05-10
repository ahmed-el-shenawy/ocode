# Tasks: Template JSON Definition Format

**Input**: Design documents from `specs/003-template-json-format/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not explicitly requested in spec — service-layer validation tests included per constitution requirements (Testing & Quality Gates).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `craftcv/backend/app/`, `craftcv/frontend/`
- All paths shown below assume the existing backend structure from the monorepo

---

## Phase 1: Setup

**Purpose**: Project initialization and dependency setup

- [x] T001 Add `jsonschema` dependency to `craftcv/backend/pyproject.toml`
- [x] T002 [P] Place JSON Schema contract files as authoritative copies in `craftcv/backend/app/core/contracts/template-definition-schema.json` and `craftcv/backend/app/core/contracts/resume-content-schema.json`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core JSON Schema validation infrastructure — MUST be complete before any user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Create `ValidationResult` dataclass in `craftcv/backend/app/core/validation.py` with fields: `is_valid: bool`, `errors: list[str]`, `warnings: list[str]`
- [x] T004 Create `TemplateSchemaValidator` class in `craftcv/backend/app/core/validation.py` that loads `template-definition-schema.json` and validates JSON objects against it using `jsonschema` library
- [x] T005 Create `ResumeContentValidator` class in `craftcv/backend/app/core/validation.py` that loads `resume-content-schema.json` and validates JSON objects against it

**Checkpoint**: Foundation ready — both schema validators exist and can validate raw JSON objects

---

## Phase 3: User Story 1 - Define a new resume template (Priority: P1) 🎯 MVP

**Goal**: Template definitions follow the prescribed JSON format and are validated on create/update

**Independent Test**: Construct a valid template definition JSON with at least 3 section types (header, experience, skills) and verify the system accepts it. Construct an invalid one (duplicate IDs) and verify the system rejects it.

### Implementation for User Story 1

- [x] T006 [P] [US1] Update `TemplateDefinition` Pydantic model in `craftcv/backend/app/schemas/template.py` to enforce identifier constraints (section IDs: lowercase alphanumeric + hyphens, max 64 chars; labels: max 255 chars) and field type restrictions for custom sections
- [x] T007 [P] [US1] Add `validate_definition` method to `TemplateService` in `craftcv/backend/app/services/template_service.py` that runs the template definition through `TemplateSchemaValidator` and raises appropriate errors for violations
- [x] T008 [US1] Integrate `validate_definition` into the template create endpoint in `craftcv/backend/app/api/v1/templates.py` (POST and PUT)
- [x] T009 [US1] Handle edge cases in `TemplateService.validate_definition`: duplicate section IDs (reject), unknown section types (reject), constraint conflicts like `min_items > max_items` (reject), missing layout (reject with clear error)
- [x] T010 [US1] Handle edge cases in `TemplateService.validate_definition`: field type with invalid attributes (e.g., `options` on non-select fields, `min`/`max` on non-list/tags fields — reject with specific error messages per data-model.md)

**Checkpoint**: At this point, User Story 1 should be fully functional — template definitions are validated against the JSON Schema contract

---

## Phase 4: User Story 2 - Validate resume content against template structure (Priority: P2)

**Goal**: Resume content is validated against its linked template's section and field definitions

**Independent Test**: Create a template with required fields, then submit resume content that matches — should pass. Submit content missing a required field — should be rejected.

### Implementation for User Story 2

- [x] T011 [P] [US2] Add `validate_content_against_template` method to `ResumeService` in `craftcv/backend/app/services/resume_service.py` that:
  - Loads the linked template's `definition` JSON
  - Runs the content through `ResumeContentValidator`
  - Checks each content section_id matches a section in the template definition
  - Validates each item's fields against the section's field definitions (required fields present, types match)
  - Issues warnings (not errors) for unknown fields not in the template definition
- [x] T012 [US2] Integrate content validation into the resume update endpoint in `craftcv/backend/app/api/v1/resumes.py` (PATCH `/{resume_id}`) — block update if validation fails, attach warnings to response
- [x] T013 [US2] Implement template version snapshot logic: when a template is updated, ensure existing resumes retain their original template version reference — add a `template_version` field (UUID or JSON snapshot) to the `Resume` model in `craftcv/backend/app/models/resume.py` and update service to capture it on resume creation

**Checkpoint**: At this point, User Stories 1 AND 2 should both work — template definitions validated on creation, resume content validated against linked template

---

## Phase 5: User Story 3 - Customize a template layout (Priority: P3)

**Goal**: Users can update a template's layout (color_scheme, fonts) without affecting section structure validation

**Independent Test**: Update a template's `layout.color_scheme.primary` to a new hex color — should succeed without triggering section validation errors. Update `layout.columns` from 1 to 2 — layout should reflect new column count.

### Implementation for User Story 3

- [x] T014 [P] [US3] Add `update_layout` method to `TemplateService` in `craftcv/backend/app/services/template_service.py` that:
  - Accepts only layout-related fields (`columns`, `color_scheme`, `fonts`)
  - Validates hex color format for color_scheme values (`^#[0-9a-fA-F]{6}$`)
  - Validates column count (1-3)
  - Does NOT re-validate the full definition (layout-only change preserves existing section structure)
- [x] T015 [US3] Add layout-only PATCH endpoint or extend existing template update in `craftcv/backend/app/api/v1/templates.py` to support partial layout updates without requiring full definition re-validation

**Checkpoint**: Layout can be updated independently without triggering section structure validation

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T016 [P] Add structured logging for all validation operations in `craftcv/backend/app/core/validation.py` — log each validation pass/fail with template ID, section IDs involved, and error/warning count
- [x] T017 Run `craftcv/backend/app/core/contracts/` schema files through a JSON Schema draft-07 validator to verify they are syntactically valid
- [x] T018 Run `quickstart.md` validation scenarios to verify all acceptance criteria pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1 (P1) must be done first (templates need validation before resume content can be validated against them)
  - US2 (P2) depends on US1 (content validation needs validated templates)
  - US3 (P3) is independent of US2 but depends on US1 (layout is part of template definition)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) — No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) — Depends on US1 template validation being in place
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) — Depends on US1 template infrastructure

### Within Each User Story

- Models before services
- Services before endpoints
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- T001 and T002 can run in parallel
- T003, T004, T005 must be sequential (each builds on prior)
- T006 and T007 can run in parallel (different files)
- T011 and T013 can run in parallel
- T014 and T016 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch both schema validation + model updates together:
Task: "T006 Update TemplateDefinition Pydantic model with identifier constraints"
Task: "T007 Add validate_definition method to TemplateService"
```

## Parallel Example: User Story 2

```bash
# Launch service logic and model update together:
Task: "T011 Add validate_content_against_template to ResumeService"
Task: "T013 Add template_version field to Resume model"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 — template definition validation
4. **STOP and VALIDATE**: Create a template with 3 section types, verify it passes. Try duplicate IDs, verify rejection.
5. Deploy/demo if ready — template creation now has format enforcement

### Incremental Delivery

1. Setup + Foundational → Validation infrastructure ready
2. Add User Story 1 → Template definitions validated → **MVP!**
3. Add User Story 2 → Resume content validated against templates → Deploy/Demo
4. Add User Story 3 → Layout customization without re-validation → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T006-T010)
   - Developer B: User Story 2 (T011-T013) — can start after US1 template validation ready
   - Developer C: User Story 3 (T014-T015) — can start after US1 infrastructure ready
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
