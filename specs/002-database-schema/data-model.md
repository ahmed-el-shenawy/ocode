# Data Model: Phase 2 - Database Schema

**Status**: Complete — 5 entities, 4 relationships, 2 state machines

## Entity Relationship Summary

```
Profile (1) ──< (N) Template      (user-created templates)
Profile (1) ──< (N) Resume         (user's resumes)
Template (1) ──< (N) Resume        (resumes based on template)
Resume (1) ──< (N) Conversation    (one resume, one active conversation)
Conversation (1) ──< (N) Message   (messages in conversation)
```

---

## Entity: Profile

**Table**: `profiles`  
**Description**: User identity record extending Supabase Auth. Created automatically when a user registers.

### Attributes

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, FK → auth.users.id, CASCADE | Matches Supabase Auth user ID |
| full_name | TEXT | nullable | User's display name |
| avatar_url | TEXT | nullable | URL to avatar image |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last profile update timestamp |

### Relationships

- **Parent**: Auth.users (1:1) — profile deleted when auth user deleted
- **Children**: Templates (1:N), Resumes (1:N), Conversations (1:N)

### RLS Policy

- User can SELECT their own profile
- User can UPDATE their own profile (full_name, avatar_url only)
- User cannot DELETE their own profile (handled by auth user deletion cascade)
- Service role has full access

---

## Entity: Template

**Table**: `templates`  
**Description**: Resume blueprint defining sections, field types, and default styling. Can be system-provided (public) or user-created (private).

### Attributes

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique template identifier |
| user_id | UUID | FK → profiles(id), SET NULL | Creator; NULL = orphaned but kept |
| name | TEXT | NOT NULL | Template display name |
| description | TEXT | nullable | Brief description of template purpose |
| thumbnail_url | TEXT | nullable | Preview image URL |
| is_public | BOOLEAN | NOT NULL, DEFAULT FALSE | Visibility: public = visible to all |
| definition | JSONB | NOT NULL | Section definitions and field configurations |
| default_styles | JSONB | NOT NULL, DEFAULT '{}' | Default color scheme, fonts, layout |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

### Relationships

- **Parent**: Profile (N:1, optional) — SET NULL on profile delete
- **Children**: Resume (1:N) — SET NULL on template delete

### RLS Policy

- Everyone can SELECT public templates (is_public = TRUE)
- Owner can SELECT/UPDATE/DELETE their own templates
- Service role has full access

### Validation Rules

- `definition` must follow the Template JSON Definition Format (PLAN.md §3)
- `name` must be non-empty
- `is_public` defaults to FALSE for user-created templates

---

## Entity: Resume

**Table**: `resumes`  
**Description**: A user's actual resume based on a template. Stores filled content and custom styles independently.

### Attributes

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique resume identifier |
| user_id | UUID | FK → profiles(id), CASCADE | Owning user |
| template_id | UUID | FK → templates(id), SET NULL | Source template; NULL = detached |
| title | TEXT | NOT NULL, DEFAULT 'Untitled Resume' | User-given resume name |
| content | JSONB | NOT NULL, DEFAULT '{"sections": []}' | Filled section data per template definition |
| styles | JSONB | NOT NULL, DEFAULT '{}' | User-customized styles overriding template defaults |
| status | TEXT | NOT NULL, DEFAULT 'draft', CHECK (draft, complete) | Lifecycle state |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

### Relationships

- **Parent**: Profile (N:1) — CASCADE on profile delete
- **Parent**: Template (N:1, optional) — SET NULL on template delete
- **Children**: Conversation (1:N) — CASCADE on resume delete

### State Machine: Resume Status

```
draft ──→ complete
  ↑           │
  └───────────┘  (no transition back to draft)
```

- **draft**: Editable — content and styles can be modified
- **complete**: Finalized — content locked, PDF generation available

### RLS Policy

- User can SELECT/INSERT/UPDATE/DELETE their own resumes
- User can only UPDATE their own resumes
- Status can only transition forward (draft → complete)
- Service role has full access

