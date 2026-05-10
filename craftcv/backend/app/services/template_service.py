from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.template_repo import TemplateRepository


class TemplateService:
    def __init__(self, db: AsyncSession):
        self.repo = TemplateRepository(db)

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
