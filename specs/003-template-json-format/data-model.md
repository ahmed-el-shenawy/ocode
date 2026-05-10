# Data Model: Template Definition Format

## Entities

### TemplateDefinition

Represents the blueprint for a resume template. Stored as JSONB in the `templates.definition` column.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sections` | `array[SectionDefinition]` | Yes | Ordered list of sections in the template |
| `layout` | `LayoutDefinition` | Yes | Visual layout configuration |

**Validation rules**:
- Must contain at least 1 section
- Section IDs must be unique within the definition
- Section IDs: lowercase alphanumeric + hyphens, max 64 chars
- Labels: max 255 chars
- Custom section types restricted to text/richtext/url fields only

### SectionDefinition

Defines a single section within a template.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier per-template |
| `type` | `enum` | Yes | One of: header, summary, experience, education, projects, skills, certifications, languages, custom |
| `label` | `string` | Yes | Human-readable section name |
| `required` | `boolean` | No | Whether the section must be present (default: false) |
| `min_items` | `integer` | No | Minimum number of item entries (default: 0) |
| `max_items` | `integer` | No | Maximum number of item entries |
| `fields` | `map[string, FieldDefinition]` | Yes | Field definitions keyed by field name |

**Validation rules**:
- `id` must match `^[a-z0-9-]+$` and max 64 chars
- `type` must be a known section type
- `min_items` <= `max_items` when both specified
- `header` type is always required, max_items = 1

### FieldDefinition

Defines a single field within a section.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | `enum` | Yes | One of: text, url, date, boolean, richtext, list, tags, select |
| `label` | `string` | Yes | Human-readable field label (max 255 chars) |
| `required` | `boolean` | No | Whether the field must have a value (default: false) |
| `max_length` | `integer` | No | Max character length (text/richtext fields) |
| `min` | `integer` | No | Minimum count (list/tags fields) |
| `max` | `integer` | No | Maximum count (list/tags fields) |
| `options` | `array[string]` | No | Allowed values (select fields only) |

**Validation rules**:
- `type` must be a known field type
- `options` only valid when `type` is `select`
- `min`/`max` only valid when `type` is `list` or `tags`
- `max_length` only valid for text/richtext

### LayoutDefinition

Visual layout configuration for a template.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `columns` | `integer` | No | Column count (default: 1) |
| `color_scheme` | `object` | No | Color configuration |
| `color_scheme.primary` | `string` | No | Hex color |
| `color_scheme.secondary` | `string` | No | Hex color |
| `color_scheme.accent` | `string` | No | Hex color |
| `color_scheme.background` | `string` | No | Hex color |
| `color_scheme.text` | `string` | No | Hex color |
| `fonts` | `object` | No | Font configuration |
| `fonts.heading` | `string` | No | Heading font name |
| `fonts.body` | `string` | No | Body font name |

### ResumeContent

Represents a user's filled resume data. Stored as JSONB in the `resumes.content` column.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sections` | `array[ResumeSection]` | Yes | Ordered list of sections with filled data |

### ResumeSection

A single section's filled data.

**Fields**:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `section_id` | `string` | Yes | Matches a SectionDefinition.id |
| `type` | `string` | Yes | Matches a SectionDefinition.type |
| `items` | `array[object]` | Yes | Array of filled data items matching the section's fields |

**Validation rules**:
- `section_id` must match a section ID in the linked template definition
- `items` count must be within section's `min_items`..`max_items` range
- Each item's fields must match the section's field definitions (types, required)
- Unknown fields are warned but allowed (forward compatibility)

## State Transitions

### Template Lifecycle

```
Created (draft) → Modified (new version) → [version snapshots retained per resume]
```

- Templates have no explicit publish/unpublish states in v1
- Each update creates a new version; old versions are retained as snapshots linked to existing resumes
- No automatic cleanup of old versions

### Resume Lifecycle (content validation)

```
Draft → [content validation on update] → Complete
```

- Content validation runs on every resume update
- Strict validation blocks save if required fields missing or type mismatches
- Lenient validation warns but allows unknown fields
