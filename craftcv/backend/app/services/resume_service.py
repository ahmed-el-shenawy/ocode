from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.validation import ResumeContentValidator, ValidationResult
from app.models.resume import Resume
from app.repositories.resume_repo import ResumeRepository
from app.repositories.template_repo import TemplateRepository


class ResumeService:
    def __init__(self, db: AsyncSession):
        self.repo = ResumeRepository(db)
        self.template_repo = TemplateRepository(db)
        self.content_validator = ResumeContentValidator()

    async def get_by_id(self, resume_id: str) -> Resume | None:
        return await self.repo.get_by_id(resume_id)

    async def get_by_id_and_user(self, resume_id: str, user_id: str) -> Resume | None:
        resume = await self.repo.get_by_id(resume_id)
        if resume and str(resume.user_id) != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        return resume

    async def get_user_resumes(self, user_id: str) -> list[Resume]:
        return await self.repo.get_by_user_id(user_id)

    async def create_from_template(self, title: str, template_id: str, user_id: str) -> Resume:
        template = await self.template_repo.get_by_id(template_id)
        template_version = None
        if template:
            template_version = {
                "template_id": str(template.id),
                "definition": template.definition,
                "default_styles": template.default_styles,
            }
        resume = Resume(
            title=title,
            template_id=template_id,
            template_version=template_version,
            user_id=user_id,
        )
        return await self.repo.create(resume)

    async def update_content(
        self, resume_id: str, content: dict, updated_at: str | None = None
    ) -> Resume | None:
        resume = await self.repo.get_by_id(resume_id)
        if not resume:
            return None
        if updated_at and str(resume.updated_at) != updated_at:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Resume has been modified. Re-fetch and retry.",
            )
        resume.content = content
        return await self.repo.update(resume)

    async def update_styles(self, resume_id: str, styles: dict) -> Resume | None:
        resume = await self.repo.get_by_id(resume_id)
        if resume:
            resume.styles = styles
            return await self.repo.update(resume)
        return None

    async def delete(self, resume_id: str, user_id: str) -> None:
        resume = await self.repo.get_by_id(resume_id)
        if not resume:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
        if str(resume.user_id) != user_id:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        await self.repo.delete(resume)

    def validate_content_against_template(self, content: dict, template_definition: dict) -> ValidationResult:
        result = self.content_validator.validate(content)
        errors = list(result.errors)
        warnings = list(result.warnings)

        template_sections = {s["id"]: s for s in template_definition.get("sections", [])}

        for section in content.get("sections", []):
            section_id = section.get("section_id")
            if section_id not in template_sections:
                errors.append(f"Section '{section_id}' is not defined in the linked template")
                continue

            ts = template_sections[section_id]
            min_items = ts.get("min_items", 0)
            max_items = ts.get("max_items")
            items = section.get("items", [])
            item_count = len(items)

            if item_count < min_items:
                errors.append(
                    f"Section '{section_id}': requires at least {min_items} item(s), got {item_count}"
                )
            if max_items is not None and item_count > max_items:
                errors.append(
                    f"Section '{section_id}': maximum {max_items} item(s) allowed, got {item_count}"
                )

            template_fields = ts.get("fields", {})
            for item in items:
                for fname, fdef in template_fields.items():
                    if fdef.get("required") and fname not in item:
                        errors.append(
                            f"Section '{section_id}', item: missing required field '{fname}'"
                        )

                for key in item:
                    if key not in template_fields:
                        warnings.append(
                            f"Section '{section_id}', field '{key}': unknown field (forward-compatible)"
                        )

        return ValidationResult(
            is_valid=len(errors) == 0,
            errors=errors,
            warnings=warnings,
        )
