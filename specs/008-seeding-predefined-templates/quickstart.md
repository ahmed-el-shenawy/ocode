# Quickstart: Seed Predefined Templates

## Prerequisites

- Python 3.12+ with `craftcv/backend/` dependencies installed
- Database running (Supabase or local PostgreSQL)
- Environment variables configured (`.env` with `DATABASE_URL`)

## Running the Seed Script

```bash
# From the craftcv/backend/ directory
python -m supabase.seed

# Or with explicit environment
DATABASE_URL=postgresql+asyncpg://... python -m supabase.seed
```

## What It Does

1. Connects to the database using `app.core.database.get_async_session()`
2. For each of 3 templates (Modern Clean, Executive, Creative):
   - Queries for existing template by name (case-insensitive)
   - If found: updates `definition`, `default_styles`, `description`
   - If not found: creates new Template with `user_id=NULL`, `is_public=True`
3. All 3 upserts run in a single transaction
4. Prints summary of what was inserted/updated

## Verification

```bash
# Check templates were seeded
psql -d craftcv -c "SELECT name, is_public, user_id IS NULL as is_system FROM templates;"
```

Expected output:
```
      name      | is_public | is_system
----------------+-----------+-----------
 Modern Clean   | t         | t
 Executive      | t         | t
 Creative       | t         | t
```

## Idempotency

Safe to run multiple times. Running again will update existing templates (useful for definition changes) without creating duplicates.
