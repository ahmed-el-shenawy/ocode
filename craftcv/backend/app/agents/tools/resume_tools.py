from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.resume_repo import ResumeRepository


async def get_section_info(db: AsyncSession, resume_id: str, section_key: str) -> dict | None:
    repo = ResumeRepository(db)
    resume = await repo.get_by_id(resume_id)
    if not resume:
        return None
    if isinstance(resume.content, dict):
        for section in resume.content.get("sections", []):
            if isinstance(section, dict) and section.get("id") == section_key:
                return section
    return None


async def update_section(db: AsyncSession, resume_id: str, section_key: str, data: dict) -> bool:
    repo = ResumeRepository(db)
    resume = await repo.get_by_id(resume_id)
    if not resume:
        return False
    content = resume.content or {}
    sections = list(content.get("sections", []))
    found = False
    for i, section in enumerate(sections):
        if isinstance(section, dict) and section.get("id") == section_key:
            sections[i] = {**section, "content": data}
            found = True
            break
    if not found:
        sections.append({"id": section_key, "type": section_key, "content": data})
    content["sections"] = sections
    resume.content = content
    await repo.update(resume)
    return True
