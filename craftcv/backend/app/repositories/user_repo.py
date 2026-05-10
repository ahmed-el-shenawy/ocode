from app.repositories.base import BaseRepository
from app.models.user import Profile


class ProfileRepository(BaseRepository[Profile]):
    def __init__(self, db):
        super().__init__(Profile, db)
