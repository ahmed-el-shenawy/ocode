# Quickstart: Phase 2 - Database Schema

**Last Updated**: 2026-05-10

## Prerequisites

- Supabase project (cloud or local) with PostgreSQL 15+
- Access to Supabase Dashboard SQL Editor or Supabase CLI
- Project environment variables configured (see `backend/.env.example`)

## Schema Deployment

### Option A: Supabase SQL Editor

1. Open your Supabase project Dashboard → SQL Editor
2. Copy the contents of `backend/supabase/migrations/00001_initial_schema.sql`
3. Execute the SQL
4. Verify all 5 tables, 8 indexes, and 4 triggers are created
5. Copy and execute `backend/supabase/seed.sql` to insert system templates

### Option B: Supabase CLI

```bash
supabase db push  # Applies all migration files
supabase db seed  # Applies seed.sql
```

## Verification

After deployment, verify the schema:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT relname, relrowsecurity FROM pg_class 
WHERE relkind = 'r' AND relnamespace = 'public'::regnamespace;

-- Check seed templates exist
SELECT id, name, is_public FROM templates;
```

## Migration Management

New schema changes follow Alembic conventions:

```bash
cd backend
alembic revision --autogenerate -m "description"
alembic upgrade head
```

See [plan.md](plan.md) for complete entity definitions and relationships.
