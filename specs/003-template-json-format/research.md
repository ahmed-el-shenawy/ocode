# Research: Template JSON Definition Format

## Overview

This feature defines the JSON structure for resume template definitions and resume content within the CraftCV system. All technical decisions are drawn from the project constitution and existing implementation patterns.

## Decisions

### Decision 1: JSON Schema Validation (not Pydantic-only)

- **Decision**: Use JSON Schema (draft-07) files for structural validation of template definitions and resume content, with Pydantic v2 models serving as the Python interface layer.
- **Rationale**: The template `definition` and `default_styles` are stored as JSONB in PostgreSQL. JSON Schema validates the raw JSON structure before it's parsed into Pydantic models. This provides:
  - Schema-as-documentation — the JSON Schema files serve as the canonical format reference
  - Frontend-side validation — the same schema can validate on the client without Python dependencies
  - Database-level validation — Supabase can enforce JSONB constraints via check constraints using the schema
- **Alternatives considered**: Pydantic-only validation (inconsistent for schema sharing); custom validation functions (fragile, untestable)

### Decision 2: Template Versioning via Copy-on-Write

- **Decision**: When a template is updated, the old version is preserved as a snapshot linked to existing resumes. New resumes reference the latest template version. No automatic backfill.
- **Rationale**: Resume integrity — a user's resume should not change format out from under them. Matches the clarification from the spec.
- **Alternatives considered**: Immutable templates (too restrictive); live propagation (breaks existing resumes)

### Decision 3: Validation strictness — strict on structure, lenient on extras

- **Decision**: Block validation if required fields are missing or field types mismatch. Allow (with warning) extra unknown fields not in the template definition.
- **Rationale**: Forward compatibility — new section types or fields can be added to the template without breaking existing resumes that have not yet been updated.
- **Alternatives considered**: Fully strict (breaks forward compatibility); fully lenient (allows corrupt data)

### Decision 4: Identifier constraints

- **Decision**: Section IDs: unique per-template, lowercase alphanumeric + hyphens only, max 64 chars. Labels: max 255 chars.
- **Rationale**: IDs are used in API paths and frontend keys — limiting character set prevents encoding issues. 64 chars is sufficient for descriptive section identifiers.
- **Alternatives considered**: UUIDs (not human-readable); numeric IDs (not descriptive)

### Decision 5: Custom sections restricted to text/richtext/url

- **Decision**: Custom sections may use only text, richtext, and url field types. Structured types (list, tags, select, date, boolean) are reserved for predefined section types.
- **Rationale**: Custom sections are for unstructured content. Structured types require rendering logic (lists, tag pickers, date pickers) that custom sections should not need to implement.
- **Alternatives considered**: All field types (adds rendering complexity); no custom sections (too restrictive)
