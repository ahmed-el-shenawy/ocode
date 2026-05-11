# Implementation Plan: Frontend Implementation

**Branch**: `005-frontend-implementation` | **Date**: 2026-05-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/005-frontend-implementation/spec.md`

## Summary

Implement the complete Next.js 15 frontend for CraftCV: a resume builder with drag-and-drop studio editor, AI-guided chat for content creation, style customization, template gallery, and user dashboard. The frontend follows a Page → Component → Store/Hook → API Client layered architecture.

## Technical Context

**Language/Version**: TypeScript strict mode 5.7+  
**Primary Dependencies**: Next.js 15 (App Router), Tailwind CSS v3, shadcn/ui, @dnd-kit (core + sortable), TipTap (rich text), Zustand (client state), TanStack Query (server state), Lucide React (icons), Supabase SSR (auth)  
**Storage**: N/A — server state managed via API calls, client state via Zustand  
**Testing**: Vitest + React Testing Library (component/store tests), Playwright (E2E)  
**Target Platform**: Modern desktop web browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application frontend  
**Performance Goals**: <3s initial load, <200ms drag-and-drop visual updates, <500ms style changes  
**Constraints**: Desktop-first layout (letter/A4 page canvas), no offline support in v1  
**Scale/Scope**: Single-user resume editing sessions, no real-time collaboration

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design. — POST-DESIGN: ✅ All gates still pass.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Architecture & Strict Layering | ✅ PASS | Frontend follows Page → Component → Store/Hook → API Client. Zustand for client state only. |
| II. Tech Stack & Code Conventions | ✅ PASS | Next.js 15 App Router, Tailwind CSS v3, TypeScript strict mode. All conventions followed. |
| III. Design Patterns | ✅ PASS | Widget Registry pattern for section rendering. Memento (undo/redo) in Zustand. Store per domain. |
| IV. AI Agent & Content Quality | ✅ PASS | Chat panel integrates with existing AI agent architecture. No violations. |
| V. Testing & Quality Gates | ✅ PASS | Component tests per widget, store tests per Zustand action, Playwright E2E for critical flows. |

**No violations found.** Complexity tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/005-frontend-implementation/
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
│   │   ├── page.tsx
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── templates/
│   │   │       ├── page.tsx
│   │   │       └── [id]/page.tsx
│   │   ├── studio/[resumeId]/page.tsx
│   │   ├── chat/[resumeId]/page.tsx
│   │   └── resume/[resumeId]/preview/page.tsx
│   ├── components/
│   │   ├── ui/          # shadcn components
│   │   ├── layout/
│   │   │   ├── DashboardShell.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── studio/
│   │   │   ├── Canvas.tsx
│   │   │   ├── SectionPicker.tsx
│   │   │   ├── StylePanel.tsx
│   │   │   ├── Widget.tsx
│   │   │   ├── WidgetToolbar.tsx
│   │   │   └── widgets/
│   │   │       ├── HeaderWidget.tsx
│   │   │       ├── SummaryWidget.tsx
│   │   │       ├── ExperienceWidget.tsx
│   │   │       ├── EducationWidget.tsx
│   │   │       ├── SkillsWidget.tsx
│   │   │       ├── ProjectsWidget.tsx
│   │   │       ├── CertificationsWidget.tsx
│   │   │       ├── LanguagesWidget.tsx
│   │   │       └── CustomWidget.tsx
│   │   ├── chat/
│   │   │   ├── ChatPanel.tsx
│   │   │   ├── ChatInput.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── SectionProgress.tsx
│   │   │   └── GuidedFlowIndicator.tsx
│   │   ├── templates/
│   │   │   ├── TemplateCard.tsx
│   │   │   ├── TemplateGrid.tsx
│   │   │   └── TemplatePreview.tsx
│   │   └── resume/
│   │       ├── ResumeListItem.tsx
│   │       └── ResumePreview.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useChat.ts
│   │   ├── useResume.ts
│   │   ├── useStudio.ts
│   │   └── useTemplates.ts
│   ├── stores/
│   │   ├── chat-store.ts
│   │   └── studio-store.ts
│   ├── lib/
│   │   ├── api.ts
│   │   ├── constants.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   ├── types/
│   │   ├── chat.ts
│   │   ├── resume.ts
│   │   └── template.ts
│   └── __tests__/
├── public/
├── components.json     # shadcn config
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── Dockerfile
```

**Structure Decision**: Standard Next.js 15 App Router project with route groups for auth/dashboard, feature-based component directories, and separated state management (stores/).

## Complexity Tracking

No constitution violations. Not required.
