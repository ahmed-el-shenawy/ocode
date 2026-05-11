# Data Model: Seeded Templates

## Entity: Template (seed data)

The `Template` model at `app.models.template` is unchanged. This document describes the specific seed data values.

### Common Seed Fields

| Field | Value |
|-------|-------|
| `user_id` | `NULL` |
| `is_public` | `True` |
| `thumbnail_url` | `NULL` (v1 — no thumbnails) |

### Seed Template 1: Modern Clean

| Field | Value |
|-------|-------|
| `name` | `Modern Clean` |
| `description` | `A clean, modern single-column resume with blue accents and Inter font — suitable for most industries.` |
| `definition.sections` | `["header", "summary", "experience", "education", "skills", "projects", "certifications", "languages"]` |
| `definition.layout.columns` | `1` |
| `definition.layout.color_scheme.primary` | `#1e293b` |
| `definition.layout.color_scheme.secondary` | `#475569` |
| `definition.layout.color_scheme.accent` | `#2563eb` |
| `definition.layout.color_scheme.background` | `#ffffff` |
| `definition.layout.color_scheme.text` | `#1a202c` |
| `definition.layout.fonts.heading` | `Inter` |
| `definition.layout.fonts.body` | `Inter` |

### Seed Template 2: Executive

| Field | Value |
|-------|-------|
| `name` | `Executive` |
| `description` | `A professional executive resume with dark header, serif typography, and emphasis on summary and certifications.` |
| `definition.sections` | `["header", "summary", "experience", "education", "certifications", "skills"]` |
| `definition.layout.columns` | `1` |
| `definition.layout.color_scheme.primary` | `#1e293b` |
| `definition.layout.color_scheme.secondary` | `#334155` |
| `definition.layout.color_scheme.accent` | `#cbd5e1` |
| `definition.layout.color_scheme.background` | `#ffffff` |
| `definition.layout.color_scheme.text` | `#0f172a` |
| `definition.layout.fonts.heading` | `Merriweather` |
| `definition.layout.fonts.body` | `Georgia` |

### Seed Template 3: Creative

| Field | Value |
|-------|-------|
| `name` | `Creative` |
| `description` | `A two-column creative resume with vibrant accents, skills sidebar, and project-focused layout for design and tech roles.` |
| `definition.sections` | `["header", "summary", "experience", "education", "skills", "projects", "certifications"]` |
| `definition.layout.columns` | `2` |
| `definition.layout.color_scheme.primary` | `#7c3aed` |
| `definition.layout.color_scheme.secondary` | `#a78bfa` |
| `definition.layout.color_scheme.accent` | `#ec4899` |
| `definition.layout.color_scheme.background` | `#faf5ff` |
| `definition.layout.color_scheme.text` | `#1a202c` |
| `definition.layout.fonts.heading` | `Inter` |
| `definition.layout.fonts.body` | `Inter` |

### Validation Rules

- Each section in `definition.sections` must have a corresponding entry in the section definitions (PLAN.md Section 3 format)
- `layout.columns` must be 1 or 2
- All color values must be valid hex codes
- Font values must be valid Google Font names
