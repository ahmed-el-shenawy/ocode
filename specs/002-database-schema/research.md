# Research: Phase 2 - Database Schema

**Phase**: 0 (Research) | **Status**: No unresolved clarifications

## Summary

All technical decisions for Phase 2 database schema are pre-defined by [PLAN.md](../../PLAN.md) Section 2 and the [CraftCV Constitution](../../.specify/memory/constitution.md). No research was required — all choices were confirmed against existing authoritative sources.

## Decisions

### Technology Stack

| Decision | Chosen Value | Rationale | Source |
|----------|-------------|-----------|--------|
| Database engine | PostgreSQL 15+ | Supabase requirement | Constitution §II |
| Schema deployment | Supabase SQL migration file | Direct SQL migration via Supabase dashboard/CLI | PLAN.md §2 |
| Migration management | Alembic (secondary) | Constitution mandates Alembic for local dev schema sync | Constitution §Security |
| Primary keys | UUID with `gen_random_uuid()` | Distributed-friendly, no sequential guessability | PLAN.md §2, Constitution §II |
| Timestamps | TIMESTAMPTZ with `NOW()` | Timezone-aware, constitution requirement | Constitution §Security |
| Auto-update timestamps | `moddatetime` trigger function | PostgreSQL extension for automatic `updated_at` refresh | PLAN.md §2 |
| Flexible content storage | JSONB | Supports dynamic resume sections and template definitions | PLAN.md §2 |
| Deletion strategy | Hard delete with CASCADE | Constitution mandates no soft deletes | Constitution §Security |
| Row-level security | Supabase RLS policies | Constitution mandates RLS on every table | Constitution §Security |

### Alternatives Considered

| Rejected Alternative | Why Rejected |
|---------------------|--------------|
| Auto-increment integer PKs | UUIDs preferred for distributed compatibility and security (no sequential IDs) |
| Soft deletes with `deleted_at` | Constitution explicitly prohibits soft deletes |
| EAV (Entity-Attribute-Value) for resume sections | JSONB provides sufficient flexibility without EAV complexity |
| Single large table for all content | Normalized tables with FKs maintain referential integrity and query performance |
| Timestamp without timezone | TIMESTAMPTZ required for consistent cross-timezone operation |

## Notes

- The `moddatetime` extension must be enabled in Supabase before running migrations
- RLS policies must be created AFTER tables to avoid policy-on-nonexistent-table errors
- Seed data for system templates should be idempotent (can run multiple times safely)