### Validation Rules

- `content.sections` structure must match the template's section definitions (if template_id is set)
- `status` must be one of: 'draft', 'complete'
- Transition from 'complete' to 'draft' is not allowed

---

## Entity: Conversation

**Table**: `conversations`  
**Description**: AI-assisted editing session tied to a single resume. Tracks interaction mode and progress.

### Attributes

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique conversation identifier |
| resume_id | UUID | FK → resumes(id), CASCADE | Associated resume |
| user_id | UUID | FK → profiles(id), CASCADE | Conversing user |
| progress | JSONB | NOT NULL, DEFAULT '{}' | Section completion state keyed by section type |
| mode | TEXT | NOT NULL, DEFAULT 'guided', CHECK (guided, free) | Interaction mode |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Last update timestamp |

### Relationships

- **Parent**: Resume (N:1) — CASCADE on resume delete
- **Parent**: Profile (N:1) — CASCADE on profile delete
- **Children**: Message (1:N) — CASCADE on conversation delete

### State Machine: Conversation Mode

```
guided ←──→ free  (bidirectional — user can switch at any time)
```

- **guided**: Step-by-step mode — agent asks one question at a time in section order
- **free**: Free-form mode — user can ask anything about their resume

### RLS Policy

- User can SELECT/INSERT/UPDATE conversations where user_id = owner
- User can only UPDATE their own conversations
- Service role has full access

### Validation Rules

- One active conversation per resume (enforced at application level)
- `progress` keys are section type strings, values are completion status
- `mode` must be one of: 'guided', 'free'

---

## Entity: Message

**Table**: `messages`  
**Description**: Individual exchange within a conversation. Ordered chronologically.

### Attributes

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PK, DEFAULT gen_random_uuid() | Unique message identifier |
| conversation_id | UUID | FK → conversations(id), CASCADE | Parent conversation |
| role | TEXT | NOT NULL, CHECK (user, assistant, system) | Message origin |
| content | TEXT | NOT NULL | Message body text |
| metadata | JSONB | NOT NULL, DEFAULT '{}' | Additional context (tool calls, section refs) |
| created_at | TIMESTAMPTZ | NOT NULL, DEFAULT NOW() | Message timestamp |

### Relationships

- **Parent**: Conversation (N:1) — CASCADE on conversation delete

### RLS Policy

- User can SELECT messages in conversations they own
- Application/agent can INSERT messages into active conversations
- Service role has full access

### Validation Rules

- `role` must be one of: 'user', 'assistant', 'system'
- `content` must be non-empty
- Messages are immutable (no UPDATE, no DELETE)
- Ordering is by `created_at` ascending

---

## Indexes

| Index | Table | Column(s) | Purpose |
|-------|-------|-----------|---------|
| idx_templates_user_id | templates | user_id | Filter user's templates |
| idx_templates_is_public | templates | is_public | Query public template gallery |
| idx_resumes_user_id | resumes | user_id | List user's resumes |
| idx_resumes_template_id | resumes | template_id | Find resumes using a template |
| idx_conversations_resume_id | conversations | resume_id | Lookup conversation by resume |
| idx_conversations_user_id | conversations | user_id | List user's conversations |
| idx_messages_conversation_id | messages | conversation_id | Load message history |
| idx_messages_created_at | messages | created_at | Chronological message ordering |

---

## Migrations

### Initial Schema (Migration 00001)

1. Enable extensions: `moddatetime`, `pgcrypto`
2. Create `profiles` table with trigger
3. Create `templates` table with trigger
4. Create `resumes` table with trigger
5. Create `conversations` table with trigger
6. Create `messages` table (no trigger needed — no `updated_at`)
7. Create all 8 indexes
8. Enable RLS on all 5 tables
9. Create RLS policies per table

### Seed Data

- Insert 3-5 system resume templates (public, no user_id) via `seed.sql`
- Templates include: Classic, Modern, Minimal, Executive, Creative
