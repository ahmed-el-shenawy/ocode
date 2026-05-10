# Quickstart: Phase 1 - Monorepo Directory Structure

**Last Updated**: 2026-05-10

## Prerequisites

- Python 3.12+
- Node.js 18+
- npm
- Docker & Docker Compose (optional, for containerized development)

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url> craftcv
cd craftcv
```

### 2. Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -e ".[dev]"
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Verify Structure

Check that the directory tree matches [PLAN.md Section 1](../../PLAN.md).

### 5. Run (Development)

```bash
# From repository root — start both services
docker-compose up

# Or run individually:

# Backend only
cd backend
uvicorn app.main:app --reload

# Frontend only
cd frontend
npm run dev
```

### Common Commands (via Makefile)

```bash
make install    # Install all dependencies (backend + frontend)
make dev        # Start both dev servers
make test       # Run all tests
make build      # Build for production
make clean      # Clean generated files
```

## Project Layout

```
backend/     — FastAPI Python API server
frontend/    — Next.js 15 TypeScript frontend
```

See [plan.md](plan.md) for the complete directory tree.
