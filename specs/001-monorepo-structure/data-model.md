# Data Model: CraftCV Database Schema

**Status**: Phase 2 — Supabase Setup

## Overview

CraftCV uses PostgreSQL via Supabase with 5 core tables. All tables use UUID primary keys, timestamptz timestamps, and have Row Level Security (RLS) enabled.

## Entity Relationship Diagram

```
auth.users
    │ (1)
    │
    ▼ (0..1)
profiles ────┐ (1)
    │         │
    │ (0..N)  │ (0..N)
    ▼         ▼
templates   resumes ────┐ (1)
                │       │
                │(0..N) │(0..N)
                ▼       ▼
          conversations  │
                │(1)    │
                ▼       │
            messages  ◄─┘(0..N)
```

## Tables

### profiles
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK, FK → auth.users(id) ON DELETE CASCADE | Mirrors Supabase auth.users |
| full_name | TEXT | nullable | From user_metadata on signup |
| avatar_url | TEXT | nullable | Profile picture URL |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Auto-updated via trigger |

**RLS**: Users can SELECT/INSERT/UPDATE only their own row (`auth.uid() = id`).

### templates
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK DEFAULT uuid_generate_v4() | |
| user_id | UUID | FK → profiles(id) ON DELETE SET NULL | NULL for system/public templates |
| name | TEXT | NOT NULL | Template display name |
| description | TEXT | nullable | |
| thumbnail_url | TEXT | nullable | Preview image |
| is_public | BOOLEAN | NOT NULL DEFAULT FALSE | Public templates visible to all users |
| definition | JSONB | NOT NULL DEFAULT '{}' | Section/field definitions |
| default_styles | JSONB | NOT NULL DEFAULT '{}' | Default styling values |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Auto-updated via trigger |

**RLS**: Public templates readable by all; users can CRUD only own templates.

### resumes
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK DEFAULT uuid_generate_v4() | |
| user_id | UUID | FK → profiles(id) ON DELETE CASCADE | Resume owner |
| template_id | UUID | FK → templates(id) ON DELETE SET NULL | Base template used |
| title | TEXT | NOT NULL | User-defined resume name |
| content | JSONB | NOT NULL DEFAULT '{}' | Structured resume content |
| styles | JSONB | NOT NULL DEFAULT '{}' | Style overrides |
| status | TEXT | NOT NULL DEFAULT 'draft' | draft, in_progress, complete |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Auto-updated via trigger |

**RLS**: Users can CRUD only own resumes (`auth.uid() = user_id`).

### conversations
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK DEFAULT uuid_generate_v4() | |
| resume_id | UUID | FK → resumes(id) ON DELETE CASCADE | Associated resume |
| user_id | UUID | FK → profiles(id) ON DELETE CASCADE | Conversation owner |
| mode | TEXT | NOT NULL DEFAULT 'guided' | guided, freeform |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | Auto-updated via trigger |

**RLS**: Users can CRUD only own conversations.

### messages
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | UUID | PK DEFAULT uuid_generate_v4() | |
| conversation_id | UUID | FK → conversations(id) ON DELETE CASCADE | Parent conversation |
| role | TEXT | NOT NULL | user, assistant, system |
| content | TEXT | NOT NULL | Message body |
| metadata | JSONB | NOT NULL DEFAULT '{}' | Tool calls, context, etc. |
| created_at | TIMESTAMPTZ | NOT NULL DEFAULT NOW() | |

**RLS**: Users can CRUD messages only in own conversations (via subquery).

## Indexes

- templates: `user_id`, `is_public`, `created_at DESC`
- resumes: `user_id`, `template_id`, `status`, `created_at DESC`
- conversations: `resume_id`, `user_id`, `created_at DESC`
- messages: `conversation_id`, `created_at`

## Auth Trigger

A `handle_new_user()` function on `auth.users` AFTER INSERT automatically creates a corresponding row in `profiles`, copying `full_name` and `avatar_url` from `raw_user_meta_data`.
