# Feature Specification: Backend Implementation

**Feature Branch**: `004-backend-implementation`  
**Created**: 2026-05-10  
**Status**: Draft  
**Input**: User description: "phase 4 from ocode/PLAN.md only"

## Clarifications

### Session 2026-05-10

- Q: What rate limiting and auth protection should be applied? → A: Moderate — rate-limit auth endpoints only (5 attempts/min per IP), no account lockout.
- Q: What observability should be in place? → A: Full — structured logging on all requests and external service calls; metrics for latency, error rate, and throughput; error tracking on all failures (4xx and 5xx).
- Q: How should concurrent resume edits be resolved? → A: Optimistic locking — last-write-wins with `updated_at` comparison; reject stale writes with 409 Conflict.
- Q: What data retention policy applies to conversations and user data? → A: Indefinite retention — retain until user deletes or account is removed; conversations are buffered and persistent.
- Q: Should PDFs be cached or generated on each download? → A: On-demand — generate fresh PDF per download request; no caching in v1.

## User Scenarios & Testing

### User Story 1 - User registers and authenticates (Priority: P1)

A new user wants to create an account and sign in to the application. They sign up with their email and password, and are able to access their profile and initiate sessions.

**Why this priority**: Authentication is the gateway to all other features. Without authentication, no user-specific data (resumes, templates) can be created or accessed.

**Independent Test**: Can be fully tested by registering a new user, signing in with the same credentials, and receiving a session token. Delivers a working auth flow.

**Acceptance Scenarios**:

1. **Given** a new user with valid email and password, **When** they submit a signup request, **Then** their account is created and they receive a session token.
2. **Given** a registered user, **When** they sign in with correct credentials, **Then** they receive an access token to authenticate subsequent requests.
3. **Given** an authenticated user, **When** they sign out, **Then** their session is invalidated and they can no longer access protected resources.

---

### User Story 2 - User creates and manages resumes (Priority: P1)

An authenticated user wants to create a new resume based on a template, update its content, and manage their collection of resumes.

**Why this priority**: Resume creation is the core value proposition of the application. This story delivers the primary user workflow.

**Independent Test**: Can be fully tested by creating a resume from a template, updating its content and styles, and verifying the resume list shows the changes. Delivers the core resume management capability.

**Acceptance Scenarios**:

1. **Given** an authenticated user with available templates, **When** they create a new resume from a template, **Then** a draft resume is created with initial content matching the template's section structure.
2. **Given** an existing resume, **When** the user updates its content (title, sections, styles), **Then** changes persist and are reflected on retrieval.
3. **Given** a user with multiple resumes, **When** they request their resume list, **Then** all their resumes are returned ordered by most recent.

---

### User Story 3 - User manages templates (Priority: P2)

An authenticated user wants to browse available templates and create custom templates for their resumes.

**Why this priority**: Templates provide the structure and visual foundation for resumes. Access to public templates and the ability to create custom variants enhances the resume creation experience.

**Independent Test**: Can be fully tested by retrieving public templates, creating a custom template, and verifying both appear in the available templates list.

**Acceptance Scenarios**:

1. **Given** a user browsing templates, **When** they request public templates, **Then** all publicly available templates are returned with their definitions and styles.
2. **Given** an authenticated user, **When** they clone a public template, **Then** a new custom template is created linked to their account.
3. **Given** a user with custom templates, **When** they request available templates, **Then** both public templates and their own custom templates are returned.

---

### User Story 4 - User builds resume through AI chat (Priority: P2)

An authenticated user wants to build their resume content through a conversational AI chat interface that guides them through each section.

**Why this priority**: The AI chat differentiates the application from traditional resume builders by providing guided, conversational content creation.

**Independent Test**: Can be fully tested by starting a conversation for a resume, sending a message, and receiving an AI response. Delivers the chat interaction flow.

**Acceptance Scenarios**:

1. **Given** a resume, **When** the user starts a conversation, **Then** a new conversation session is created in guided mode with empty progress tracking.
2. **Given** an ongoing conversation, **When** the user sends a message, **Then** the message is saved and an AI response is generated based on the resume context and conversation history.
3. **Given** a user who prefers free-form interaction, **When** they switch the conversation mode, **Then** the AI adapts its response style accordingly.

---

### User Story 5 - User downloads resume as PDF (Priority: P3)

A user wants to download their completed resume as a PDF file.

**Why this priority**: PDF export is the final delivery mechanism — users need a shareable file format for job applications.

**Independent Test**: Can be fully tested by requesting a PDF download for a completed resume and verifying a PDF file is returned.

