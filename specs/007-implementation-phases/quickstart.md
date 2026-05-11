# Quickstart: Chat & Studio Integration

## Overview

This feature adds bidirectional real-time sync between the studio canvas and AI chat panel, with the chat panel embedded as a resizable split view in the studio page.

## Key Decisions

| Decision | Choice |
|----------|--------|
| Sync transport | WebSocket primary, 3s polling fallback |
| Conflict resolution | Section-level, timestamp-based last-saved-wins |
| Patch format | `{ sectionId, fields, source, timestamp }` |
| Chat API unavailable | Degraded mode: studio editable, banner shown, chat disabled |
| State management | Extend existing Zustand stores (studio-store, chat-store) |
| Observability | Sync counters + connection state logging |

## Files to Create

### Backend (craftcv/backend/app/)

| File | Purpose |
|------|---------|
| `services/sync_service.py` | WebSocket connection manager, patch broadcast, conflict detection |
| `schemas/sync.py` | Pydantic models for ContentPatch, SyncEvent, SyncMetrics |
| `api/v1/studio.py` | Add WebSocket endpoint + polling REST endpoint + metrics endpoint |

### Frontend (craftcv/frontend/src/)

| File | Purpose |
|------|---------|
| `lib/sync/websocket-client.ts` | WebSocket connection manager with reconnection |
| `lib/sync/patch-queue.ts` | Outbound patch queue with exponential backoff |
| `lib/sync/conflict-resolver.ts` | Section-level conflict detection |
| `lib/sync/types.ts` | ContentPatch, SyncState, ConnectionStatus types |
| `stores/studio-store.ts` | Extend with syncState, applyPatch, handleConflict |
| `stores/chat-store.ts` | Extend with emitContentPatch, onPatchAck |
| `components/studio/Canvas.tsx` | Subscribe to sync state, show conflict indicators |
| `components/chat/ChatPanel.tsx` | Embed in studio layout, emit patches on AI content |

## Implementation Order

1. **Backend**: `schemas/sync.py` → `services/sync_service.py` → `api/v1/studio.py` (WebSocket + REST endpoints)
2. **Frontend types**: `lib/sync/types.ts`
3. **Frontend sync layer**: `lib/sync/websocket-client.ts` → `lib/sync/patch-queue.ts` → `lib/sync/conflict-resolver.ts`
4. **Frontend stores**: Extend `studio-store.ts` → Extend `chat-store.ts`
5. **Frontend UI**: Embed chat panel in studio → Add conflict indicators → Add connection status banner

## Running

```bash
# Backend
cd craftcv/backend
uvicorn app.main:app --reload

# Frontend
cd craftcv/frontend
npm run dev
```

## Testing

- **Backend**: Test WebSocket connect/disconnect, patch apply, conflict detection, fallback polling
- **Frontend**: Test WebSocket client reconnect, patch queue retry, conflict indicator rendering, degraded mode banner
