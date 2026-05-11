# Data Model: Backend Implementation

## Entities

### Profile

Represents an authenticated user, linked to Supabase Auth.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, FK → auth.users.id ON DELETE CASCADE | User identifier |
| `full_name` | TEXT | nullable | Display name |
| `avatar_url` | TEXT | nullable | Avatar image URL |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Row creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Relationships**:
- Has many `Resume` records (via `user_id`)
- Has many `Template` records (via `user_id`)
- Has many `Conversation` records (via `user_id`)

### Template

A resume blueprint defining sections, fields, and visual layout.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Template identifier |
| `user_id` | UUID | FK → profiles.id ON DELETE SET NULL, nullable | Owner (null = system template) |
| `name` | TEXT | NOT NULL | Template name |
| `description` | TEXT | nullable | Human-readable description |
| `thumbnail_url` | TEXT | nullable | Preview image URL |
| `is_public` | BOOLEAN | NOT NULL, DEFAULT FALSE | Public visibility flag |
| `definition` | JSONB | NOT NULL | Section and field definitions |
| `default_styles` | JSONB | NOT NULL, DEFAULT '{}' | Default visual styles |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Row creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Relationships**:
- Belongs to `Profile` (via `user_id`)
- Has many `Resume` records (via `template_id`)

**Indexes**: `idx_templates_user_id`, `idx_templates_is_public`

### Resume

A user's actual resume document.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Resume identifier |
| `user_id` | UUID | NOT NULL, FK → profiles.id ON DELETE CASCADE | Owner |
| `template_id` | UUID | FK → templates.id ON DELETE SET NULL, nullable | Source template |
| `title` | TEXT | NOT NULL, DEFAULT 'Untitled Resume' | User-facing title |
| `content` | JSONB | NOT NULL, DEFAULT '{"sections": []}' | Filled resume data |
| `styles` | JSONB | NOT NULL, DEFAULT '{}' | Custom style overrides |
| `status` | TEXT | NOT NULL, DEFAULT 'draft', CHECK IN ('draft','complete') | Lifecycle status |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Row creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Relationships**:
- Belongs to `Profile` (via `user_id`)
- Belongs to `Template` (via `template_id`)
- Has many `Conversation` records (via `resume_id`)

**Indexes**: `idx_resumes_user_id`, `idx_resumes_template_id`

### Conversation

An AI chat session associated with a resume.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Conversation identifier |
| `resume_id` | UUID | NOT NULL, FK → resumes.id ON DELETE CASCADE | Linked resume |
| `user_id` | UUID | NOT NULL, FK → profiles.id ON DELETE CASCADE | Owner |
| `progress` | JSONB | NOT NULL, DEFAULT '{}' | Section completion progress |
| `mode` | TEXT | NOT NULL, DEFAULT 'guided', CHECK IN ('guided','free') | Interaction mode |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Row creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

**Relationships**:
- Belongs to `Resume` (via `resume_id`)
- Belongs to `Profile` (via `user_id`)
- Has many `Message` records (via `conversation_id`)

**Indexes**: `idx_conversations_resume_id`, `idx_conversations_user_id`

### Message

A single message within a conversation.

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | UUID | PK, DEFAULT gen_random_uuid() | Message identifier |
| `conversation_id` | UUID | NOT NULL, FK → conversations.id ON DELETE CASCADE | Parent conversation |
| `role` | TEXT | NOT NULL, CHECK IN ('user','assistant','system') | Message sender role |
| `content` | TEXT | NOT NULL | Message body |
| `metadata` | JSONB | NOT NULL, DEFAULT '{}' | Additional data (tool calls, model info) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Row creation timestamp |

**Relationships**:
- Belongs to `Conversation` (via `conversation_id`)

**Indexes**: `idx_messages_conversation_id`, `idx_messages_created_at`

## State Transitions

### Resume Lifecycle

```
Created (draft) → [content updated via API or AI chat] → Marked complete → Deleted
```

- All resumes start in `draft` status
- Content can be updated via direct API (PATCH) or through the AI chat flow
- User marks the resume as `complete` when ready
- Optimistic locking via `updated_at` prevents stale write conflicts at any stage

### Conversation Lifecycle

```
Started → [messages exchanged] → [continued or abandoned]
```

- Conversations persist indefinitely per clarification (no auto-cleanup)
- Mode can be toggled between `guided` and `free` at any time
- Progress is updated incrementally as sections are completed via the AI agent

### Template Lifecycle

```
Created (system or user) → [updated] → Deleted
```

- Public templates are created by system/seed data
- Users can clone public templates to create private custom templates
- Deleting a template does not cascade to resumes (FK → SET NULL on template_id)
