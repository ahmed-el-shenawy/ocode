# Research: Chat & Studio Integration

## Overview

Research findings to resolve technical unknowns for the bidirectional sync feature between studio canvas and AI chat panel.

---

## 1. FastAPI WebSocket Connection Management

**Decision**: Use FastAPI's built-in `WebSocket` endpoint with an in-memory connection manager. A `SyncService` class tracks active connections per resume session and handles broadcast of content patches.

**Rationale**: FastAPI natively supports WebSocket upgrade via `websocket_endpoint`. An in-memory `ConnectionManager` dictionary (`Dict[str, List[WebSocket]]`) keyed by resume ID is the standard pattern. No external dependency needed.

**Alternatives considered**:
- Redis Pub/Sub — overkill for single-instance deployment; adds infrastructure complexity
- Socket.IO — heavy abstraction; FastAPI native WebSocket is simpler for this use case

**Pattern**:
- `ConnectionManager.connect(resume_id, websocket)` — register connection
- `ConnectionManager.disconnect(resume_id, websocket)` — remove on close
- `ConnectionManager.broadcast(resume_id, patch)` — send to all connections for that resume
- Heartbeat/ping every 30s to detect stale connections
- On error/close, client falls back to 3s polling via existing REST API

---

## 2. Frontend WebSocket Client with Zustand

**Decision**: Implement a dedicated `WebSocketClient` class in `lib/sync/websocket-client.ts` that manages the connection lifecycle and integrates with Zustand stores via callbacks. Use Zustand store actions to apply incoming patches.

**Rationale**: Separating WebSocket lifecycle from UI state keeps components clean and stores testable. The existing store-per-domain pattern is preserved.

**Alternatives considered**:
- TanStack Query subscriptions — not designed for WebSocket connections; better suited for HTTP polling
- Redux middleware — adds unnecessary dependency; Zustand store actions suffice

**Pattern**:
- `WebSocketClient` handles: connect, disconnect, reconnect with exponential backoff (1s, 2s, 4s, 8s, max 30s), send patch, onMessage callback
- On mount, studio page creates a client instance and passes store actions as handlers
- On unmount, client disconnects gracefully
- WebSocket URL: `ws://host/api/v1/studio/{resume_id}/sync`
- Fallback polling: if WebSocket fails after 3 retries, switch to polling at 3s intervals via `GET /api/v1/studio/{resume_id}/state`
- Connection status stored in Zustand `studio-store.syncState`: `'connected' | 'connecting' | 'reconnecting' | 'disconnected' | 'fallback-polling'`

---

## 3. Sync Queue with Exponential Backoff

**Decision**: Implement an in-memory queue in the frontend `lib/sync/patch-queue.ts` that holds outbound content patches until acknowledged by the server. Retry with exponential backoff (1s, 2s, 4s, 8s, max 30s). Max 5 retries before showing error.

**Rationale**: The spec requires FR-009: "Network interruptions during sync MUST queue pending updates and retry automatically." An in-memory queue is sufficient since patches are ephemeral; the source of truth is always the resume in the backend.

**Alternatives considered**:
- localStorage-backed queue — adds complexity; patches are small and ephemeral
- Server-side queue — unnecessary; backend processes patches synchronously

**Pattern**:
- Queue is a `ContentPatch[]` array with `pending`, `in-flight`, `failed` states
- On send: move to `in-flight`, wait for ack (or timeout after 5s), then remove or retry
- On disconnect: all `in-flight` patches revert to `pending`, retried on reconnect
- Max queue size: 50 patches (practical limit before suggesting page reload)

---

## 4. Section-Level Conflict Detection

**Decision**: Use timestamp-based last-saved-wins at the section level. Each patch carries a `timestamp`. The server compares incoming patch timestamp against the current resume section's `updated_at`. If the server's version is newer, the patch is rejected with a `409 Conflict` response containing the current state.

**Rationale**: Section-level granularity balances UX (no unnecessary conflicts) with implementation simplicity. Timestamp ordering is reliable given a single server.

**Alternatives considered**:
- Field-level — too complex for initial implementation; high conflict surface
- Operational Transform (OT) — overkill; not a collaborative editing scenario
- CRDT — unnecessary complexity; only one user edits at a time

**Pattern**:
- Patch → Server receives → Compare `patch.timestamp` vs `section.updated_at`
- If patch is newer or equal → apply, broadcast to all connections, return `200 OK`
- If patch is older → return `409` with `{ currentState, conflictSection }`
- Client shows conflict indicator (yellow banner on that widget) with option to reload
- UI: conflict indicator is a small yellow bar at the top of the affected widget with "Updated elsewhere — [Reload]" link

---

## 5. Observability for Sync System

**Decision**: Expose sync metrics via a middleware that counts operations. On the frontend, log connection state transitions and patch events to console in development; in production, expose to application-level error reporting.

**Rationale**: FR-011 requires "counters for operations/sec, failure rate, and latency plus connection state logging." A lightweight approach avoids over-engineering.

**Pattern**:
- Backend: `SyncMetrics` class with `Counter` for patches-sent, patches-received, conflicts, errors; exposed via `GET /api/v1/metrics/sync` (admin-only)
- Frontend: `SyncLogger` logs connection transitions and errors to console; could be extended to send to Datadog/Sentry in production

---

## Summary

All technical decisions are aligned with the existing constitution and tech stack. No new dependencies required beyond FastAPI's built-in WebSocket support. The architecture follows existing patterns: Zustand stores, service layer, and RESTful API conventions.
