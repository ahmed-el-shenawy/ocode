# Data Model: Frontend Implementation

## Overview

Client-side data model for the CraftCV frontend. Server state is managed via TanStack Query; client-side UI state via Zustand. All types use camelCase for frontend consistency and are mapped to/from snake_case API responses.

---

## Entities

### Resume

The central entity. A user's resume document created from a template.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Y | Unique identifier, maps to API `id` |
| templateId | string (UUID) | N | Reference to the originating template |
| title | string | Y | User-facing resume name, defaults to "Untitled Resume" |
| content | ResumeContent | Y | Structured section data |
| styles | Record<string, unknown> | Y | Global style overrides (colors, fonts, margins) |
| status | "draft" \| "complete" | Y | Lifecycle state |
| createdAt | string (ISO 8601) | Y | Creation timestamp |
| updatedAt | string (ISO 8601) | Y | Last modification timestamp |

**State Transitions**: draft → complete (user marks as done). No reverse transition in v1.

**Validation Rules**:
- Title max 255 characters
- At least one section with content before marking complete

### ResumeContent

Container for all resume sections.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sections | SectionItemData[] | Y | Ordered list of sections |

### SectionItemData

A single content section within a resume, corresponding to a template section definition.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sectionId | string | Y | Matches the section `id` from template definition |
| type | string | Y | Section type (header, experience, education, etc.) |
| items | Record<string, unknown>[] | Y | Array of data entries for this section |

### Template

A resume blueprint. Fetched from API, used to initialize resume content and structure.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Y | Unique identifier |
| name | string | Y | Display name |
| description | string | N | Short summary |
| thumbnailUrl | string | N | Preview image URL |
| isPublic | boolean | Y | Visible to all users if true |
| definition | TemplateDefinition | Y | Section structure and field schemas |
| defaultStyles | Record<string, unknown> | Y | Default visual styles |
| createdAt | string (ISO 8601) | Y | Creation timestamp |
| updatedAt | string (ISO 8601) | Y | Last modification timestamp |

### TemplateDefinition

The structural definition of a template.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| sections | SectionDefinition[] | Y | Ordered list of sections |
| layout | LayoutDefinition | Y | Page layout configuration |

### SectionDefinition

Defines a single section's schema within a template.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Y | Unique within template |
| type | string | Y | Widget type identifier |
| label | string | Y | Human-readable section name |
| required | boolean | N | Section must have content |
| minItems | number | N | Minimum number of entries |
| maxItems | number | N | Maximum number of entries |
| fields | Record<string, TemplateField> | Y | Field schemas for entries |

### TemplateField

Schema for a single field within a section.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| type | "text" \| "url" \| "date" \| "boolean" \| "richtext" \| "list" \| "tags" \| "select" | Y | Data type |
| label | string | Y | Display label |
| required | boolean | N | Field must be filled |
| maxLength | number | N | Character limit |
| min | number | N | Minimum count (for list type) |
| max | number | N | Maximum count (for list type) |
| options | string[] | N | Allowed values (for select type) |

### LayoutDefinition

Page layout configuration.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| columns | number | Y | Number of columns (1 or 2) |
| colorScheme | Record<string, string> | Y | Color palette map |
| fonts | Record<string, string> | Y | Font family map |

---

### WidgetState (Studio Client State)

Represents a widget on the studio canvas. Managed in Zustand store only — not persisted to API.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Y | Unique widget instance ID |
| sectionId | string | Y | Corresponds to section definition |
| type | string | Y | Widget type |
| items | Record<string, unknown>[] | Y | Editable content data |
| position | { x: number, y: number } | Y | Canvas position |
| width | number | Y | Display width |
| styles | Record<string, unknown> | Y | Widget-specific style overrides |

### Conversation

An AI chat session linked to a resume.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string (UUID) | Y | Unique identifier |
| resumeId | string (UUID) | Y | Linked resume |
| mode | "guided" \| "free" | Y | Conversation mode |
| progress | Record<string, unknown> | Y | Section completion tracking |

### Message

A single exchange in a conversation.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Y | Unique identifier |
| role | "user" \| "assistant" \| "system" | Y | Message origin |
| content | string | Y | Message text |
| metadata | Record<string, unknown> | N | Additional data |
| createdAt | string (ISO 8601) | Y | Timestamp |

---

## Relationships

```
Template 1──N Resume (a template can be used by many resumes)
Resume 1──1 Conversation (one active conversation per resume)
Conversation 1──N Message (many messages per conversation)
Resume 1──N SectionItemData (many sections per resume)
```

## API Data Flow

```
Frontend (camelCase) ←→ API Client (transform) ←→ Backend API (snake_case)
```

Transform layer in `api.ts` handles key casing. Client always works in camelCase.
