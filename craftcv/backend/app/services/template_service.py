import re

from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.template_repo import TemplateRepository
from app.core.validation import TemplateSchemaValidator, ValidationResult

_HEX_COLOR = re.compile(r"^#[0-9a-fA-F]{6}$")

_KNOWN_SECTION_TYPES = {
    "header", "summary", "experience", "education",
    "projects", "skills", "certifications", "languages", "custom",
}
_KNOWN_FIELD_TYPES = {
    "text", "url", "date", "boolean", "richtext", "list", "tags", "select",
}
_CUSTOM_ALLOWED_FIELD_TYPES = {"text", "richtext", "url"}


class ValidationError(Exception):
    def __init__(self, message: str, errors: list[str] | None = None):
        self.message = message
        self.errors = errors or []
        super().__init__(message)


class TemplateService:
    def __init__(self, db: AsyncSession):
        self.repo = TemplateRepository(db)
        self.schema_validator = TemplateSchemaValidator()

    async def get_by_id(self, template_id: str):
        return await self.repo.get_by_id(template_id)

    async def get_public_templates(self):
        return await self.repo.get_public_templates()

    async def get_user_templates(self, user_id: str):
        return await self.repo.get_user_templates(user_id)

    async def get_available_for_user(self, user_id: str):
        return await self.repo.get_available_for_user(user_id)

    async def create_from_template(self, template_id: str, user_id: str):
        return await self.repo.get_by_id(template_id)

    def validate_definition(self, definition: dict) -> ValidationResult:
        result = self.schema_validator.validate(definition)
        errors = list(result.errors)
        warnings = list(result.warnings)

        sections = definition.get("sections", [])

        section_ids = []
        for s in sections:
            sid = s.get("id")
            if sid in section_ids:
                errors.append(f"Duplicate section ID: '{sid}'")
            section_ids.append(sid)

            stype = s.get("type", "")
            if stype not in _KNOWN_SECTION_TYPES:
                errors.append(f"Unknown section type '{stype}' in section '{sid}'")

            min_items = s.get("min_items", 0)
            max_items = s.get("max_items")
            if max_items is not None and min_items > max_items:
                errors.append(
                    f"Section '{sid}': min_items ({min_items}) cannot exceed max_items ({max_items})"
                )

            if stype == "header" and max_items is not None and max_items != 1:
                errors.append(f"Header section '{sid}': max_items must be 1")

            fields = s.get("fields", {})
            for fname, fdef in fields.items():
                ftype = fdef.get("type", "")
                if ftype not in _KNOWN_FIELD_TYPES:
                    errors.append(
                        f"Section '{sid}', field '{fname}': unknown field type '{ftype}'"
                    )

                if stype == "custom" and ftype not in _CUSTOM_ALLOWED_FIELD_TYPES:
                    errors.append(
                        f"Section '{sid}', field '{fname}': custom sections cannot use field type '{ftype}'"
                    )

                if fdef.get("options") is not None and ftype != "select":
                    errors.append(
                        f"Section '{sid}', field '{fname}': 'options' is only valid for 'select' fields"
                    )

                if (fdef.get("min") is not None or fdef.get("max") is not None) and ftype not in ("list", "tags"):
                    errors.append(
                        f"Section '{sid}', field '{fname}': 'min'/'max' are only valid for 'list' or 'tags' fields"
                    )

                if fdef.get("max_length") is not None and ftype not in ("text", "richtext"):
                    errors.append(
                        f"Section '{sid}', field '{fname}': 'max_length' is only valid for 'text' or 'richtext' fields"
                    )

        return ValidationResult(is_valid=len(errors) == 0, errors=errors, warnings=warnings)

    def update_layout(self, definition: dict, layout: dict) -> dict:
        columns = layout.get("columns", 1)
        if not isinstance(columns, int) or columns < 1 or columns > 3:
            raise ValidationError("Layout columns must be an integer between 1 and 3")
        color_scheme = layout.get("color_scheme", {})
        for key, val in color_scheme.items():
            if not isinstance(val, str) or not _HEX_COLOR.match(val):
                raise ValidationError(f"Invalid hex color '{val}' in color_scheme.{key}")
        fonts = layout.get("fonts", {})
        definition["layout"] = {"columns": columns}
        if color_scheme:
            definition["layout"]["color_scheme"] = color_scheme
        if fonts:
            definition["layout"]["fonts"] = fonts
        return definition
