from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.resume import ResumeCreate, ResumeUpdate
from app.services.resume_service import ResumeService

router = APIRouter(prefix="/resumes", tags=["resumes"])


@router.get("/")
async def list_resumes(
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    service = ResumeService(db)
    return await service.get_user_resumes(user_id)


@router.post("/", status_code=201)
async def create_resume(
    body: ResumeCreate,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    service = ResumeService(db)
    resume = await service.create_from_template(
        title=body.title,
        template_id=body.template_id,
        user_id=user_id,
    )
    return resume


@router.get("/{resume_id}")
async def get_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    service = ResumeService(db)
    resume = await service.get_by_id_and_user(resume_id, user_id)
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    return resume


@router.patch("/{resume_id}")
async def update_resume(
    resume_id: str,
    body: ResumeUpdate,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    service = ResumeService(db)
    resume = await service.get_by_id_and_user(resume_id, user_id)
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")

    if body.content is not None and resume.template_version:
        template_def = resume.template_version.get("definition")
        if template_def:
            result = service.validate_content_against_template(body.content, template_def)
            if not result.is_valid:
                raise HTTPException(status_code=422, detail={
                    "message": "Resume content validation failed",
                    "errors": result.errors,
                    "warnings": result.warnings,
                })

    updated = await service.update_content(
        resume_id, body.content or resume.content, body.updated_at
    )
    return updated


@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    service = ResumeService(db)
    await service.delete(resume_id, user_id)
    return {"detail": "Resume deleted successfully"}
