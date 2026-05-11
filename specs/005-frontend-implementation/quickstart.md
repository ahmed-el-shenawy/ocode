# Quickstart: Frontend

## Prerequisites

- Node.js 20+
- npm or bun

## Setup

```bash
cd frontend
npm install
```

## Environment

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon/public key
- `NEXT_PUBLIC_API_URL` — Backend API URL (default: `http://localhost:8000/api/v1`)

## Development

```bash
npm run dev
```

Starts the Next.js dev server on `http://localhost:3000`.

## Build

```bash
npm run build
```

## Testing

```bash
npm run test        # Vitest unit/component tests
npx playwright test # E2E tests (requires Playwright browsers installed)
```

## Adding shadcn Components

```bash
npx shadcn@latest add button card input label dialog dropdown-menu tabs select slider switch
```

## Project Structure

```
src/
├── app/            # App Router pages
├── components/     # UI components (studio, chat, templates, layout)
├── hooks/          # Custom React hooks
├── lib/            # API client, auth, utilities
├── stores/         # Zustand state stores
├── types/          # TypeScript type definitions
└── __tests__/      # Test files
```
