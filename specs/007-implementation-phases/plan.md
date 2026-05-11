# Implementation Plan: Chat & Studio Integration

**Branch**: `007-implementation-phases` | **Date**: 2026-05-11 | **Spec**: specs/007-implementation-phases/spec.md
**Input**: Feature specification from `specs/007-implementation-phases/spec.md`

## Summary

Bidirectional real-time content sync between the studio canvas and AI chat panel, with WebSocket as primary transport and 3s polling fallback. The chat panel is embedded as a resizable split view in the studio page. Content patches flow at section-level granularity using a `{ sectionId, fields, source, timestamp }` format.

## Technical Context

**Language/Version**: Python 3.12+ (backend), TypeScript strict (frontend, Next.js 15)  
**Primary Dependencies**: FastAPI WebSocket support (backend), Zustand + TanStack Query (frontend client state), existing chat API  
**Storage**: N/A (no new tables; uses existing resume storage via backend chat API)  
**Testing**: pytest + pytest-asyncio + httpx AsyncClient (backend), Vitest + React Testing Library (frontend)  
**Target Platform**: Web (Linux server via Docker Compose)  
**Project Type**: Full-stack web application (feature extension to existing CraftCV)  
**Performance Goals**: Canvas update ≤2s p95 (SC-001), context sync ≤1s (SC-002), auto-recover ≤10s (SC-004)  
**Constraints**: WebSocket primary with 3s polling fallback; section-level conflict detection; degraded mode when chat API unreachable  
**Scale/Scope**: Extends existing studio page and chat panel components; no new pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gates

| # | Rule | Status | Notes |
|---|------|--------|-------|
| 1 | Strict layering (frontend: Page → Component → Store/Hook → API Client) | ✅ PASS | Extends existing studio-store and chat-store; no new layering violations |
| 2 | Tech stack adherence (no unauthorized dependencies) | ✅ PASS | Uses Zustand (existing), TanStack Query (existing), FastAPI WebSocket (built-in) |
| 3 | Store per Domain pattern | ✅ PASS | Extends existing per-domain stores (studio-store, chat-store) |
| 4 | Widget Registry pattern preserved | ✅ PASS | Content patches update widget state; registry unchanged |
| 5 | Memento/Undo pattern preserved (FR-006) | ✅ PASS | Spec explicitly requires undo/redo intact |
| 6 | Testing required (pytest + Vitest) | ✅ PASS | Sync utilities, WebSocket handlers, and UI components testable |

**Result: GATE PASSED** — No violations found. Zero complexity justification needed.

## Project Structure

### Documentation (this feature)

```text
specs/007-implementation-phases/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── api-websocket.json
│   └── api-sync.json
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
craftcv/frontend/src/
├── components/
│   ├── studio/
│   │   ├── Canvas.tsx               # [EXISTING] - add sync subscription
│   │   └── StylePanel.tsx           # [EXISTING - no changes]
│   └── chat/
│       ├── ChatPanel.tsx            # [EXISTING] - embed in studio layout
│       └── ChatInput.tsx            # [EXISTING - no changes]
├── hooks/
│   ├── useStudio.ts                 # [EXISTING] - add WebSocket connection
│   └── useChat.ts                   # [EXISTING] - add content patch emission
├── stores/
│   ├── studio-store.ts              # [EXISTING] - add sync state, patch queue
│   └── chat-store.ts                # [EXISTING] - add content patch dispatching
├── lib/
│   ├── api.ts                       # [EXISTING] - add WebSocket client
│   └── sync/
│       ├── websocket-client.ts      # [NEW] WebSocket connection manager
│       ├── patch-queue.ts           # [NEW] Outbound patch queue with retry
│       ├── conflict-resolver.ts     # [NEW] Section-level conflict detection
│       └── types.ts                 # [NEW] ContentPatch, SyncState types

craftcv/backend/app/
├── api/
│   └── v1/
│       ├── chat.py                  # [EXISTING] - add WebSocket endpoint
│       └── studio.py                # [EXISTING] - add sync endpoint
├── services/
│   └── sync_service.py              # [NEW] WebSocket connection management, patch broadcast
├── schemas/
│   └── sync.py                      # [NEW] ContentPatch, SyncEvent Pydantic schemas
```

**Structure Decision**: Feature extends existing monorepo structure (Option 2). Backend adds a new `sync_service.py` and WebSocket endpoint; frontend adds a new `lib/sync/` module.

## Complexity Tracking

*No violations — section left intentionally blank.*
