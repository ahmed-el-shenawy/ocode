from sqlalchemy.ext.asyncio import AsyncSession

from app.core.validation import ResumeContentValidator
from app.repositories.resume_repo import ResumeRepository
from app.repositories.template_repo import TemplateRepository


class StudioService:
    def __init__(self, db: AsyncSession):
        self.resume_repo = ResumeRepository(db)
        self.template_repo = TemplateRepository(db)
        self.content_validator = ResumeContentValidator()

    async def update_section_content(self, resume_id: str, section_id: str, content: dict, user_id: str) -> dict | None:
        resume = await self.resume_repo.get_by_id(resume_id)
        if not resume or str(resume.user_id) != user_id:
            return None
        sections = list((resume.content or {}).get("sections", []))
        found = False
        for i, sec in enumerate(sections):
            if isinstance(sec, dict) and sec.get("id") == section_id:
                sections[i] = {**sec, "content": content}
                found = True
                break
        if not found:
            sections.append({"id": section_id, "type": section_id, "content": content})
        resume.content = {**(resume.content or {}), "sections": sections}
        return await self.resume_repo.update(resume)
