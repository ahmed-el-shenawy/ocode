"""Seed predefined resume templates into the database.

Usage:
    python -m app.seed

Idempotent: safe to run multiple times. Uses case-insensitive
name matching to upsert templates.
"""

import asyncio

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_async_session
from app.models.template import Template

MODERN_CLEAN = {
    "name": "Modern Clean",
    "description": "A clean, modern single-column resume with blue accents and Inter font — suitable for most industries.",
    "definition": {
        "sections": [
            {
                "id": "header",
                "type": "header",
                "label": "Header",
                "required": True,
                "max_items": 1,
                "fields": {
                    "full_name": {"type": "text", "label": "Full Name", "required": True},
                    "email": {"type": "text", "label": "Email", "required": True},
                    "phone": {"type": "text", "label": "Phone"},
                    "location": {"type": "text", "label": "Location"},
                    "linkedin": {"type": "url", "label": "LinkedIn URL"},
                    "portfolio": {"type": "url", "label": "Portfolio URL"},
                    "headline": {"type": "text", "label": "Professional Headline"},
                },
            },
            {
                "id": "summary",
                "type": "summary",
                "label": "Professional Summary",
                "max_items": 1,
                "fields": {
                    "content": {"type": "richtext", "label": "Summary", "max_length": 500},
                },
            },
            {
                "id": "experience",
                "type": "experience",
                "label": "Experience",
                "min_items": 0,
                "max_items": 5,
                "fields": {
                    "company": {"type": "text", "label": "Company", "required": True},
                    "position": {"type": "text", "label": "Position", "required": True},
                    "start_date": {"type": "date", "label": "Start Date"},
                    "end_date": {"type": "date", "label": "End Date"},
                    "current": {"type": "boolean", "label": "Current Position"},
                    "location": {"type": "text", "label": "Location"},
                    "bullets": {"type": "list", "label": "Bullets", "min": 2, "max": 5},
                },
            },
            {
                "id": "education",
                "type": "education",
                "label": "Education",
                "min_items": 0,
                "max_items": 3,
                "fields": {
                    "institution": {"type": "text", "label": "Institution", "required": True},
                    "degree": {"type": "text", "label": "Degree"},
                    "field": {"type": "text", "label": "Field of Study"},
                    "start_date": {"type": "date", "label": "Start Date"},
                    "end_date": {"type": "date", "label": "End Date"},
                    "gpa": {"type": "text", "label": "GPA"},
                },
            },
            {
                "id": "skills",
                "type": "skills",
                "label": "Skills",
                "fields": {
                    "category": {"type": "text", "label": "Category"},
                    "skills": {"type": "tags", "label": "Skills"},
                },
            },
            {
                "id": "projects",
                "type": "projects",
                "label": "Projects",
                "min_items": 0,
                "max_items": 5,
                "fields": {
                    "title": {"type": "text", "label": "Project Title", "required": True},
                    "link": {"type": "url", "label": "Project Link"},
                    "bullets": {"type": "list", "label": "Details", "min": 2, "max": 4},
                },
            },
            {
                "id": "certifications",
                "type": "certifications",
                "label": "Certifications",
                "fields": {
                    "name": {"type": "text", "label": "Certification Name"},
                    "issuer": {"type": "text", "label": "Issuer"},
                    "date": {"type": "date", "label": "Date Obtained"},
                    "link": {"type": "url", "label": "Credential URL"},
                },
            },
            {
                "id": "languages",
                "type": "languages",
                "label": "Languages",
                "fields": {
                    "language": {"type": "text", "label": "Language"},
                    "proficiency": {
                        "type": "select",
                        "label": "Proficiency",
                        "options": ["Native", "Fluent", "Advanced", "Intermediate", "Basic"],
                    },
                },
            },
        ],
        "layout": {
            "columns": 1,
            "color_scheme": {
                "primary": "#1e293b",
                "secondary": "#475569",
                "accent": "#2563eb",
                "background": "#ffffff",
                "text": "#1a202c",
            },
            "fonts": {
                "heading": "Inter",
                "body": "Inter",
            },
        },
    },
    "default_styles": {
        "margin_top": 20,
        "margin_bottom": 20,
        "margin_left": 25,
        "margin_right": 25,
        "section_spacing": 24,
    },
}

