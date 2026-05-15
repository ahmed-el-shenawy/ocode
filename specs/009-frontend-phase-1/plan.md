# Implementation Plan: Frontend Phase 1 - Foundation & Data Model

**Branch**: `009-frontend-phase-1` | **Date**: 2026-05-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/009-frontend-phase-1/spec.md`

## Summary

Set up the frontend project foundation: initialize Next.js 15 with TypeScript strict mode, define the complete data model (TypeScript types for Resume, Template, Conversation, Message entities), implement the API communication layer with Supabase auth integration, and configure all development tooling (path aliases, linting, testing framework, shadcn/ui components, environment variables).

## Technical Context

**Language/Version**: TypeScript 5.7+ (strict mode)  
**Primary Dependencies**: Next.js 15 (App Router), React 19, @supabase/ssr (auth), @tanstack/react-query (server state), zustand (client state), tailwindcss v3, shadcn/ui, @dnd-kit (drag-and-drop), @tiptap (rich text), lucide-react (icons)  
**Storage**: N/A — server state managed via TanStack Query to backend API; client UI state via Zustand stores  
**Testing**: Vitest + React Testing Library (unit/component), Playwright (E2E)  
**Target Platform**: Modern desktop web browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application frontend (Next.js App Router)  
**Performance Goals**: Cold production build <30s, HMR <1s, type-check <15s  
**Constraints**: Desktop-first layout (letter/A4 canvas), no offline support in v1  
**Scale/Scope**: Standard professional use — 1-20 resumes per user, 3-12 sections per resume, 1-50 items per section, 100-500 messages per conversation

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design. — POST-DESIGN: All gates still pass.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Architecture & Strict Layering | ✅ PASS | Phase 1 sets up the project skeleton following Page -> Component -> Store/Hook -> API Client layering. No violations introduced. |
| II. Tech Stack & Code Conventions | ✅ PASS | Phase 1 initializes the exact tech stack mandated: Next.js 15 App Router, TypeScript strict mode, Tailwind CSS v3, shadcn/ui, Zustand, TanStack Query. All Naming conventions followed (kebab-case files, camelCase variables, PascalCase types). |
| III. Design Patterns | ✅ PASS | Phase 1 defines types and infrastructure only. Widget Registry and Memento patterns will be implemented in later phases. No violations. |
| IV. AI Agent & Content Quality | ✅ PASS | N/A for infrastructure phase. No AI agent work in scope. |
| V. Testing & Quality Gates | ✅ PASS | Phase 1 includes testing setup (Vitest, Playwright). Quality gates will be enforceable once tests are written in subsequent phases. |

**No violations found.** Complexity tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/009-frontend-phase-1/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (frontend/)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── constants.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   └── types/
│       ├── chat.ts
│       ├── resume.ts
│       └── template.ts
├── .env.local.example
├── components.json     # shadcn config
├── next.config.ts
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── Dockerfile
```

**Structure Decision**: Standard Next.js 15 App Router project with `src/` directory. Types separated by domain (`resume.ts`, `template.ts`, `chat.ts`). Library modules in `lib/` for shared utilities, API client, auth, and constants.

## Complexity Tracking

No constitution violations. Not required.
