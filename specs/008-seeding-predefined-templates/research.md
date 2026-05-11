# Research: Seeding Predefined Templates

## Decision: Seed Script Approach

- **Decision**: Standalone Python script at `craftcv/backend/supabase/seed.py`
- **Rationale**: Simpler than an Alembic migration for static seed data. No schema changes needed. Script can be run independently via `python -m supabase.seed`.
- **Alternatives considered**: Alembic migration (too heavy for data-only seed), raw SQL file (loss of programmatic JSON construction).

## Decision: Existing Backend Components to Use

- **Decision**: Import `Template` model and `TemplateRepository` from existing module paths (`app.models.template`, `app.repositories.template_repo`)
- **Rationale**: Follows existing layering — seed script calls repository methods, not raw SQL. The repository has `create()` and list/query methods from `BaseRepository`.
- **Notes**: `TemplateRepository` uses `self.db` for the async session (not `self.session` as in PLAN.md). Use `get_async_session()` from `app.core.database` for session creation.

## Decision: Idempotent Upsert Logic

- **Decision**: Use SQLAlchemy query for case-insensitive name match. If found → update `definition`, `default_styles`, `description`. If not found → create new `Template`.
- **Rationale**: Simple, explicit, no need for PostgreSQL ON CONFLICT with JSONB.
- **Upsert key**: Case-insensitive match on `name` column using `func.lower(Template.name) == name.lower()`.

## Decision: Transaction Handling

- **Decision**: Wrap all 3 template upserts in a single transaction. If any fails, roll back all.
- **Rationale**: Ensures seed is atomic — either all 3 templates are seeded or none.

## Decision: Read-Only Enforcement

- **Decision**: Enforced at the application layer (API route or service layer). Templates with `user_id IS NULL` and `is_public = True` are excluded from update/delete operations.
- **Rationale**: No need for DB-level constraints. Existing RLS policies can also prevent direct modification.

## Template Definition Data

All 3 templates use the JSONB `definition` format from PLAN.md Section 3.

### Modern Clean
- **Layout**: Single column, blue accent (`#2563eb`), Inter font
- **Sections**: header, summary, experience, education, skills, projects, certifications, languages

### Executive  
- **Layout**: Single column, dark header (`#1e293b` primary, `#334155` secondary), serif fonts (Merriweather heading, Georgia body)
- **Sections**: header, summary, experience, education, certifications, skills

### Creative
- **Layout**: Two column, colorful (`#7c3aed` primary, `#ec4899` accent)
- **Sections**: header, summary, experience, education, skills (sidebar), projects, certifications
