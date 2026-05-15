from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.user_repo import ProfileRepository
from app.schemas.auth import SignInRequest, SignUpRequest
from supabase import Client


class AuthService:
    def __init__(self, db: AsyncSession, supabase: Client):
        self.db = db
        self.supabase = supabase
        self.repo = ProfileRepository(db)

    async def signup(self, request: SignUpRequest) -> dict:
        try:
            auth_response = self.supabase.auth.sign_up(
                {"email": request.email, "password": request.password}
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e),
            )
        user = auth_response.user
        if not user or not user.id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Signup failed")
        return {"user_id": str(user.id), "email": user.email}

    async def signin(self, request: SignInRequest) -> dict:
        try:
            auth_response = self.supabase.auth.sign_in_with_password(
                {"email": request.email, "password": request.password}
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=str(e),
            )
        session = auth_response.session
        if not session:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        user = auth_response.user
        return {
            "access_token": session.access_token,
            "refresh_token": session.refresh_token,
            "user_id": str(user.id) if user else "",
        }

    async def signout(self, access_token: str) -> None:
        self.supabase.auth.admin.sign_out(access_token)
