from app.models.user import Profile
from app.repositories.base import BaseRepository


class ProfileRepository(BaseRepository[Profile]):
    def __init__(self, db):
        super().__init__(Profile, db)
