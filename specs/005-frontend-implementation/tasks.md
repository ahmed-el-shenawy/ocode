# Tasks: Frontend Implementation

**Input**: Design documents from `specs/005-frontend-implementation/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No test tasks included — tests not requested in spec.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` for source, `frontend/` for config files
- Paths shown below assume the `craftcv/frontend/` prefix

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependency installation, configuration

- [X] T001 Initialize frontend project with Next.js 15, TypeScript strict mode, React 19
- [X] T002 [P] Install all dependencies: @supabase/ssr, @dnd-kit/core+sortable+utilities, @tiptap/react+starter-kit, zustand, @tanstack/react-query, lucide-react, tailwind-merge, class-variance-authority, date-fns, sonner, radix-ui components
- [X] T003 [P] Install dev dependencies: typescript, @types/react, @types/node, eslint-config-next, tailwindcss, postcss, autoprefixer, @tailwindcss/typography
- [X] T004 Configure tailwind.config.ts with content paths and typography plugin
- [X] T005 Configure tsconfig.json with strict mode and path aliases (`@/` mapping)
- [X] T006 Create .env.local.example with NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_API_URL
- [X] T007 [P] Initialize shadcn/ui components (button, card, input, label, dialog, dropdown-menu, tabs, select, slider, switch)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Create Supabase SSR client in frontend/src/lib/supabase.ts using createBrowserClient from @supabase/ssr
- [X] T009 Create API client in frontend/src/lib/api.ts with auth header injection, typed generic methods (get/post/patch/delete), and error handling
- [X] T010 [P] Define Template types in frontend/src/types/template.ts (TemplateField, SectionDefinition, LayoutDefinition, TemplateDefinition, Template)
- [X] T011 [P] Define Resume types in frontend/src/types/resume.ts (SectionItemData, ResumeContent, Resume, WidgetState)
- [X] T012 [P] Define Chat types in frontend/src/types/chat.ts (Message, Conversation, SectionProgress)
- [X] T013 [P] Create lib/utils.ts with cn() helper using clsx + tailwind-merge
- [X] T014 [P] Create lib/constants.ts with app-wide constants
- [X] T015 Create RootLayout in frontend/src/app/layout.tsx with Inter font, Metadata, and globals.css import
- [X] T016 Create globals.css in frontend/src/app/globals.css with Tailwind directives and shadcn CSS variable theming
- [X] T017 Create auth hook in frontend/src/hooks/useAuth.ts with Supabase session management and auth state change listener

**Checkpoint**: Foundation ready — auth, API client, types, layout, and utilities all in place

---

## Phase 3: User Story 1 - Browse templates and create resume (Priority: P1) 🎯 MVP

**Goal**: Users can browse templates, create new resumes, and see their resume collection on the dashboard

**Independent Test**: Open the app, browse available templates in the gallery, select one, create a resume, and verify it appears in the dashboard list

### Implementation for User Story 1

- [X] T018 [P] [US1] Create TemplateCard component in frontend/src/components/templates/TemplateCard.tsx
- [X] T019 [P] [US1] Create TemplateGrid component in frontend/src/components/templates/TemplateGrid.tsx
- [X] T020 [P] [US1] Create TemplatePreview component in frontend/src/components/templates/TemplatePreview.tsx
- [X] T021 [P] [US1] Create ResumeListItem component in frontend/src/components/resume/ResumeListItem.tsx
- [X] T022 [US1] Create useTemplates hook in frontend/src/hooks/useTemplates.ts for fetching public templates
- [X] T023 [US1] Create useResume hook in frontend/src/hooks/useResume.ts for listing and creating resumes
- [X] T024 [US1] Create templates listing page in frontend/src/app/(dashboard)/templates/page.tsx with TemplateGrid
- [X] T025 [US1] Create template detail page in frontend/src/app/(dashboard)/templates/[id]/page.tsx with TemplatePreview and "Use Template" button
- [X] T026 [US1] Create DashboardShell layout component in frontend/src/components/layout/DashboardShell.tsx
- [X] T027 [P] [US1] Create Navbar component in frontend/src/components/layout/Navbar.tsx
- [X] T028 [P] [US1] Create Sidebar component in frontend/src/components/layout/Sidebar.tsx
- [X] T029 [US1] Create dashboard layout in frontend/src/app/(dashboard)/layout.tsx with DashboardShell
- [X] T030 [US1] Create dashboard page in frontend/src/app/(dashboard)/page.tsx with resume list, loading skeleton, empty state, and "New Resume" CTA
- [X] T031 [US1] Wire resume creation flow: template selection → create via API → redirect to studio

