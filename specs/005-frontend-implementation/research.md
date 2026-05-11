# Research: Frontend Implementation

## Technology Decisions

### Framework: Next.js 15 (App Router)
- **Decision**: Next.js 15 App Router with React 19
- **Rationale**: Server components for static pages, client components for interactive studio/chat. File-based routing matches project structure.
- **Alternatives considered**: Vite + React Router (no SSR), Remix (smaller ecosystem)

### Styling: Tailwind CSS v3 + shadcn/ui
- **Decision**: Tailwind utility classes + Radix UI primitives via shadcn/ui
- **Rationale**: Constitution mandate. Consistent with backend team styling. No CSS-in-JS overhead.
- **Alternatives considered**: Styled Components, CSS Modules, vanilla CSS

### State Management: Zustand + TanStack Query
- **Decision**: Zustand for client-side state (studio editor, chat UI), TanStack Query for server state (resume CRUD, templates, auth)
- **Rationale**: Zustand is minimal and performs well for local UI state. TanStack Query handles caching/refetching for API data. Constitution mandate.
- **Alternatives considered**: Redux (too verbose), Jotai (less ecosystem), SWR (less flexible than TanStack Query)

### Drag & Drop: @dnd-kit
- **Decision**: @dnd-kit core + sortable preset
- **Rationale**: Constitution mandate. Lightweight, accessible, works with React 19.
- **Alternatives considered**: react-beautiful-dnd (unmaintained), react-dnd (more complex API)

### Rich Text: TipTap
- **Decision**: TipTap (Prosemirror wrapper) for summary/description fields
- **Rationale**: Constitution mandate. Extensible, collaborative-ready for future.
- **Alternatives considered**: Quill (less React-friendly), Slate (lower level)

### Auth: Supabase SSR
- **Decision**: @supabase/ssr createBrowserClient + server-side session handling
- **Rationale**: Constitution mandate. Works with Next.js App Router. JWT-based.
- **Alternatives considered**: NextAuth.js (additional dependency), Clerk (paid)

### Icons: Lucide React
- **Decision**: Lucide React for all UI icons
- **Rationale**: Constitution mandate. Lightweight, tree-shakeable, consistent style.
- **Alternatives considered**: Heroicons (fewer icons), Phosphor (larger bundle)

## Pattern Decisions

### Studio Widget Registry
- **Decision**: Map of section type → React component (`Record<string, React.ComponentType>`)
- **Rationale**: Adding new section types requires only a new entry in the map. No switch/if-else chains. Constitution mandate.
- **Alternatives considered**: Dynamic component loading, switch statement per section type

### Undo/Redo via Memento
- **Decision**: Zustand store maintains history stack. Every mutation pushes state snapshot before changing.
- **Rationale**: Simple to implement, works with Zustand's immer-free approach. Constitution mandate.
- **Alternatives considered**: useUndo hook (too coupled), command pattern (overkill)

### API Client Pattern
- **Decision**: Centralized api object with auth header injection, typed generic methods
- **Rationale**: Consistent error handling, single auth header source, type-safe responses.
- **Alternatives considered**: Generated SDK from OpenAPI (maintenance overhead), per-page fetch calls (duplicated logic)
