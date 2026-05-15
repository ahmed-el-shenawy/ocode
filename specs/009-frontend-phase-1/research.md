# Research: Frontend Phase 1 - Foundation & Data Model

## Technology Decisions

### Framework: Next.js 15 (App Router)
- **Decision**: Next.js 15 App Router with React 19
- **Rationale**: Server components for static pages, client components for interactive features. File-based routing. Constitution mandate.
- **Alternatives considered**: Vite + React Router (no SSR), Remix (smaller ecosystem)

### Styling: Tailwind CSS v3 + shadcn/ui
- **Decision**: Tailwind utility classes + Radix UI primitives via shadcn/ui
- **Rationale**: Constitution mandate. Consistent with backend team styling. No CSS-in-JS overhead.
- **Alternatives considered**: Styled Components, CSS Modules, vanilla CSS

### State Management: Zustand + TanStack Query
- **Decision**: Zustand for client-side state, TanStack Query for server state
- **Rationale**: Zustand is minimal for local UI state. TanStack Query handles caching/refetching for API data. Constitution mandate.
- **Alternatives considered**: Redux (too verbose), Jotai (less ecosystem), SWR (less flexible)

### Auth: Supabase SSR
- **Decision**: @supabase/ssr with createBrowserClient
- **Rationale**: Constitution mandate. Works with Next.js App Router. JWT-based with built-in session refresh.
- **Alternatives considered**: NextAuth.js (additional dependency), Clerk (paid)

### Token/Session Strategy
- **Decision**: Silent background refresh on expiry; if refresh fails, preserve pending writes and prompt re-auth
- **Rationale**: Prevents data loss during editing. Supabase SSR handles refresh automatically via cookie-based session.
- **Alternatives considered**: Redirect to login on 401 (data loss risk), periodic re-auth (poor UX)

### Testing: Vitest + React Testing Library + Playwright
- **Decision**: Vitest for unit/component tests, Playwright for E2E
- **Rationale**: Constitution mandate. Vitest is fast (native ESM, Vite-compatible). Playwright is industry standard for E2E.
- **Alternatives considered**: Jest (slower), Cypress (different API, less developer-friendly)

### Drag & Drop: @dnd-kit
- **Decision**: @dnd-kit core + sortable preset
- **Rationale**: Constitution mandate. Lightweight, accessible, works with React 19.
- **Alternatives considered**: react-beautiful-dnd (unmaintained), react-dnd (more complex API)

### Rich Text: TipTap
- **Decision**: TipTap (Prosemirror wrapper) for rich text content fields
- **Rationale**: Constitution mandate. Extensible, collaborative-ready for future.
- **Alternatives considered**: Quill (less React-friendly), Slate (lower level)

### Icons: Lucide React
- **Decision**: Lucide React for all UI icons
- **Rationale**: Constitution mandate. Lightweight, tree-shakeable, consistent style.
- **Alternatives considered**: Heroicons (fewer icons), Phosphor (larger bundle)

## Data Model Decisions

### Entity Relationships
- **Decision**: Template 1:N Resume, Resume 1:1 Conversation, Conversation 1:N Message, Resume 1:N SectionItemData
- **Rationale**: One active conversation per resume simplifies state management. Sections are embedded in resume content to avoid joins.

### Field Naming Convention
- **Decision**: camelCase in frontend types, mapped to/from snake_case API responses
- **Rationale**: Frontend convention is camelCase for JavaScript/TypeScript. API uses snake_case. Transform layer in api.ts handles mapping.

### Resume Lifecycle
- **Decision**: Three-state lifecycle: draft -> complete -> archived (one-way, no reverse transitions)
- **Rationale**: Simple state machine covers user needs. No soft delete in v1 per constitution. Archive removes from active view without data loss.

### TemplateField Data Types
- **Decision**: text, url, date, boolean, richtext, list, tags, select
- **Rationale**: Covers all resume section field types (experience descriptions need richtext, skills need tags, education needs dates).
- **Alternatives considered**: Single text type for everything (loses semantic meaning), markdown-only (editing complexity)

## API Contract Decisions

### Error Response Shape
- **Decision**: { code: string, message: string, details?: Record<string, string[]>, requestId: string }
- **Rationale**: RFC 7807-inspired. Code enables programmatic handling. Message is user-facing. Details per-field for form validation. Request ID aids debugging.
- **Alternatives considered**: Minimal { error: string } (no structured info), Full RFC 7807 (over-engineered for v1)

### Build Performance Targets
- **Decision**: Cold build <30s, HMR <1s, type-check <15s
- **Rationale**: Standard targets for a Next.js project of this scale. Type-check can be deferred to CI if needed during development.
- **Alternatives considered**: Aggressive targets (<10s build, <300ms HMR) would require build tool optimization beyond v1 scope.
