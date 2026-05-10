from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.resume_repo import ResumeRepository
from app.models.resume import Resume


class ResumeService:
    def __init__(self, db: AsyncSession):
        self.repo = ResumeRepository(db)

    async def get_by_id(self, resume_id: str) -> Resume | None:
        return await self.repo.get_by_id(resume_id)

    async def get_user_resumes(self, user_id: str) -> list[Resume]:
        return await self.repo.get_by_user_id(user_id)

    async def create_from_template(self, title: str, template_id: str, user_id: str) -> Resume:
        resume = Resume(title=title, template_id=template_id, user_id=user_id)
        return await self.repo.create(resume)

    async def update_content(self, resume_id: str, content: dict) -> Resume | None:
        resume = await self.repo.get_by_id(resume_id)
        if resume:
            resume.content = content
            return await self.repo.update(resume)
        return None

    async def update_styles(self, resume_id: str, styles: dict) -> Resume | None:
        resume = await self.repo.get_by_id(resume_id)
        if resume:
            resume.styles = styles
            return await self.repo.update(resume)
        return None