EXECUTIVE = {
    "name": "Executive",
    "description": "A professional executive resume with dark header, serif typography, and emphasis on summary and certifications.",
    "definition": {
        "sections": [
            {
                "id": "header",
                "type": "header",
                "label": "Header",
                "required": True,
                "max_items": 1,
                "fields": {
                    "full_name": {"type": "text", "label": "Full Name", "required": True},
                    "email": {"type": "text", "label": "Email", "required": True},
                    "phone": {"type": "text", "label": "Phone"},
                    "location": {"type": "text", "label": "Location"},
                    "linkedin": {"type": "url", "label": "LinkedIn URL"},
                    "headline": {"type": "text", "label": "Executive Title"},
                },
            },
            {
                "id": "summary",
                "type": "summary",
                "label": "Executive Summary",
                "max_items": 1,
                "fields": {
                    "content": {"type": "richtext", "label": "Summary", "max_length": 500},
                },
            },
            {
                "id": "experience",
                "type": "experience",
                "label": "Leadership Experience",
                "min_items": 0,
                "max_items": 5,
                "fields": {
                    "company": {"type": "text", "label": "Organization", "required": True},
                    "position": {"type": "text", "label": "Title", "required": True},
                    "start_date": {"type": "date", "label": "Start Date"},
                    "end_date": {"type": "date", "label": "End Date"},
                    "current": {"type": "boolean", "label": "Current Position"},
                    "location": {"type": "text", "label": "Location"},
                    "bullets": {"type": "list", "label": "Key Achievements", "min": 2, "max": 5},
                },
            },
            {
                "id": "education",
                "type": "education",
                "label": "Education",
                "min_items": 0,
                "max_items": 3,
                "fields": {
                    "institution": {"type": "text", "label": "Institution", "required": True},
                    "degree": {"type": "text", "label": "Degree"},
                    "field": {"type": "text", "label": "Field of Study"},
                    "start_date": {"type": "date", "label": "Start Date"},
                    "end_date": {"type": "date", "label": "End Date"},
                },
            },
            {
                "id": "certifications",
                "type": "certifications",
                "label": "Certifications",
                "fields": {
                    "name": {"type": "text", "label": "Certification Name"},
                    "issuer": {"type": "text", "label": "Issuer"},
                    "date": {"type": "date", "label": "Date Obtained"},
                    "link": {"type": "url", "label": "Credential URL"},
                },
            },
            {
                "id": "skills",
                "type": "skills",
                "label": "Skills",
                "fields": {
                    "category": {"type": "text", "label": "Category"},
                    "skills": {"type": "tags", "label": "Skills"},
                },
            },
        ],
        "layout": {
            "columns": 1,
            "color_scheme": {
                "primary": "#1e293b",
                "secondary": "#334155",
                "accent": "#cbd5e1",
                "background": "#ffffff",
                "text": "#0f172a",
            },
            "fonts": {
                "heading": "Merriweather",
                "body": "Georgia",
            },
        },
    },
    "default_styles": {
        "margin_top": 20,
        "margin_bottom": 20,
        "margin_left": 25,
        "margin_right": 25,
        "section_spacing": 28,
    },
}

