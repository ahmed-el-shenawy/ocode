# Data Model: Chat & Studio Integration

## Overview

Entities for the bidirectional sync system between studio canvas and AI chat panel. No new database tables — all entities are in-memory or ephemeral.

---

## Entity: ContentPatch

Represents an incremental update to a resume section, flowing between chat and studio.

| Field | Type | Description |
|-------|------|-------------|
| sectionId | `string` (UUID) | ID of the resume section being patched |
| fields | `Record<string, any>` | Key-value map of changed fields |
| source | `"chat" \| "studio"` | Origin of the patch |
| timestamp | `string` (ISO 8601) | Client-side timestamp of the edit |
| patchId | `string` (UUID) | Unique ID for idempotent processing |

**Constraints**:
- `sectionId` MUST reference an existing resume section
- `fields` MUST contain at least one key
- `timestamp` MUST be UTC

---

## Entity: SyncSession

Represents an active WebSocket connection for a specific resume. Managed in-memory by the backend `SyncService`.

| Field | Type | Description |
|-------|------|-------------|
| resumeId | `string` (UUID) | Resume being edited |
| connections | `List[WebSocket]` | Active WebSocket connections for this resume |
| lastHeartbeat | `datetime` | Timestamp of last ping from each connection |

**State transitions**:

```text
[Initialized] → [Active] (on first connection)
[Active] → [Empty] (all connections dropped → cleanup)
```

---

## Entity: PatchQueue

In-memory queue on the frontend holding outbound patches awaiting server acknowledgment.

| Field | Type | Description |
|-------|------|-------------|
| patches | `ContentPatch[]` | Ordered list of pending patches |
| retryCount | `number` | Current retry attempt (max 5) |
| state | `"idle" \| "sending" \| "backoff" \| "failed"` | Current queue state |

**State transitions**:

```text
[idle] → [sending] (patch dispatched)
[sending] → [idle] (ack received)
[sending] → [backoff] (nack or timeout, retryCount < 5)
[backoff] → [sending] (retry after delay)
[sending] → [failed] (max retries exceeded)
[failed] → [idle] (user dismisses or reconnects)
```

---

## Entity: SyncState

Reactive state in the frontend Zustand `studio-store` tracking sync health.

| Field | Type | Description |
|-------|------|-------------|
| connectionStatus | `"connected" \| "connecting" \| "reconnecting" \| "disconnected" \| "fallback-polling"` | Current sync status |
| lastSyncAt | `datetime \| null` | Timestamp of last successful sync |
| pendingPatches | `number` | Count of unacknowledged patches |
| conflictSectionId | `string \| null` | Section ID with active conflict |
| isDegraded | `boolean` | Whether in degraded mode (chat disabled) |

---

## Relationships

```text
Resume (existing)
  ├── 1..* Sections (existing)
  │       └── updated_at (used for conflict comparison)
  │
  └── 0..* SyncSessions (in-memory)
          └── 0..* ContentPatches (in-flight)

ChatPanel (frontend component)
  └── emits ContentPatches → SyncSession (via WebSocket)

StudioCanvas (frontend component)
  └── emits ContentPatches → SyncSession (via WebSocket)
  └── subscribes to SyncState → updates widgets
```
