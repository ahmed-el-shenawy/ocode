# Feature Specification: Seeding Predefined Templates

**Feature Branch**: `008-seeding-predefined-templates`
**Created**: 2026-05-11
**Status**: Draft
**Input**: User description: "Section 11 of PLAN.md — Seeding Predefined Templates"

## User Scenarios & Testing

### User Story 1 - Browse Public Templates on Dashboard (Priority: P1)

A new user visits the dashboard and wants to see available resume templates before creating one.

**Why this priority**: Without seeded templates the template browser is empty, making the entire onboarding flow non-functional.

**Independent Test**: Can be tested by verifying the 3 seeded templates appear in `GET /api/v1/templates/` response with `is_public=True`.

**Acceptance Scenarios**:

1. **Given** the seed script has been executed, **When** a user calls `GET /api/v1/templates/`, **Then** the response includes exactly 3 templates with names "Modern Clean", "Executive", and "Creative"
2. **Given** a user is not authenticated, **When** they call `GET /api/v1/templates/`, **Then** public templates are still returned (public access)
3. **Given** the seed script has been executed, **When** querying the `templates` table, **Then** all 3 seeded templates have `is_public=True` and `user_id=NULL`

---

### User Story 2 - Create Resume from Seeded Template (Priority: P1)

A user selects a predefined template to create their resume.

**Why this priority**: This is the core user flow — pick a template, build a resume.

**Independent Test**: Can be tested by calling `POST /api/v1/resumes/` with a seeded template's UUID and verifying a new resume is created with correct initial section structure.

**Acceptance Scenarios**:

1. **Given** "Modern Clean" template exists, **When** a user creates a resume from it, **Then** the resume has all standard sections (header, summary, experience, education, skills, projects, certifications, languages) in single-column layout with blue accent
2. **Given** "Executive" template exists, **When** a user creates a resume from it, **Then** the resume has a dark header color scheme, serif fonts, and includes certifications in its section list
3. **Given** "Creative" template exists, **When** a user creates a resume from it, **Then** the resume has two-column layout, colorful accents, and skills in a sidebar configuration

---

### User Story 3 - Seed Script Idempotency (Priority: P2)

The seed operation can be run multiple times without creating duplicate templates.

**Why this priority**: Migrations and seed scripts commonly run in CI/CD and must be safe to re-run.

**Independent Test**: Run the seed script twice and verify the templates table still contains exactly 3 public templates.

**Acceptance Scenarios**:

1. **Given** the seed script has been run once, **When** it is run again, **Then** no duplicate template rows are created (upsert by name)
2. **Given** the seed script has been run, **When** checking the database, **Then** `user_id` is `NULL` for all 3 templates

### Edge Cases

- What happens if the `templates` table is empty? The seed script populates it without error.
- What happens if one of the 3 template names already exists? The seed script should upsert (update existing, insert missing).
- How does the system handle corrupted or missing JSONB definition data? The seed script must always provide complete valid definitions.

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a seed script (Alembic migration or standalone Python script) that inserts exactly 3 predefined templates.
- **FR-002**: The "Modern Clean" template MUST define a single-column layout, blue accent color (`#2563eb`), Inter font, and sections: header, summary, experience, education, skills, projects, certifications, languages.
- **FR-003**: The "Executive" template MUST define a dark header color scheme (`#1e293b` primary, `#334155` secondary), serif fonts (Merriweather headings, Georgia body), and sections: header, summary, experience, education, certifications, skills.
- **FR-004**: The "Creative" template MUST define a two-column layout, colorful accent palette (`#7c3aed` primary, `#ec4899` accent), and sections: header, summary, experience, education, skills (sidebar), projects, certifications.
- **FR-005**: All seeded templates MUST have `is_public=True` and `user_id=NULL`.
- **FR-006**: The seed script MUST be idempotent (safe to run multiple times using upsert by name).
- **FR-007**: Each template's `definition` MUST include valid `sections` array and `layout` object conforming to the template JSON format defined in PLAN.md Section 3.
- **FR-008**: Each template's `default_styles` MUST include sensible defaults for margins, spacing, and section ordering.

### Key Entities

- **Template**: A predefined resume layout with JSONB `definition` (sections + layout) and `default_styles`. Seeded as system-owned (`user_id=NULL`, `is_public=True`).
- **Seed Script**: An Alembic migration or standalone script at `backend/supabase/seed.sql` or `backend/alembic/versions/XXXX_seed_templates.py`.

## Success Criteria

### Measurable Outcomes

- **SC-001**: Exactly 3 predefined templates are visible in the template browser immediately after seeding.
- **SC-002**: Each template's definition JSON is valid against the schema (all required fields present, layout sections match the PLAN.md Section 3 format).
- **SC-003**: Running the seed script multiple times does not create duplicate template entries.
- **SC-004**: A new user can create a resume from any of the 3 templates without additional configuration.

## Assumptions

- The `templates` table and its schema already exist (created in Phase 1 / Section 2).
- The seed script will be run manually or as part of initial deployment setup.
- Template names are unique identifiers for upsert logic.
- No file storage (e.g., thumbnail images) is needed for v1 — thumbnails can be added later.
- The seed data is static and does not require user-specific customization.