**Acceptance Scenarios**:

1. **Given** a completed resume, **When** the user requests a PDF download, **Then** a PDF file is generated and returned to the user.

---

### Edge Cases

- What happens when a user tries to sign up with an already-registered email?
- What happens when a user tries to access another user's resume?
- How does the system handle invalid or expired session tokens?
- What happens when the AI provider is unavailable during a chat session?
- How does the system handle concurrent resume edits? Optimistic locking via `updated_at` — stale writes are rejected with 409 Conflict.
- What happens when PDF generation fails due to rendering issues? The user is notified of the failure and can retry.
- How does the system handle requests with malformed resume content?
- What happens when a template referenced by a resume is deleted?
- What happens when a user exceeds the rate limit on auth endpoints?

## Requirements

### Functional Requirements

- **FR-001**: The system MUST support user registration with email and password.
- **FR-002**: The system MUST support user sign-in with email and password, returning a session access token.
- **FR-003**: The system MUST support user sign-out, invalidating the current session.
- **FR-004**: All API routes (except auth) MUST require a valid session token for access.
- **FR-005**: Users MUST only be able to access their own resumes and custom templates (data isolation).
- **FR-006**: The system MUST allow authenticated users to create a resume from a template, initializing content with empty sections matching the template structure.
- **FR-007**: Users MUST be able to update their resume content, title, styles, and status.
- **FR-008**: Users MUST be able to retrieve a list of their resumes.
- **FR-009**: Users MUST be able to retrieve a single resume by ID.
- **FR-010**: Users MUST be able to delete their own resumes.
- **FR-011**: The system MUST provide a list of public templates available to all users.
- **FR-012**: Authenticated users MUST be able to clone a public template to create their own custom version.
- **FR-013**: Authenticated users MUST be able to retrieve their own custom templates.
- **FR-014**: The system MUST support starting a conversation for a resume, creating a new session if one does not already exist.
- **FR-015**: The system MUST support sending messages within a conversation, saving user messages and generating AI responses using the resume context.
- **FR-016**: Users MUST be able to switch between guided and free-form conversation modes.
- **FR-017**: The system MUST support generating a PDF file for a given resume.
- **FR-018**: The system MUST persist conversations, messages, section progress, and all resume state across sessions.
- **FR-019**: The system MUST handle AI provider failures gracefully, with fallback to alternative providers.
- **FR-020**: Auth endpoints (signup, signin) MUST be rate-limited to 5 attempts per minute per IP address.
- **FR-021**: The system MUST log all API requests and external service calls with method, path, status, duration, and correlation ID.
- **FR-022**: The system MUST capture and report latency, error rate, and throughput metrics for API endpoints.
- **FR-023**: Resume updates MUST use optimistic locking — reject updates if the resource's `updated_at` differs from what the client last read, returning a 409 Conflict response.
- **FR-024**: Conversations and user data MUST be retained indefinitely until the user explicitly deletes them or their account is removed.
- **FR-025**: PDF files MUST be generated on-demand per download request — no caching or persistent storage of generated PDFs in v1.

### Key Entities

- **User Profile**: Represents an authenticated user, linked to Supabase Auth. Stores display name and avatar.
- **Template**: A resume blueprint defining sections, fields, and visual layout. Can be public or user-owned private.
- **Resume**: A user's actual resume document, linked to a template. Contains filled content, custom styles, and a status.
- **Conversation**: An AI chat session associated with a resume. Tracks progress and interaction mode (guided/free).
- **Message**: A single message within a conversation (user, assistant, or system role). Contains text content and optional metadata.

## Success Criteria

### Measurable Outcomes

- **SC-001**: A new user can complete registration and sign in within 30 seconds.
- **SC-002**: Authenticated users can create a new resume from a template in under 5 seconds.
- **SC-003**: The system supports at least 100 concurrent authenticated users without degradation.
- **SC-004**: Chat responses are delivered within 10 seconds for 95% of messages under normal conditions.
- **SC-005**: PDF generation completes in under 30 seconds for resumes with up to 5 sections.

## Assumptions

- User authentication is handled by an external auth provider — no custom auth implementation needed.
- The AI chat uses a multi-provider router with fallback — if the primary AI provider is unavailable, the system falls back to alternative providers automatically.
- PDF rendering uses a headless browser approach for accurate visual output.
- All API routes follow a versioned path convention.
- Resumes start in "draft" status and can be marked "complete" by the user.
- The system targets desktop web browsers as the primary platform.
- Password reset functionality is handled by the auth provider and is out of scope for this backend feature.
