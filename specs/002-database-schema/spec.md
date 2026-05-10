# Feature Specification: Phase 2 - Database Schema

**Feature Branch**: `002-database-schema`  
**Created**: 2026-05-10  
**Status**: Draft  
**Input**: User description: "phase 2 from PLAN.md only"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - User Profile Management (Priority: P1)

A user registers for CraftCV and their profile is automatically created and linked to their authentication identity. Profile data is stored persistently and can be updated.

**Why this priority**: The profile is the foundation for all user-specific data — resumes, templates, and conversations all depend on it.

**Independent Test**: Can be fully tested by registering a new user and verifying a profile record is created with the correct auth identity reference, then updating the profile and confirming the change persists.

**Acceptance Scenarios**:

1. **Given** a new user registration, **When** the auth identity is created, **Then** a corresponding profile record is created with a unique ID matching the auth identity
2. **Given** an existing profile, **When** the user updates their full name or avatar, **Then** the profile record reflects the change and the update timestamp is refreshed
3. **Given** a user deletes their account, **When** the auth identity is removed, **Then** the profile record and all associated data are removed

---

### User Story 2 - Resume Template Catalog (Priority: P2)

System-provided resume templates are available to all users, and users can create their own custom templates. Templates define the structure, fields, and default styling for resumes.

**Why this priority**: Templates are the blueprint for all resumes. Users need a starting point to create their resume.

**Independent Test**: Can be fully tested by querying
available templates — system templates should be visible without authentication, user templates require ownership.

**Acceptance Scenarios**:

1. **Given** system templates exist, **When** a user browses the template gallery, **Then** they see all public templates regardless of who created them
2. **Given** a user creates a custom template, **When** they save it, **Then** the template is stored with their user association and default visibility as private
3. **Given** a template is deleted, **When** the owning user is removed, **Then** the template's association is cleared but the template record remains intact

---

### User Story 3 - Resume Storage (Priority: P2)

A user creates a resume based on a template. The resume stores all content and styling independently from the template, allowing full customization.

**Why this priority**: The resume is the primary deliverable of the application. Without persistent resume storage, the application provides no value.

**Independent Test**: Can be fully tested by creating a resume from a template, filling in content, updating styles, and confirming the data persists across sessions.

**Acceptance Scenarios**:

1. **Given** a user selects a template, **When** they create a new resume, **Then** a resume record is created with the template reference and an empty content structure matching the template definition
2. **Given** an existing resume, **When** the user edits content or styles, **Then** the changes are persisted and the update timestamp is refreshed
3. **Given** a resume is completed, **When** the user marks it complete, **Then** the status transitions from "draft" to "complete" and cannot transition back
4. **Given** a resume is deleted, **When** the user confirms deletion, **Then** all associated conversations and messages are also removed

---

### User Story 4 - AI Chat Conversations (Priority: P3)

A user opens an AI-assisted editing session for their resume. The conversation history is stored and associated with the specific resume, supporting both guided step-by-step and free-form chat modes.

**Why this priority**: The AI chat is a differentiating feature. Users benefit from persisted conversation history across sessions.

**Independent Test**: Can be fully tested by starting a conversation for a resume, sending messages, and verifying the message history is retrievable with correct ordering.

**Acceptance Scenarios**:

1. **Given** a user opens chat for a specific resume, **When** a conversation does not already exist, **Then** a new conversation is created in guided mode with empty progress tracking
2. **Given** an active conversation, **When** the user sends a message, **Then** the message is stored with the correct role label (user, assistant, or system) and timestamp
3. **Given** a conversation in guided mode, **When** the user switches to free-form, **Then** the mode updates and remains in the new state for subsequent interactions
4. **Given** a conversation with progress tracking, **When** a section is completed, **Then** the progress state is updated incrementally

---

### Edge Cases

- What happens when a user creates a resume from a template that is later deleted? The template association should be set to null, preserving the resume
- What happens when a user deletes their account? All their profiles, resumes, conversations, and messages should cascade delete
- What happens when a conversation reaches very large message counts?
- How does the system handle concurrent updates to the same resume by the user and the AI agent?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST store user profiles with a unique identifier that directly corresponds to the user's authentication identity
- **FR-002**: Each profile MUST store the user's full name and optional avatar image reference
- **FR-003**: All profile, template, resume, conversation, and message records MUST include immutable creation timestamps and update timestamps that refresh automatically on modification
- **FR-004**: The system MUST support both system-provided (public) and user-created (private by default) resume templates
- **FR-005**: Each template MUST store its structural definition and default styling separately to allow independent customization
- **FR-006**: A template MAY optionally be associated with a user; when the associated user is removed, the template MUST remain but the association MUST be cleared
- **FR-007**: Each resume MUST be associated with exactly one user and MAY optionally reference a template
- **FR-008**: Resumes MUST support a two-state lifecycle: draft (editable) and complete (content finalized)
- **FR-009**: Resumes MUST store content and styles independently from the template, allowing full customization without affecting the original template
- **FR-010**: Each resume MUST support at most one active conversation at a time
- **FR-011**: Conversations MUST support two interaction modes: guided (step-by-step) and free-form, with the ability to switch between them
- **FR-012**: Each conversation MUST track progress through resume sections as a flexible state record
- **FR-013**: Messages MUST be stored in chronological order per conversation with a role label (user, assistant, or system)
- **FR-014**: Each message MAY include metadata for additional context (e.g., tool invocations, section references)
- **FR-015**: Conversations and messages MUST be automatically removed when their parent resume is deleted
- **FR-016**: Messages MUST be automatically removed when their parent conversation is deleted
- **FR-017**: Commonly queried fields (user IDs, template IDs, resume IDs, conversation IDs, message timestamps, public status) MUST be indexed for performant access

### Key Entities

- **Profile**: User identity record linked to authentication — contains display name and avatar, serves as the parent for all user-owned data
- **Template**: Resume blueprint defining available sections, field types, and default visual styling — can be system-provided (public) or user-created (private)
- **Resume**: A user's actual resume based on a template — stores filled content, custom styles, and a lifecycle status (draft → complete)
- **Conversation**: An AI-assisted editing session tied to a single resume — tracks interaction mode and section completion progress
- **Message**: An individual exchange within a conversation — labeled by role (user, assistant, system) with optional metadata for tool usage or section references

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user registration results in a profile record created within 1 second
- **SC-002**: A resume with full content can be retrieved within 500ms for any given user
- **SC-003**: A conversation with 100 messages loads within 1 second
- **SC-004**: Deleting a user account removes all associated data (resumes, conversations, messages) within 5 seconds
- **SC-005**: Template queries for public templates return results in under 200ms regardless of total template count

## Assumptions

- The authentication system is external (Supabase Auth) — profile creation is triggered by auth events or application-level sync
- Timestamps use timezone-aware datetime format
- The application uses hard deletes (no soft deletes or archival) per the project conventions
- The moddatetime extension or equivalent is available for automatic timestamp updates
- UUIDs are the primary key strategy across all tables for distributed compatibility
- Data volume is initially small (hundreds to low thousands of users) — indexes are designed for this scale
- The JSONB content field for resumes follows the structure defined in the template JSON definition format
