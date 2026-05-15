# Implementation Plan: Visual Polish & Micro-interactions

**Branch**: `010-frontend-phase-2` | **Date**: 2026-05-15 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-frontend-phase-2/spec.md`

## Summary

Add loading states (skeleton loaders, page transitions, button spinners), empty states (illustrated placeholders for dashboard/templates/chat/sections), error states (toast notifications via sonner, inline form validation, offline banner, error boundaries), and micro-interactions (hover effects on buttons/cards, input focus rings, sidebar active indicator, widget selection transitions) across the CraftCV frontend. All frontend-only — no backend changes.

## Technical Context

**Language/Version**: TypeScript strict, Next.js 15 App Router  
**Primary Dependencies**: sonner ^1.7.0 (toast), Tailwind CSS v3 (animations/styling), lucide-react (icons), clsx + tailwind-merge (cn utility)  
**Storage**: N/A  
**Testing**: Vitest + React Testing Library for new UI components, existing Playwright E2E for regression  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (Next.js 15 App Router)  
**Performance Goals**: Animations at 60fps, no forced layout on hover/transitions  
**Constraints**: All motion must respect `prefers-reduced-motion`; no new JS animation libraries (CSS-only)  
**Scale/Scope**: Frontend presentation layer only — 4 new UI components, ~15 file modifications

## Constitution Check

*GATE: Passed before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| I. Architecture & Layering | PASS | Page → Component → Hook pattern unchanged |
| II. Tech Stack & Conventions | PASS | Uses existing deps (sonner, Tailwind, lucide-react) |
| III. Design Patterns | PASS | New UI components follow existing component patterns |
| IV. AI Agent | N/A | No AI/agent changes in this feature |
| V. Testing & Quality Gates | PASS | Component tests for new UI components required |

## Project Structure

### Documentation (this feature)

```text
specs/010-frontend-phase-2/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # (/speckit.tasks output - not created here)
```

### Source Code (repository root)

```text
craftcv/frontend/src/
├── components/
│   ├── ui/                          # NEW: reusable UI primitives
│   │   ├── Skeleton.tsx
│   │   ├── EmptyState.tsx
│   │   ├── LoadingButton.tsx
│   │   └── Toaster.tsx              # Toaster wrapper for sonner
│   ├── layout/
│   │   ├── DashboardShell.tsx       # MODIFIED: add NetworkBanner
│   │   ├── NetworkBanner.tsx        # NEW: offline/online banner
│   │   └── Sidebar.tsx              # MODIFIED: left border indicator + smooth bg
│   ├── templates/
│   │   └── TemplateCard.tsx         # MODIFIED: hover lift + border effect
│   ├── resume/
│   │   └── ResumeListItem.tsx       # MODIFIED: hover lift + border effect
│   ├── studio/
│   │   ├── Canvas.tsx               # MODIFIED: loading skeleton + empty state
│   │   ├── Widget.tsx               # MODIFIED: smooth border transition
│   │   └── SectionPicker.tsx        # MODIFIED: "all sections added" state
│   └── chat/
│       ├── ChatPanel.tsx            # MODIFIED: empty state for no messages
│       └── ChatInput.tsx            # MODIFIED: enhanced input focus
├── app/
│   ├── layout.tsx                   # MODIFIED: add sonner <Toaster>
│   ├── globals.css                  # MODIFIED: fade-in keyframes
│   ├── (auth)/login/page.tsx        # MODIFIED: inline validation + focus rings
│   ├── (auth)/signup/page.tsx       # MODIFIED: inline validation + focus rings
│   ├── dashboard/
│   │   ├── page.tsx                 # MODIFIED: Skeleton + EmptyState
│   │   └── templates/
│   │       ├── page.tsx             # MODIFIED: Skeleton + EmptyState
│   │       └── [id]/page.tsx        # MODIFIED: Skeleton
│   └── studio/[resumeId]/page.tsx   # MODIFIED: loading skeleton
├── tailwind.config.ts               # MODIFIED: fade-in keyframes + animation
```

## Complexity Tracking

> No Constitution violations — complexity tracking not required.

## Implementation Order

Phase 2 items by priority (P1 → P3 per user stories in spec):

1. **P1: Loading States** — Create Skeleton component, add to dashboard/templates/studio pages, add LoadingButton
2. **P1: Error States** — Wire sonner Toaster in root layout, create NetworkBanner, add inline validation to auth forms
3. **P2: Empty States** — Create EmptyState component, add to dashboard/templates/chat/section picker
4. **P3: Micro-interactions** — Add hover effects to buttons/cards, focus rings to inputs, sidebar indicator, widget transitions
