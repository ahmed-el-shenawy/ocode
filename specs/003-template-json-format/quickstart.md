# Quickstart: Template JSON Definition Format

This guide covers how template definitions and resume content JSON structures work in CraftCV.

## Core Concepts

- **Template Definition**: A JSON blueprint that defines what sections and fields a resume template has. Stored in `templates.definition` (JSONB).
- **Resume Content**: The filled data that follows a template's structure. Stored in `resumes.content` (JSONB).

## Template Definition Structure

```json
{
  "sections": [
    {
      "id": "header",
      "type": "header",
      "label": "Header",
      "required": true,
      "max_items": 1,
      "fields": {
        "full_name": { "type": "text", "label": "Full Name", "required": true },
        "email": { "type": "text", "label": "Email", "required": true }
      }
    },
    {
      "id": "experience",
      "type": "experience",
      "label": "Experience",
      "min_items": 0,
      "max_items": 5,
      "fields": {
        "company": { "type": "text", "label": "Company", "required": true },
        "position": { "type": "text", "label": "Position" },
        "start_date": { "type": "date", "label": "Start Date" },
        "end_date": { "type": "date", "label": "End Date" },
        "current": { "type": "boolean", "label": "Current Position" },
        "bullets": { "type": "list", "label": "Bullets", "min": 2, "max": 5 }
      }
    }
  ],
  "layout": {
    "columns": 1,
    "color_scheme": {
      "primary": "#1a365d",
      "secondary": "#2d3748",
      "accent": "#3182ce",
      "background": "#ffffff",
      "text": "#1a202c"
    },
    "fonts": {
      "heading": "Inter",
      "body": "Inter"
    }
  }
}
```

## Validation Rules

| Rule | Behavior |
|------|----------|
| Missing required field | **Blocked** — save rejected |
| Field type mismatch | **Blocked** — save rejected |
| Unknown extra field | **Warning** — allowed (forward compatibility) |
| Duplicate section IDs | **Blocked** |
| Unknown section type | **Blocked** |
| constraints conflict (min > max) | **Blocked** |

## Template Versioning

When a template is updated (PATCH/PUT), the system:
1. Saves the updated definition as a new version
2. Existing resumes retain the template version they were created with
3. New resumes use the latest template version

## Validation Entry Points

- **POST/PUT templates**: Validate `definition` and `default_styles` against `template-definition-schema.json`
- **PATCH resumes**: Validate `content` sections against the linked template's definition
- **Edge cases**: Schema rejects duplicate IDs, unknown types, constraint conflicts

## JSON Schema Files

| File | Purpose |
|------|---------|
| `contracts/template-definition-schema.json` | Validates the templates.definition JSONB column |
| `contracts/resume-content-schema.json` | Validates the resumes.content JSONB column |

Both schemas live in `specs/003-template-json-format/contracts/`.
