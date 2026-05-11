# Quickstart: Backend Implementation

This guide covers running and testing the CraftCV backend API.

## Prerequisites

- Python 3.12+
- Docker (for Supabase local instance)
- Node.js 18+ (for Playwright browsers)

## Setup

```bash
# Install dependencies
cd craftcv/backend
pip install -e ".[dev]"

# Install Playwright browsers
playwright install chromium

# Copy environment config
cp .env.example .env
# Edit .env with your Supabase credentials and LLM API keys

# Run database migrations
alembic upgrade head

# Seed initial data (public templates)
python -m app.seed
```

## Running

```bash
# Start the development server
uvicorn app.main:app --reload --port 8000

# API docs available at http://localhost:8000/docs
```

## Testing the API

### 1. Auth Flow

```bash
# Sign up
curl -X POST http://localhost:8000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Sign in
curl -X POST http://localhost:8000/api/v1/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
# → Save the access_token from the response
```

### 2. Resume CRUD

```bash
TOKEN="your-access-token"

# List resumes
curl -H "Authorization: Bearer $TOKEN" http://localhost:8000/api/v1/resumes/

# Create resume from template
curl -X POST http://localhost:8000/api/v1/resumes/ \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"template_id": "template-uuid", "title": "My Resume"}'

# Update resume content
curl -X PATCH http://localhost:8000/api/v1/resumes/{resume_id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "complete"}'
```

### 3. AI Chat

```bash
# Start conversation
curl -X POST http://localhost:8000/api/v1/chat/conversation/{resume_id} \
  -H "Authorization: Bearer $TOKEN"

# Send a message
curl -X POST http://localhost:8000/api/v1/chat/message/{conversation_id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "I am a software engineer with 5 years of experience"}'
```

### 4. PDF Download

```bash
curl -o resume.pdf \
  -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/resumes/{resume_id}/pdf
```

## Running Tests

```bash
# All tests
pytest

# With coverage
pytest --cov=app --cov-report=term-missing

# Specific test file
pytest tests/test_auth.py -v
```

## Key Behaviors

| Behavior | Detail |
|----------|--------|
| **Rate limiting** | Auth endpoints limited to 5 req/min per IP |
| **Optimistic locking** | Resume PATCH returns 409 if `updated_at` is stale |
| **Data isolation** | Users can only access their own resumes and custom templates |
| **AI fallback** | gpt-4o → claude-sonnet → gemini-pro → local Ollama |
| **PDF generation** | On-demand, no caching, timeout after 30s |
| **Logging** | All requests logged with correlation ID, method, path, status, duration |
