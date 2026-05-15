# API Contracts: Frontend Phase 1

## Convention

All API endpoints follow RESTful conventions under `/api/v1/`. Request and response bodies use JSON with camelCase keys (transformed from the backend's snake_case by the API client layer).

## Auth

Authentication uses Supabase JWT tokens. The frontend includes the token in the `Authorization: Bearer <token>` header automatically via the api.ts client. Token refresh is handled silently by the Supabase SSR client.

## Endpoints

### Resumes

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/resumes | List user's resumes |
| POST | /api/v1/resumes | Create a new resume from template |
| GET | /api/v1/resumes/{id} | Get resume with content |
| PATCH | /api/v1/resumes/{id} | Update resume metadata or content |
| DELETE | /api/v1/resumes/{id} | Delete a resume |

### Templates

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/v1/templates | List available templates |
| GET | /api/v1/templates/{id} | Get template with definition |

### Conversations

| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/conversations | Create conversation for a resume |
| GET | /api/v1/conversations/{id} | Get conversation with messages |
| POST | /api/v1/conversations/{id}/messages | Send a message |
| PATCH | /api/v1/conversations/{id} | Update conversation mode or progress |

## Error Response Shape

All errors follow a consistent structure:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "One or more fields failed validation",
  "details": {
    "title": ["Title is required"],
    "content": ["Content must have at least one section"]
  },
  "requestId": "req_abc123"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| code | string | Y | Machine-readable error code (e.g., NOT_FOUND, UNAUTHORIZED, VALIDATION_ERROR) |
| message | string | Y | Human-readable error description suitable for UI display |
| details | Record<string, string[]> | N | Per-field validation errors (keyed by field name) |
| requestId | string | Y | Unique request identifier for debugging |

## API Client Interface

The API client (in `src/lib/api.ts`) exposes typed methods:

| Method | Signature | Description |
|--------|-----------|-------------|
| get | get<T>(path, params?) | GET request with query params |
| post | post<T>(path, body) | POST request with JSON body |
| patch | patch<T>(path, body) | PATCH request with JSON body |
| del | del(path) | DELETE request |

All methods:
- Automatically attach auth headers when session exists
- Parse JSON responses to camelCase
- Throw structured errors matching the error contract above
- Support AbortController for request cancellation