CREATIVE = {
    "name": "Creative",
    "description": "A two-column creative resume with vibrant accents, skills sidebar, and project-focused layout for design and tech roles.",
    "definition": {
        "sections": [
            {
                "id": "header",
                "type": "header",
                "label": "Header",
                "required": True,
                "max_items": 1,
                "fields": {
                    "full_name": {"type": "text", "label": "Full Name", "required": True},
                    "email": {"type": "text", "label": "Email", "required": True},
                    "phone": {"type": "text", "label": "Phone"},
                    "location": {"type": "text", "label": "Location"},
                    "portfolio": {"type": "url", "label": "Portfolio URL"},
                    "headline": {"type": "text", "label": "Role"},
                },
            },
            {
                "id": "summary",
                "type": "summary",
                "label": "About Me",
                "max_items": 1,
                "fields": {
                    "content": {"type": "richtext", "label": "Bio", "max_length": 500},
                },
            },
            {
                "id": "experience",
                "type": "experience",
                "label": "Experience",
                "min_items": 0,
                "max_items": 5,
                "fields": {
                    "company": {"type": "text", "label": "Company", "required": True},
                    "position": {"type": "text", "label": "Position", "required": True},
                    "start_date": {"type": "date", "label": "Start Date"},
                    "end_date": {"type": "date", "label": "End Date"},
                    "current": {"type": "boolean", "label": "Current Position"},
                    "bullets": {"type": "list", "label": "Highlights", "min": 2, "max": 4},
                },
            },
            {
                "id": "education",
                "type": "education",
                "label": "Education",
                "min_items": 0,
                "max_items": 3,
                "fields": {
                    "institution": {"type": "text", "label": "Institution", "required": True},
                    "degree": {"type": "text", "label": "Degree"},
                    "field": {"type": "text", "label": "Field of Study"},
                    "start_date": {"type": "date", "label": "Start Date"},
                    "end_date": {"type": "date", "label": "End Date"},
                },
            },
            {
                "id": "skills",
                "type": "skills",
                "label": "Expertise",
                "fields": {
                    "category": {"type": "text", "label": "Category"},
                    "skills": {"type": "tags", "label": "Skills"},
                },
            },
            {
                "id": "projects",
                "type": "projects",
                "label": "Projects",
                "min_items": 0,
                "max_items": 5,
                "fields": {
                    "title": {"type": "text", "label": "Project Title", "required": True},
                    "link": {"type": "url", "label": "Project Link"},
                    "bullets": {"type": "list", "label": "Details", "min": 2, "max": 4},
                },
            },
            {
                "id": "certifications",
                "type": "certifications",
                "label": "Certifications",
                "fields": {
                    "name": {"type": "text", "label": "Certification Name"},
                    "issuer": {"type": "text", "label": "Issuer"},
                    "date": {"type": "date", "label": "Date Obtained"},
                    "link": {"type": "url", "label": "Credential URL"},
                },
            },
        ],
        "layout": {
            "columns": 2,
            "color_scheme": {
                "primary": "#7c3aed",
                "secondary": "#a78bfa",
                "accent": "#ec4899",
                "background": "#faf5ff",
                "text": "#1a202c",
            },
            "fonts": {
                "heading": "Inter",
                "body": "Inter",
            },
        },
    },
    "default_styles": {
        "margin_top": 20,
        "margin_bottom": 20,
        "margin_left": 20,
        "margin_right": 20,
        "section_spacing": 20,
        "sidebar_width": 35,
    },
}

ALL_TEMPLATES = [MODERN_CLEAN, EXECUTIVE, CREATIVE]


async def seed(session: AsyncSession | None = None) -> dict[str, int]:
    """Upsert all predefined templates.

    Returns a dict with 'inserted' and 'updated' counts.
    """
    close_session = False
    if session is None:
        session_factory = get_async_session()
        session = session_factory()
        close_session = True

    inserted = 0
    updated = 0

    try:
        for tpl in ALL_TEMPLATES:
            name_lower = tpl["name"].lower()
            stmt = select(Template).where(func.lower(Template.name) == name_lower)
            result = await session.execute(stmt)
            existing = result.scalar_one_or_none()

            if existing:
                existing.definition = tpl["definition"]
                existing.default_styles = tpl["default_styles"]
                existing.description = tpl["description"]
                existing.is_public = True
                existing.user_id = None
                updated += 1
            else:
                template = Template(
                    user_id=None,
                    name=tpl["name"],
                    description=tpl["description"],
                    is_public=True,
                    definition=tpl["definition"],
                    default_styles=tpl["default_styles"],
                )
                session.add(template)
                inserted += 1

        await session.commit()
    except Exception:
        await session.rollback()
        raise
    finally:
        if close_session:
            await session.close()

    return {"inserted": inserted, "updated": updated}


async def main():
    print("Seeding predefined templates...")
    counts = await seed()
    total = counts["inserted"] + counts["updated"]
    print(f"Done. Inserted {counts['inserted']}, updated {counts['updated']} ({total} total).")


if __name__ == "__main__":
    asyncio.run(main())
