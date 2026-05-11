# Research: Backend Implementation

## Overview

This feature implements the complete CraftCV backend. All technology and architecture decisions are drawn from the project constitution and the existing PLAN.md Phase 4 specification.

## Decisions

### Decision 1: Authentication via Supabase Auth

- **Decision**: Delegate all authentication to Supabase Auth. Routes call Supabase client SDK — no custom auth logic.
- **Rationale**: Constitution Section Security & Data mandates Supabase Auth for all authentication. JWT verification via FastAPI dependency on every protected route. RLS on every table for data isolation.
- **Alternatives considered**: Custom JWT implementation (rejected — increases audit surface); OAuth-only (rejected — email/password required for minimum viable auth)

### Decision 2: Multi-provider AI router via LiteLLM

- **Decision**: LiteLLM Router with fallback chain: gpt-4o → claude-sonnet → gemini-pro → local Ollama. All AI interactions go through the router.
- **Rationale**: Constitution Section IV mandates LiteLLM Router with specific fallback order. Provides resilience against provider outages without custom failover logic.
- **Alternatives considered**: Single provider (rejected — no fallback); custom router with multiple SDKs (rejected — LiteLLM handles provider abstraction)

### Decision 3: PDF generation via Playwright

- **Decision**: Render resume HTML in a headless Chromium browser via Playwright, capture as PDF on-demand per download request.
- **Rationale**: Constitution Section II lists Playwright for PDF. Headless browser produces pixel-perfect output matching the rendered template. On-demand generation (per clarification) avoids storage complexity.
- **Alternatives considered**: weasyprint (CSS support limitations); ReportLab (requires manual layout code); wkhtmltopdf (deprecated)

### Decision 4: Rate limiting at application layer

- **Decision**: In-memory rate limiting for auth endpoints (5 req/min per IP) via FastAPI middleware. No external rate-limiting service in v1.
- **Rationale**: Per clarification, moderate rate limiting on auth only. In-memory is sufficient for single-region deployment at 100+ concurrent users. Can be swapped for Redis-based limiting if multi-region is needed later.
- **Alternatives considered**: Redis-based (over-engineering for v1); cloud provider API gateway (adds infrastructure dependency)

### Decision 5: Optimistic locking for resume edits

- **Decision**: Compare `updated_at` on write — reject stale updates with HTTP 409. Client responsible for re-fetching and retrying.
- **Rationale**: Per clarification, optimistic locking prevents silent overwrites. Resumes are single-user documents, so contention is rare — optimistic locking is simpler than pessimistic locking.
- **Alternatives considered**: Pessimistic locking (adds lock management complexity for rare contention); last-write-wins (risks data loss)

### Decision 6: Full observability stack

- **Decision**: Structured JSON logging on all requests (method, path, status, duration, correlation ID); error tracking on 4xx and 5xx; custom metrics for latency, error rate, and throughput.
- **Rationale**: Per clarification, full observability is required for debugging a system with multiple external dependencies (Supabase Auth, LLM providers, Playwright).
- **Alternatives considered**: Minimal logging (insufficient for debugging AI/PDF failures); no metrics (blind to degradation)
