from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.services.pdf_service import generate_pdf_bytes
from app.services.resume_service import ResumeService

router = APIRouter(prefix="/pdf", tags=["pdf"])


@router.get("/resumes/{resume_id}")
async def download_resume_pdf(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    service = ResumeService(db)
    resume = await service.get_by_id_and_user(resume_id, user_id)
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
    try:
        pdf_bytes = await generate_pdf_bytes(resume)
        return Response(content=pdf_bytes, media_type="application/pdf", headers={
            "Content-Disposition": f'attachment; filename="{resume.title}.pdf"',
        })
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"PDF generation failed: {e}")
