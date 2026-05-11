from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.services.studio_service import StudioService

router = APIRouter(prefix="/studio", tags=["studio"])


class SectionUpdate(BaseModel):
    section_id: str
    content: dict


@router.patch("/resumes/{resume_id}/section")
async def update_section(
    resume_id: str,
    body: SectionUpdate,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    service = StudioService(db)
    updated = await service.update_section_content(resume_id, body.section_id, body.content, user_id)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return updated


@router.get("/resumes/{resume_id}/sections")
async def list_sections(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    service = StudioService(db)
    resume = await service.resume_repo.get_by_id(resume_id)
    if not resume or str(resume.user_id) != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    content = resume.content or {}
    return content.get("sections", [])
