# Tasks: Visual Polish & Micro-interactions

**Input**: Design documents from `/specs/010-frontend-phase-2/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization — CSS keyframes, Tailwind config, sonner Toaster wiring

- [X] T001 Add `fade-in` keyframes and animation utilities to `craftcv/frontend/src/app/globals.css`
- [X] T002 Extend Tailwind config with fade-in animation in `craftcv/frontend/tailwind.config.ts`
- [X] T003 Add sonner `<Toaster>` to root layout in `craftcv/frontend/src/app/layout.tsx`

---

## Phase 2: Foundational (Shared UI Components)

**Purpose**: Reusable UI primitives that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Create `Skeleton` component at `craftcv/frontend/src/components/ui/Skeleton.tsx` with text/card/circle/rect variants
- [X] T005 [P] Create `EmptyState` component at `craftcv/frontend/src/components/ui/EmptyState.tsx` with icon, title, description, action props
- [X] T006 [P] Create `LoadingButton` component at `craftcv/frontend/src/components/ui/LoadingButton.tsx` with spinner + disabled state during async
- [X] T007 [P] Create `NetworkBanner` component at `craftcv/frontend/src/components/layout/NetworkBanner.tsx` with offline detection and retry

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Loading States (Priority: P1) 🎯 MVP

**Goal**: Users see skeleton loaders matching content shape on dashboard, template gallery, template detail, and studio canvas instead of blank space. Buttons show spinners during async actions.

**Independent Test**: Visit dashboard with slow network — skeleton cards matching grid layout appear. Click "New Resume" — button shows spinner until navigation.

### Implementation for User Story 1

- [ ] T008 [P] [US1] Use `Skeleton` component for dashboard loading state in `craftcv/frontend/src/app/dashboard/page.tsx`
- [ ] T009 [P] [US1] Use `Skeleton` component for template gallery loading state in `craftcv/frontend/src/app/dashboard/templates/page.tsx`
- [ ] T010 [P] [US1] Use `Skeleton` component for template detail loading state in `craftcv/frontend/src/app/dashboard/templates/[id]/page.tsx`
- [ ] T011 [P] [US1] Add `animate-fade-in` to page containers in dashboard and templates pages
- [ ] T012 [US1] Add studio canvas skeleton loading state while resume loads in `craftcv/frontend/src/app/studio/[resumeId]/page.tsx`
- [ ] T013 [US1] Replace inline `<button>` with `LoadingButton` for save action in studio page at `craftcv/frontend/src/app/studio/[resumeId]/page.tsx`
- [ ] T014 [P] [US1] Add `LoadingButton` for create resume button in template preview at `craftcv/frontend/src/components/templates/TemplatePreview.tsx`

**Checkpoint**: Loading states visible on all data-fetching pages. Buttons show spinners during async actions.

---

## Phase 4: User Story 2 - Error Feedback & Recovery (Priority: P1)

**Goal**: Users get inline validation on auth forms, toast notifications for transient actions, offline banner when disconnected, and error boundaries for graceful crash recovery.

**Independent Test**: Disconnect network — offline banner appears at top with retry button. Submit empty login form — inline validation appears on blur. Create resume — success toast appears.

### Implementation for User Story 2

- [ ] T015 [US2] Add inline blur validation with error messages to login form in `craftcv/frontend/src/app/(auth)/login/page.tsx`
- [ ] T016 [US2] Add inline blur validation with error messages to signup form in `craftcv/frontend/src/app/(auth)/signup/page.tsx`
- [ ] T017 [US2] Add `NetworkBanner` to `DashboardShell` in `craftcv/frontend/src/components/layout/DashboardShell.tsx`
- [ ] T018 [P] [US2] Add toast notifications for resume creation success/error in `craftcv/frontend/src/app/dashboard/templates/page.tsx`
- [ ] T019 [P] [US2] Add toast notifications for save success/error in studio page at `craftcv/frontend/src/app/studio/[resumeId]/page.tsx`
- [ ] T020 [US2] Improve error display for resume-not-found in studio page at `craftcv/frontend/src/app/studio/[resumeId]/page.tsx`

**Checkpoint**: Error feedback works on forms, toasts appear for actions, offline banner responds to network state.

---

## Phase 5: User Story 3 - Empty States (Priority: P2)

**Goal**: New users with no content see illustrated empty states with guidance on dashboard, template gallery, chat panel, and section picker.

**Independent Test**: Log in as new user with no resumes — dashboard shows "No resumes yet" with "Browse Templates" CTA. Open chat with no history — welcoming prompt appears.

### Implementation for User Story 3

- [ ] T021 [US3] Replace inline empty state on dashboard with `EmptyState` component in `craftcv/frontend/src/app/dashboard/page.tsx`
- [ ] T022 [US3] Replace inline empty state on template gallery with `EmptyState` component in `craftcv/frontend/src/app/dashboard/templates/page.tsx`
- [ ] T023 [US3] Add empty state for chat when no messages exist in `craftcv/frontend/src/components/chat/ChatPanel.tsx`
- [ ] T024 [US3] Add "All sections added" empty state in `craftcv/frontend/src/components/studio/SectionPicker.tsx`
- [ ] T025 [US3] Improve canvas empty state (no widgets) in `craftcv/frontend/src/components/studio/Canvas.tsx`

**Checkpoint**: All empty states display instructive content with CTAs instead of blank pages.

---

## Phase 6: User Story 4 - Micro-interactions (Priority: P3)

**Goal**: Buttons, cards, inputs, sidebar nav, and studio widgets provide subtle visual feedback on hover/focus/select with smooth transitions.

**Independent Test**: Hover over any button — subtle scale/brightness change within 200ms. Click input — focus ring appears smoothly. Navigate sidebar — active item shows left border indicator.

### Implementation for User Story 4

- [ ] T026 [P] [US4] Add hover lift + border effect to `TemplateCard` in `craftcv/frontend/src/components/templates/TemplateCard.tsx`
- [ ] T027 [P] [US4] Add hover lift + border effect to `ResumeListItem` in `craftcv/frontend/src/components/resume/ResumeListItem.tsx`
- [ ] T028 [US4] Add left border indicator + smooth bg transition for active sidebar item in `craftcv/frontend/src/components/layout/Sidebar.tsx`
- [ ] T029 [P] [US4] Add smooth border transition on widget selection in `craftcv/frontend/src/components/studio/Widget.tsx`
- [ ] T030 [US4] Add focus ring transitions to auth form inputs in `craftcv/frontend/src/app/(auth)/login/page.tsx` and `craftcv/frontend/src/app/(auth)/signup/page.tsx`

**Checkpoint**: All interactive elements provide smooth visual feedback on hover, focus, and selection.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Ensure consistency across all pages and verify the build

- [ ] T031 [P] Run frontend lint to verify no regressions with `npm run lint` in `craftcv/frontend/`
- [ ] T032 Run quickstart.md verification steps to validate all stories

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 Loading States (Phase 3)**: Depends on Foundational — no dependency on other stories
- **US2 Error Feedback (Phase 4)**: Depends on Foundational — no dependency on other stories
- **US3 Empty States (Phase 5)**: Depends on Foundational — no dependency on other stories
- **US4 Micro-interactions (Phase 6)**: Depends on Foundational — no dependency on other stories
- **Polish (Phase 7)**: Depends on all Phase 3-6 completion

### User Story Dependencies

- **US1 (P1)**: Can start after Foundational — No dependencies on other stories
- **US2 (P1)**: Can start after Foundational — No dependencies on other stories
- **US3 (P2)**: Can start after Foundational — No dependencies on other stories
- **US4 (P3)**: Can start after Foundational — No dependencies on other stories

### Within Each User Story

- Components can be created in any order within a story (no internal dependencies)
- Each story independently testable

### Parallel Opportunities

- All Phase 1 tasks sequential (touch same config files)
- All Phase 2 tasks marked [P] can run in parallel (4 independent files)
- All 4 user stories can run in parallel after Phase 2 (independent teams/files)
- All [P] tasks within a story can run in parallel (different files)

---

## Parallel Example: All User Stories

```bash
# Launch all user stories in parallel after Phase 2:
Task: T008-T014 "User Story 1 — Loading States"
Task: T015-T020 "User Story 2 — Error Feedback"
Task: T021-T025 "User Story 3 — Empty States"
Task: T026-T030 "User Story 4 — Micro-interactions"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (Loading States)
4. Complete Phase 4: User Story 2 (Error Feedback)
5. **STOP and VALIDATE**: Test US1 + US2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 (Loading) → Test independently → Demo
3. Add US2 (Errors) → Test independently → Demo
4. Add US3 (Empty) → Test independently → Demo
5. Add US4 (Micro-interactions) → Test independently → Demo

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 — Loading States
   - Developer B: US2 — Error Feedback
   - Developer C: US3 — Empty States
   - Developer D: US4 — Micro-interactions
3. All stories complete and integrate independently (no file conflicts)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- No test tasks required — manual verification per quickstart.md is sufficient for this visual polish feature
- Commit after each phase or logical group
- Stop at any checkpoint to validate story independently
- No file conflicts between stories — each touches different components
