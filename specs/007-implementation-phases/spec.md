# Feature Specification: Implementation Phases - Chat & Studio Integration

**Feature Branch**: `007-implementation-phases`
**Created**: 2026-05-11
**Status**: Draft
**Input**: User description: "section 7 only from ocode/PLAN.md"

## Clarifications

### Session 2026-05-11

- Q: What's the primary sync mechanism for the initial implementation? → A: WebSocket as primary, polling fallback at 3s intervals
- Q: At what granularity should the system detect conflicting edits between chat and studio? → A: Section-level
- Q: How should incremental resume updates be structured for sync? → A: `{ sectionId, fields: { key: value }, source: "chat" | "studio", timestamp }`
- Q: What should happen when the backend chat API is unreachable during a studio session? → A: Degraded mode: studio editable with banner, chat disabled
- Q: What minimal logging/metrics should the sync system expose? → A: Sync-specific counters (ops/sec, failure rate, latency) + connection state logging

## User Scenarios & Testing

### User Story 1 - Chat-to-Studio Content Sync (Priority: P1)

As a user editing their resume in the studio, when the AI chat assistant generates or modifies resume content, the studio canvas updates in real-time without requiring a manual page refresh.

**Why this priority**: This is the core integration that bridges the two main editing interfaces. Without it, users must manually switch between chat and studio to see changes, breaking the workflow.

**Independent Test**: Open a resume in studio mode, use the chat panel to add experience content, and verify the canvas updates within 2 seconds without page reload.

**Acceptance Scenarios**:

1. **Given** a resume is open in studio mode with the chat panel visible, **When** the AI assistant generates new content for a section (e.g., experience entry), **Then** the studio canvas updates that section within 2 seconds
2. **Given** the user modifies content via a widget in the canvas, **When** the chat panel is open, **Then** the chat context reflects the updated resume state on next message
3. **Given** the user applies AI-suggested improvements via chat, **When** the improvements are accepted, **Then** the canvas renders the updated content without losing undo/redo history

---

### User Story 2 - Real-Time Content Bidirectional Sync (Priority: P2)

As a user, changes made in the studio widgets are immediately available in the AI chat context, and AI-generated content can be accepted/rejected in the studio with clear visual feedback.

**Why this priority**: Bidirectional sync ensures both editing modes remain consistent, preventing data loss or conflicting edits.

**Independent Test**: Make a change in a studio widget, then send a message in chat and verify the chat assistant references the updated content. Then accept a chat suggestion and verify the widget reflects it.

**Acceptance Scenarios**:

1. **Given** the user edits a text field in a studio widget, **When** they send a chat message referencing that field, **Then** the AI correctly references the updated value
2. **Given** AI generates suggested improvements in chat, **When** the user clicks "Apply to Resume", **Then** the widget content updates and the change appears in the undo history
3. **Given** AI generates suggested improvements, **When** the user clicks "Discard", **Then** no changes are made to the resume content

---

### User Story 3 - Chat Panel Embedded in Studio View (Priority: P2)

As a user, the AI chat panel is accessible directly within the studio page as a split view, eliminating the need to navigate to a separate chat page.

**Why this priority**: Embedded chat enables seamless switching between manual editing and AI-assisted editing, which is the core value proposition of the integration.

**Independent Test**: Navigate to a resume's studio page and verify the chat panel is visible as a side panel without navigating to a separate URL.

**Acceptance Scenarios**:

1. **Given** a user is on the studio page for a resume, **When** the page loads, **Then** a chat panel is visible on the right side (configurable width)
2. **Given** the chat panel is open, **When** the user resizes the panel, **Then** both the canvas and chat panel adjust responsively
3. **Given** the chat panel is visible, **When** the user types a message, **Then** the response streams in real-time within the panel

---

### Edge Cases

- What happens when the user makes conflicting edits in both chat and studio simultaneously? The last-saved-wins approach at the section level with a conflict indicator
- How does the system handle network interruptions during sync? Queues pending updates and retries with exponential backoff, showing a connection status indicator
- What happens when the resume is deleted while the studio is open? Graceful error handling with a user-friendly message and redirect to dashboard
- How does undo/redo interact with AI-generated content changes? AI-applied changes create a single undo entry, just like manual edits
- What happens when the backend chat API is unreachable during a studio session? Degraded mode: studio remains fully editable with a banner displayed; chat features are disabled until connection is restored

## Requirements

### Functional Requirements

- **FR-001**: Studio page MUST embed the AI chat panel as a resizable split view alongside the canvas
- **FR-002**: AI-generated content accepted from chat MUST update the studio canvas within 2 seconds
- **FR-003**: Studio widget edits MUST be reflected in the chat context on the next AI message
- **FR-004**: System MUST use WebSocket as the primary real-time content synchronization mechanism, with 3-second polling as a fallback when WebSocket is unavailable
- **FR-005**: Users MUST be able to accept or reject AI-suggested content changes with clear visual feedback
- **FR-006**: Undo/redo history MUST remain intact after AI-applied content changes
- **FR-007**: System MUST detect and handle conflicting edits between chat and studio at the section level, showing a conflict indicator
- **FR-008**: System MUST display a connection status indicator when real-time sync is active
- **FR-009**: Network interruptions during sync MUST queue pending updates and retry with exponential backoff, showing a connection status indicator; chat API unreachability MUST enter degraded mode with studio editable and a banner displayed
- **FR-010**: Deletion of a resume while studio is open MUST show a clear error message and redirect to dashboard
- **FR-011**: Sync system MUST expose counters for operations/sec, failure rate, and latency, plus connection state logging for diagnostics

### Key Entities

- **Studio Session**: Tracks the current resume being edited, connection state, and pending sync operations
- **Sync Queue**: Ordered list of pending content updates to be applied between chat and studio
- **Connection State**: Current status of the real-time sync connection (connected, reconnecting, disconnected)
- **Content Patch**: Incremental update to resume content sections, carrying source information (chat vs. studio). Format: `{ sectionId, fields: { key: value }, source: "chat" | "studio", timestamp }`

## Success Criteria

### Measurable Outcomes

- **SC-001**: Chat-to-studio content updates are reflected on the canvas within 2 seconds in 95% of cases
- **SC-002**: Studio-to-chat context sync completes within 1 second of a widget edit
- **SC-003**: Users can complete a full resume edit session without manual page refreshes to sync content
- **SC-004**: Failed sync operations auto-recover within 10 seconds without user intervention
- **SC-005**: Chat panel embedded in studio loads within 3 seconds of studio page navigation

## Assumptions

- Existing Zustand stores (chat-store, studio-store) will be extended rather than replaced
- The backend chat API already supports returning structured resume updates alongside message responses
- WebSocket is the primary sync mechanism; polling at 3-second intervals serves as fallback when WebSocket is unavailable
- Users have stable network connectivity during editing sessions
- The existing undo/redo implementation in studio-store can be extended to include AI-applied changes
- Mobile/responsive layout for the split view is handled in a separate polish phase
