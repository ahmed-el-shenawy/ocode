# Tasks: Phase 2 - Database Schema

**Input**: Design documents from `specs/002-database-schema/`
**Prerequisites**: plan.md, spec.md, data-model.md
**Organization**: Tasks grouped by user story for independent implementation

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database extensions, migration directory, Alembic configuration

**No tests required** — verified by successful migration execution

- [X] T001 Create `craftcv/backend/supabase/migrations/00001_initial_schema.sql` with header comment and enable extensions: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"` and `CREATE EXTENSION IF NOT EXISTS "pgcrypto"`
- [X] T002 Create `craftcv/backend/alembic.ini` with `sqlalchemy.url = %(DATABASE_URL)s` and `script_location = alembic` (if not already present)
- [X] T003 Create `craftcv/backend/alembic/env.py` with async SQLAlchemy runner, target_metadata from `app.core.database.Base`, and `run_migrations_online` using async engine

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The core DDL for all 5 tables and the trigger function — this must exist before any RLS or seed data

- [X] T004 Create `public.profiles` table in `craftcv/backend/supabase/migrations/00001_initial_schema.sql` with columns: id UUID PK references auth.users(id) ON DELETE CASCADE, full_name TEXT nullable, avatar_url TEXT nullable, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
- [X] T005 Create `public.templates` table in migration with columns: id UUID PK DEFAULT gen_random_uuid(), user_id UUID references profiles(id) ON DELETE SET NULL nullable, name TEXT NOT NULL, description TEXT nullable, thumbnail_url TEXT nullable, is_public BOOLEAN NOT NULL DEFAULT FALSE, definition JSONB NOT NULL, default_styles JSONB NOT NULL DEFAULT '{}', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
- [X] T006 Create `public.resumes` table in migration with columns: id UUID PK DEFAULT gen_random_uuid(), user_id UUID NOT NULL references profiles(id) ON DELETE CASCADE, template_id UUID references templates(id) ON DELETE SET NULL nullable, title TEXT NOT NULL DEFAULT 'Untitled Resume', content JSONB NOT NULL DEFAULT '{"sections": []}', styles JSONB NOT NULL DEFAULT '{}', status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','complete')), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
- [X] T007 Create `public.conversations` table in migration with columns: id UUID PK DEFAULT gen_random_uuid(), resume_id UUID NOT NULL references resumes(id) ON DELETE CASCADE, user_id UUID NOT NULL references profiles(id) ON DELETE CASCADE, progress JSONB NOT NULL DEFAULT '{}', mode TEXT NOT NULL DEFAULT 'guided' CHECK (mode IN ('guided','free')), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
- [X] T008 Create `public.messages` table in migration with columns: id UUID PK DEFAULT gen_random_uuid(), conversation_id UUID NOT NULL references conversations(id) ON DELETE CASCADE, role TEXT NOT NULL CHECK (role IN ('user','assistant','system')), content TEXT NOT NULL, metadata JSONB NOT NULL DEFAULT '{}', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
- [X] T009 Create `public.set_updated_at()` trigger function in migration using plpgsql that sets `NEW.updated_at = NOW()` on BEFORE UPDATE, then create 4 triggers: `set_profiles_updated_at`, `set_templates_updated_at`, `set_resumes_updated_at`, `set_conversations_updated_at`

---

## Phase 3: User Story 1 - User Profile Management (Priority: P1) 🎯 MVP

**Goal**: A user registers and their profile is automatically created with RLS policies protecting their data

**Independent Test**: Register a new user → verify profile record exists in `profiles` table with matching auth.uid()

### Profile RLS + Auth Trigger

- [X] T010 [P] [US1] Enable RLS on `public.profiles` in migration with `ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY`
- [X] T011 [P] [US1] Create RLS policies for profiles: SELECT policy (auth.uid() = id), INSERT policy (auth.uid() = id), UPDATE policy (auth.uid() = id)
- [X] T012 [US1] Create `public.handle_new_user()` trigger function in migration that inserts into profiles with id=NEW.id, full_name=NEW.raw_user_meta_data->>'full_name', avatar_url=NEW.raw_user_meta_data->>'avatar_url', then create `on_auth_user_created` trigger AFTER INSERT ON auth.users

**Checkpoint**: Profile auto-creation works on user signup. Profile data is protected by RLS.

---

## Phase 4: User Story 2 - Resume Template Catalog (Priority: P2)

**Goal**: System templates are publicly visible, user templates are private, RLS protects ownership

**Independent Test**: Query templates — public templates visible to all, user templates only to owner

### Template RLS + Seed Data

- [X] T013 [P] [US2] Enable RLS on `public.templates` with `ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY`
- [X] T014 [P] [US2] Create 4 RLS policies for templates: SELECT (is_public OR auth.uid() = user_id), INSERT (auth.uid() = user_id), UPDATE (auth.uid() = user_id), DELETE (auth.uid() = user_id)
- [X] T015 [US2] Create `craftcv/backend/supabase/seed.sql` with 3 system templates: 'Modern Professional' (blue accent, 1-column layout with header/summary/experience/education/skills), 'Executive' (dark header, Playfair Display font, 1-column with certifications), 'Creative' (purple accent, 2-column sidebar layout with portfolio link and languages) — each with JSONB definition and default_styles matching PLAN.md §3 format

**Checkpoint**: Templates table has 3 system templates visible to all users. User-created templates are private by default.

---

## Phase 5: User Story 3 - Resume Storage (Priority: P2)

**Goal**: Users can create, read, update, and delete their own resumes with proper RLS protection

**Independent Test**: Create a resume → verify record exists with user_id = auth.uid(). Update content → verify change persists. Delete → verify record removed.

### Resume RLS

