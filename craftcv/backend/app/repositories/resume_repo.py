from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.resume import Resume


class ResumeRepository(BaseRepository[Resume]):
    def __init__(self, db: AsyncSession):
        super().__init__(Resume, db)

    async def get_by_user_id(self, user_id: str) -> list[Resume]:
        result = await self.db.execute(
            select(Resume).where(Resume.user_id == user_id)
        )
        return list(result.scalars().all())