**Checkpoint**: User can browse templates, create a resume, and see it on the dashboard

---

## Phase 4: User Story 2 - Edit resume in studio editor (Priority: P1)

**Goal**: Users can drag-and-drop reorder sections, edit content, and undo/redo changes in a visual studio

**Independent Test**: Open a resume in the studio, drag a section to reorder, edit content fields, undo the change, and save — all changes persist on reload

### Implementation for User Story 2

- [X] T032 [US2] Create Zustand studio store in frontend/src/stores/studio-store.ts with widgets, selection, global styles, history stack, and undo/redo actions
- [X] T033 [P] [US2] Create Canvas component in frontend/src/components/studio/Canvas.tsx with DndContext, SortableContext, and pointer sensor
- [X] T034 [P] [US2] Create Widget component in frontend/src/components/studio/Widget.tsx with useSortable, drag handle, delete button, and section type registry
- [X] T035 [P] [US2] Create WidgetToolbar component in frontend/src/components/studio/WidgetToolbar.tsx
- [X] T036 [P] [US2] Create SectionPicker component in frontend/src/components/studio/SectionPicker.tsx for adding new sections
- [X] T037 [P] [US2] Create HeaderWidget in frontend/src/components/studio/widgets/HeaderWidget.tsx (name, headline, email, phone, location display)
- [X] T038 [P] [US2] Create SummaryWidget in frontend/src/components/studio/widgets/SummaryWidget.tsx (rich text summary field)
- [X] T039 [P] [US2] Create ExperienceWidget in frontend/src/components/studio/widgets/ExperienceWidget.tsx (company, position, dates, bullets)
- [X] T040 [P] [US2] Create EducationWidget in frontend/src/components/studio/widgets/EducationWidget.tsx (institution, degree, field, dates, GPA)
- [X] T041 [P] [US2] Create SkillsWidget in frontend/src/components/studio/widgets/SkillsWidget.tsx (category + tags layout)
- [X] T042 [P] [US2] Create ProjectsWidget in frontend/src/components/studio/widgets/ProjectsWidget.tsx (title, link, bullets)
- [X] T043 [P] [US2] Create CertificationsWidget in frontend/src/components/studio/widgets/CertificationsWidget.tsx (name, issuer, date, link)
- [X] T044 [P] [US2] Create LanguagesWidget in frontend/src/components/studio/widgets/LanguagesWidget.tsx (language + proficiency select)
- [X] T045 [P] [US2] Create CustomWidget in frontend/src/components/studio/widgets/CustomWidget.tsx (title + richtext content)
- [X] T046 [US2] Create useStudio hook in frontend/src/hooks/useStudio.ts for loading/saving resume data
- [X] T047 [US2] Create studio page in frontend/src/app/studio/[resumeId]/page.tsx with toolbar (undo/redo/save), Canvas, and StylePanel
- [X] T048 [US2] Wire save flow: serialize widgets → build sections payload → PATCH /resumes/{id}

**Checkpoint**: User can edit resume content, reorder sections, undo/redo, and save in the studio

---

## Phase 5: User Story 3 - Build resume through AI chat (Priority: P2)

**Goal**: Users can get AI-guided assistance to fill resume content section by section

**Independent Test**: Open a resume, start a chat conversation, send a message about work experience, and receive AI-formatted bullet points

### Implementation for User Story 3

- [X] T049 [US3] Create Zustand chat store in frontend/src/stores/chat-store.ts with messages, conversation state, mode, and progress tracking
- [X] T050 [P] [US3] Create MessageBubble component in frontend/src/components/chat/MessageBubble.tsx (user/assistant/system variants with timestamps)
- [X] T051 [P] [US3] Create ChatInput component in frontend/src/components/chat/ChatInput.tsx with text input, send button, and web search button
- [X] T052 [P] [US3] Create SectionProgress component in frontend/src/components/chat/SectionProgress.tsx with visual section completion indicators
- [X] T053 [P] [US3] Create QuickActions component in frontend/src/components/chat/QuickActions.tsx with preset action buttons
- [X] T054 [P] [US3] Create GuidedFlowIndicator component in frontend/src/components/chat/GuidedFlowIndicator.tsx showing current guided step
- [X] T055 [US3] Create ChatPanel component in frontend/src/components/chat/ChatPanel.tsx with header (mode toggle, title), message list, progress, quick actions, and input area
- [X] T056 [US3] Create useChat hook in frontend/src/hooks/useChat.ts for conversation lifecycle and message sending
- [X] T057 [US3] Create chat page in frontend/src/app/chat/[resumeId]/page.tsx with ChatPanel
- [X] T058 [US3] Wire chat API: POST /chat/conversation/{resume_id} for start, POST /chat/message/{conversation_id} for send, POST /chat/switch-mode/{conversation_id}

