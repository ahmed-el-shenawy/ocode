# Tasks: Chat & Studio Integration

**Input**: Design documents from `specs/007-implementation-phases/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create foundational files needed by all stories

- [X] T001 Create Pydantic schemas for sync in craftcv/backend/app/schemas/sync.py
- [X] T002 Create frontend sync types in craftcv/frontend/src/lib/sync/types.ts

---

## Phase 2: User Story 1 - Chat-to-Studio Content Sync (Priority: P1) 🎯 MVP

**Goal**: AI chat content updates propagate to studio canvas in real-time without page refresh

**Independent Test**: Open a resume in studio mode, use the chat panel to add content, verify the canvas updates within 2 seconds without page reload

### Implementation for User Story 1

- [X] T003 [P] [US1] Implement SyncService (connection manager, patch broadcast, conflict detection) in craftcv/backend/app/services/sync_service.py
- [X] T004 [US1] Implement WebSocket endpoint + REST polling/patch endpoints in craftcv/backend/app/api/v1/studio.py (depends on T003)
- [X] T005 [US1] Implement WebSocket client with reconnection + 3s polling fallback in craftcv/frontend/src/lib/sync/websocket-client.ts
- [X] T006 [US1] Extend studio-store with syncState, applyPatch, connectionStatus in craftcv/frontend/src/stores/studio-store.ts
- [X] T007 [US1] Subscribe Canvas to sync updates from studio-store in craftcv/frontend/src/components/studio/Canvas.tsx

**Checkpoint**: Chat-generated content updates appear on the studio canvas within 2 seconds

---

## Phase 3: User Story 3 - Chat Panel Embedded in Studio View (Priority: P2)

**Goal**: Chat panel is accessible as a resizable split view within the studio page

**Independent Test**: Navigate to a resume's studio page and verify the chat panel is visible as a side panel without navigating to a separate URL

### Implementation for User Story 3

- [X] T008 [P] [US3] Modify studio page layout to resizable split view in craftcv/frontend/src/app/studio/[resumeId]/page.tsx
- [X] T009 [P] [US3] Create connection status indicator component in craftcv/frontend/src/components/studio/ConnectionStatus.tsx (maps to SyncState.connectionStatus)
- [X] T010 [US3] Embed ChatPanel in studio layout and wire up to studio-store sync state

**Checkpoint**: Studio page shows chat panel as a resizable side panel with connection status indicator

---

## Phase 4: User Story 2 - Real-Time Content Bidirectional Sync (Priority: P2)

**Goal**: Studio widget edits are reflected in chat context; AI suggestions can be accepted/rejected with visual feedback

**Independent Test**: Make a change in a studio widget, send a chat message, verify the AI references the updated content. Accept a suggestion and verify the widget reflects it

### Implementation for User Story 2

- [X] T011 [P] [US2] Implement patch queue with exponential backoff in craftcv/frontend/src/lib/sync/patch-queue.ts
- [X] T012 [P] [US2] Implement conflict resolver (timestamp-based section-level) in craftcv/frontend/src/lib/sync/conflict-resolver.ts
- [X] T013 [US2] Extend chat-store to emit content patches on AI content generation in craftcv/frontend/src/stores/chat-store.ts
- [X] T014 [US2] Add accept/reject UI for AI-suggested content changes in craftcv/frontend/src/components/chat/ChatPanel.tsx
- [X] T015 [US2] Add conflict indicator widget UI (yellow banner with "Updated elsewhere — Reload") in craftcv/frontend/src/components/studio/Canvas.tsx

**Checkpoint**: Studio widget edits flow to chat context; AI suggestions can be accepted or rejected with clear feedback

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, observability, remaining requirements

- [X] T016 [P] Implement sync metrics endpoint (GET /api/v1/metrics/sync) for FR-011 in craftcv/backend/app/api/v1/studio.py
- [X] T017 [P] Implement degraded mode banner when chat API unreachable in craftcv/frontend/src/components/studio/ConnectionStatus.tsx
- [X] T018 Handle resume deletion gracefully in studio page (redirect + error message) in craftcv/frontend/src/app/studio/[resumeId]/page.tsx
- [X] T019 Add sync logging for connection transitions and patch events (FR-011) in craftcv/frontend/src/lib/sync/websocket-client.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start here
- **US1 (Phase 2)**: Depends on Phase 1 completion
- **US3 (Phase 3)**: Depends on Phase 1 completion; independent of US1/US2
- **US2 (Phase 4)**: Depends on Phase 1 + US1 completion (needs WebSocket + stores)
- **Polish (Phase 5)**: Depends on Phase 2/3/4 completion

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 1 - core sync pipeline
- **US3 (P2)**: Can start after Phase 1 - independent UI work
- **US2 (P2)**: Depends on US1 (needs WebSocket client + studio-store extensions)

### Parallel Opportunities

- T003 and T004 can run in parallel (different backend files)
- T008 and T009 can run in parallel (different frontend components)
- T011 and T012 can run in parallel (different sync modules)
- US1 and US3 can be implemented in parallel once Phase 1 is done

### Parallel Example: Phase 1 + Phase 2 Start

```bash
# Launch T001 and T002 in parallel:
Task: "Create Pydantic schemas in craftcv/backend/app/schemas/sync.py"
Task: "Create frontend types in craftcv/frontend/src/lib/sync/types.ts"

# After T001-T002 complete, launch US1 tasks that block:
Task: "Implement SyncService in craftcv/backend/app/services/sync_service.py"
Task: "Studio page layout in craftcv/frontend/src/app/studio/[resumeId]/page.tsx"

# After SyncService, next:
Task: "WebSocket endpoint + REST endpoints in craftcv/backend/app/api/v1/studio.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: US1 - Chat-to-Studio Sync (T003-T007)
3. **STOP and VALIDATE**: Open resume in studio, use chat, verify canvas updates within 2s
4. Deploy/demo if ready

### Incremental Delivery

1. Phase 1 + Phase 2 → Chat-to-studio sync working (MVP!)
2. Add Phase 3 (US3) → Chat embedded in studio layout
3. Add Phase 4 (US2) → Bidirectional sync with conflict resolution
4. Add Phase 5 (Polish) → Observability, degraded mode, edge cases