- [X] T016 [P] [US3] Enable RLS on `public.resumes` with `ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY`
- [X] T017 [US3] Create 4 RLS policies for resumes: SELECT (auth.uid() = user_id), INSERT (auth.uid() = user_id), UPDATE (auth.uid() = user_id), DELETE (auth.uid() = user_id)

**Checkpoint**: Users can CRUD their own resumes. Other users cannot access them.

---

## Phase 6: User Story 4 - AI Chat Conversations (Priority: P3)

**Goal**: Users can create conversations for their resumes, send messages, and view chat history with RLS protection

**Independent Test**: Start a conversation for a resume → verify conversation record exists. Send a message → verify message appears in conversation history.

### Conversations + Messages RLS

- [X] T018 [P] [US4] Enable RLS on `public.conversations` with `ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY`
- [X] T019 [P] [US4] Create 4 RLS policies for conversations: SELECT (auth.uid() = user_id), INSERT (auth.uid() = user_id), UPDATE (auth.uid() = user_id), DELETE (auth.uid() = user_id)
- [X] T020 [P] [US4] Enable RLS on `public.messages` with `ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY`
- [X] T021 [US4] Create 3 RLS policies for messages: SELECT (user owns parent conversation via EXISTS subquery), INSERT (user owns parent conversation via EXISTS subquery), DELETE (user owns parent conversation via EXISTS subquery)

**Checkpoint**: Conversations and messages are protected by RLS. Users can only access their own conversation data.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Indexes, verification, and final cleanup

- [X] T022 [P] Create 8 indexes in migration: `idx_templates_user_id` ON templates(user_id), `idx_templates_is_public` ON templates(is_public), `idx_resumes_user_id` ON resumes(user_id), `idx_resumes_template_id` ON resumes(template_id), `idx_conversations_resume_id` ON conversations(resume_id), `idx_conversations_user_id` ON conversations(user_id), `idx_messages_conversation_id` ON messages(conversation_id), `idx_messages_created_at` ON messages(created_at)
- [X] T023 [P] Create `craftcv/backend/app/models/__init__.py` that re-exports all models: Profile from user.py, Template from template.py, Resume from resume.py, Conversation and Message from conversation.py
- [X] T024 Verify the complete migration file is idempotent — all CREATE statements should use IF NOT EXISTS where appropriate, all INSERT statements in seed.sql should use ON CONFLICT DO NOTHING
- [X] T025 Run the migration against a Supabase project (local or cloud) and verify: all 5 tables exist, all 8 indexes exist, all 4 update triggers exist, RLS is enabled on all 5 tables, seed templates are queryable

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (profiles table must exist)
- **User Story 2 (Phase 4)**: Depends on Foundational (templates table must exist)
- **User Story 3 (Phase 5)**: Depends on Foundational (resumes table must exist)
- **User Story 4 (Phase 6)**: Depends on Foundational (conversations + messages tables must exist)
- **Polish (Phase 7)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: After Foundational — **MVP scope**
- **User Story 2 (P2)**: After Foundational — independent of US1
- **User Story 3 (P2)**: After Foundational — independent of US1, US2
- **User Story 4 (P3)**: After Foundational (conversations+msg), independent of US1-3
- All 4 user stories can be implemented in parallel after Phase 2

### Within Each User Story

- RLS policies depend on their table existing (Phase 2)
- All [P] tasks within a phase can run in parallel
- Trigger functions must be created before their triggers

### Parallel Opportunities

| Parallel Group | Tasks |
|----------------|-------|
| Schema tables | T004, T005, T006, T007, T008 |
| Trigger function + triggers | T009 |
| Profile RLS | T010, T011 |
| Template RLS + seed | T013, T014, T015 |
| Resume RLS | T016, T017 |
| Conversations + Messages RLS | T018, T019, T020, T021 |
| Indexes | T022 |
| Models init | T023 |

---

## Parallel Example: Phase 2 (All 5 tables)

```bash
# All table CREATE statements are independent — parallelize:
Task: T004 "Create profiles table"
Task: T005 "Create templates table"
Task: T006 "Create resumes table"
Task: T007 "Create conversations table"
Task: T008 "Create messages table"

# Depends on tables existing:
Task: T009 "Create trigger function and 4 triggers"
```

## Parallel Example: User Story RLS Policies

```bash
# All user stories can get RLS policies in parallel:
Task: T010+T011 "Profile RLS policies"  [US1]
Task: T013+T014 "Template RLS policies" [US2]
Task: T016+T017 "Resume RLS policies"   [US3]
Task: T018-T021 "Conversation+Message RLS" [US4]
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational — ALL tables and trigger (T004-T009)
3. Complete Phase 3: User Story 1 — Profile RLS + Auth trigger (T010-T012)
4. **MVP STOP**: Profiles auto-create on signup with RLS protection
5. Validate: Register new user, query SELECT * FROM profiles WHERE id = auth.uid()

### Incremental Delivery

1. Setup + Foundational → **All 5 tables + trigger function exist**
2. User Story 1 → **Profile management with RLS** (MVP)
3. User Story 2 → **Template catalog with seed data + RLS**
4. User Story 3 → **Resume storage with RLS**
5. User Story 4 → **Conversations + messages with RLS**
6. Polish → **Indexes, verification, Alembic ready**

---

## Notes

- [P] tasks = different files, no dependencies — can run in parallel
- [Story] label maps task to user story for traceability
- All SQL in `00001_initial_schema.sql` — each task appends SQL to this file
- `seed.sql` is separate — can be run independently
- Verify each task's SQL is idempotent (safe to re-run)
- The existing migration at `craftcv/backend/supabase/migrations/00001_initial_schema.sql` may already contain some of these objects — review and fix discrepancies rather than rewriting from scratch