**Checkpoint**: User can start a chat session, send messages, receive AI responses, and switch between guided and free mode

---

## Phase 6: User Story 4 - Customize resume appearance (Priority: P2)

**Goal**: Users can change resume visual styles — colors, fonts, margins, and section-specific appearance

**Independent Test**: Open a resume in the studio, change the primary color and heading font, verify the preview updates immediately

### Implementation for User Story 4

- [X] T059 [P] [US4] Create StylePanel component in frontend/src/components/studio/StylePanel.tsx with global style controls (primary color, heading font, body font, margins) and widget-specific controls (padding, background)
- [X] T060 [US4] Integrate StylePanel into studio page layout as right sidebar
- [X] T061 [US4] Wire global style save: include styles in PATCH /resumes/{id} payload
- [X] T062 [US4] Ensure all widget components respect global style overrides (colors, fonts) passed via props or store

**Checkpoint**: User can customize resume colors, fonts, margins, and section-level padding/background

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, loading states, empty states, edge cases, and quality assurance

- [X] T063 Add loading skeleton states for all data-fetching pages (dashboard, templates, studio)
- [X] T064 Add error boundaries for studio, chat, and dashboard sections
- [X] T065 Add unsaved changes warning when navigating away from studio
- [X] T066 Add session expiry detection and re-authentication prompt
- [X] T067 Add empty state for template gallery (no templates available)
- [X] T068 Add error state for API failures with retry option on all data-fetching components
- [X] T069 Add content overflow handling for long resume content sections
- [X] T070 Ensure consistent loading/error/empty states across all auth pages (login, signup, reset-password)
- [X] T071 Verify all Edge Cases from spec.md are handled (API unreachable, unsaved changes, session expiry, long content)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US1 - Browse templates (Phase 3)**: Depends on Foundational — independent of other stories
- **US2 - Studio editor (Phase 4)**: Depends on Foundational — requires US1 (resume creation) to have a resume to edit
- **US3 - AI Chat (Phase 5)**: Depends on Foundational + US2 (studio has resume context for AI to work with)
- **US4 - Style panel (Phase 6)**: Depends on Foundational + US2 (style panel is within studio UI)
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: After Foundational — independent entry point
- **US2 (P1)**: After Foundational + US1 — needs resumes to edit
- **US3 (P2)**: After Foundational + US2 — needs studio/editing context for chat integration
- **US4 (P2)**: After Foundational + US2 — embedded within studio UI

### Within Each User Story

- Types before stores
- Stores before components
- Components before pages
- Pages before API wiring
- Core implementation before polish

### Parallel Opportunities

- All Phase 1 Setup tasks marked [P] can run in parallel
- All Phase 2 Foundational tasks marked [P] can run in parallel
- Within US1: TemplateCard, TemplateGrid, TemplatePreview can run in parallel
- Within US2: All widget implementations can run in parallel
- Widget components across all stories can proceed in parallel
- US3 chat components can run in parallel with each other
- US4 style panel is predominantly sequential (single component)

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 → Browse templates and create resume
4. **STOP and VALIDATE**: User can create a resume from a template
5. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Browse & Create) → Test independently → Deploy/Demo (MVP!)
3. Add US2 (Studio Editor) → Test independently → Deploy/Demo
4. Add US3 (AI Chat) → Test independently → Deploy/Demo
5. Add US4 (Style Customization) → Test independently → Deploy/Demo
6. Add Polish → Final quality pass

### Parallel Team Strategy

With multiple developers:
1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (Browse templates)
   - Developer B: US2 widget implementations (can start in parallel)
3. After US1:
   - Developer A: US3 (AI Chat)
   - Developer B: US4 (Style Panel)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
