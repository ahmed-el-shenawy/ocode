# Tasks: Frontend Phase 1 - Foundation & Data Model

**Input**: Design documents from `specs/009-frontend-phase-1/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks included — not requested in spec for this infrastructure phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` for source, `frontend/` for config files

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency installation, configuration

- [X] T001 Initialize frontend project with Next.js 15, TypeScript strict mode, React 19 -- `frontend/`
- [X] T002 [P] Install all production dependencies in `frontend/package.json`: @supabase/ssr, @dnd-kit/core+sortable+utilities, @tiptap/react+starter-kit, zustand, @tanstack/react-query, lucide-react, tailwind-merge, class-variance-authority, date-fns, sonner
- [X] T003 [P] Install dev dependencies in `frontend/package.json`: typescript, @types/react, @types/node, eslint-config-next, tailwindcss, postcss, autoprefixer, @tailwindcss/typography
- [X] T004 Configure `frontend/tailwind.config.ts` with content paths and typography plugin
- [X] T005 Configure `frontend/tsconfig.json` with strict mode and path aliases (`@/` mapping to `src/`)
- [X] T006 Create `frontend/.env.local.example` with NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_API_URL
- [X] T007 [P] Initialize shadcn/ui components in `frontend/` (button, card, input, label, dialog, dropdown-menu, tabs, select, slider, switch)
- [X] T008 Create `frontend/components.json` with shadcn/ui configuration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T009 Create Supabase SSR client in `frontend/src/lib/supabase.ts` using createBrowserClient from @supabase/ssr with env variable fallback handling
- [X] T010 [P] Define utility function `cn()` in `frontend/src/lib/utils.ts` using clsx + tailwind-merge for class name composition
- [X] T011 [P] Create `frontend/src/lib/constants.ts` with app-wide constants (API base URL, route paths, storage keys, limits)

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Frontend Project Setup & Skeleton (Priority: P1) 🎯 MVP

**Goal**: A runnable Next.js app with layout, global styles, and home page that compiles without errors

**Independent Test**: Start the dev server, visit localhost, verify the page renders without compilation errors and type checks pass

- [X] T012 [US1] Create `frontend/src/app/globals.css` with Tailwind directives and any CSS custom properties
- [X] T013 [US1] Create `frontend/src/app/layout.tsx` with Inter font, metadata config, and globals.css import
- [X] T014 [US1] Create `frontend/src/app/page.tsx` with a basic landing page shell (navigation bar placeholder, hero section placeholder)
- [X] T015 [P] [US1] Create `frontend/Dockerfile` for production build with Node.js multi-stage build

**Checkpoint**: At this point, User Story 1 should be fully functional — dev server starts, page renders, no type errors

---

## Phase 4: User Story 2 - Data Model Definitions (Priority: P1)

**Goal**: TypeScript type definitions for Resume, Template, Conversation, and Message entities

**Independent Test**: Import all type definitions, construct valid objects conforming to the data model, verify no type violations

- [X] T016 [P] [US2] Define Template types in `frontend/src/types/template.ts` (TemplateField, SectionDefinition, LayoutDefinition, TemplateDefinition, Template)
- [X] T017 [P] [US2] Define Resume types in `frontend/src/types/resume.ts` (SectionItemData, ResumeContent, Resume with draft/complete/archived status)
- [X] T018 [P] [US2] Define Chat types in `frontend/src/types/chat.ts` (Message with user/assistant/system roles, Conversation with guided/free mode)

**Checkpoint**: At this point, User Story 2 should be fully functional — all types defined, no type errors, objects constructable

---

## Phase 5: User Story 3 - API Client & Auth (Priority: P1)

**Goal**: Fully configured API client with auth integration, error handling, and environment config

**Independent Test**: Initialize the API client and auth client, verify they load without errors, confirm auth token injection in request headers

- [X] T019 [P] [US3] Create API client in `frontend/src/lib/api.ts` with typed generic methods (get, post, patch, del), auth header injection, structured error parsing matching error contract, and AbortController support
- [X] T020 [US3] Configure error handling in `frontend/src/lib/api.ts` to parse and surface structured errors with code, message, details, and requestId

**Checkpoint**: At this point, all user stories should be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and documentation updates

- [X] T021 [P] Run `npm run dev` and `npm run build` to verify zero TypeScript errors and successful production build
- [X] T022 Validate all env vars documented in `.env.local.example` match what `supabase.ts` and `api.ts` expect

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - US1, US2, US3 can proceed in parallel (different directories: app/, types/, lib/)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: App files (app/layout.tsx, app/page.tsx) — no dependency on other stories
- **User Story 2 (P1)**: Type files (types/) — no dependency on other stories
- **User Story 3 (P1)**: Lib files (lib/) — no dependency on other stories

### Within Each User Story

- Files within a story marked [P] can run in parallel
- Core implementation before integration

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel
- All three user stories can run in parallel after Foundational phase
- [P] tasks within each story can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all files for User Story 1 together:
Task: "Create frontend/src/app/globals.css with Tailwind directives"
Task: "Create frontend/src/app/layout.tsx with Inter font and metadata"
Task: "Create frontend/src/app/page.tsx with landing page shell"
Task: "Create frontend/Dockerfile for production build"
```

## Parallel Example: User Story 2

```bash
# Launch all type files together:
Task: "Define Template types in frontend/src/types/template.ts"
Task: "Define Resume types in frontend/src/types/resume.ts"
Task: "Define Chat types in frontend/src/types/chat.ts"
```

## Parallel Example: User Story 3

```bash
# Launch all lib files together:
Task: "Create API client in frontend/src/lib/api.ts"
Task: "Create Supabase SSR client in frontend/src/lib/supabase.ts"
Task: "Create utility functions in frontend/src/lib/utils.ts"
Task: "Create constants in frontend/src/lib/constants.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 — runnable frontend skeleton
4. **STOP and VALIDATE**: `npm run build` passes with zero errors
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Data model ready, verify no type errors
4. Add User Story 3 → API layer ready, verify client initialization
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (app skeleton)
   - Developer B: User Story 2 (type definitions)
   - Developer C: User Story 3 (API client + auth)
3. All stories are independent — no merge conflicts expected

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
