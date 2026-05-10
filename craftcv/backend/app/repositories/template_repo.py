from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.template import Template


class TemplateRepository(BaseRepository[Template]):
    def __init__(self, db: AsyncSession):
        super().__init__(Template, db)

    async def get_public_templates(self) -> list[Template]:
        result = await self.db.execute(select(Template).where(Template.is_public.is_(True)))
        return list(result.scalars().all())

    async def get_user_templates(self, user_id: str) -> list[Template]:
        result = await self.db.execute(
            select(Template).where(Template.user_id == user_id)
        )
        return list(result.scalars().all())

    async def get_available_for_user(self, user_id: str) -> list[Template]:
        result = await self.db.execute(
            select(Template).where(
                or_(Template.is_public.is_(True), Template.user_id == user_id)
            )
        )
        return list(result.scalars().all())
