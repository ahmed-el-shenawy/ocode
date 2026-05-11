from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, get_supabase
from app.schemas.auth import SignInRequest, SignUpRequest
from app.services.auth_service import AuthService
from supabase import Client

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", status_code=201)
async def signup(
    body: SignUpRequest,
    db: AsyncSession = Depends(get_db),
    supabase: Client = Depends(get_supabase),
):
    service = AuthService(db, supabase)
    return await service.signup(body)


@router.post("/signin")
async def signin(
    body: SignInRequest,
    db: AsyncSession = Depends(get_db),
    supabase: Client = Depends(get_supabase),
):
    service = AuthService(db, supabase)
    return await service.signin(body)


@router.post("/logout")
async def logout(
    db: AsyncSession = Depends(get_db),
    supabase: Client = Depends(get_supabase),
    user_id: str = Depends(get_current_user),
):
    service = AuthService(db, supabase)
    await service.signout(user_id)
    return {"detail": "Logged out successfully"}
