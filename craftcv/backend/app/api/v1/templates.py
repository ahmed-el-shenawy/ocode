from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.schemas.template import TemplateCreate, TemplateResponse
from app.services.template_service import TemplateService, ValidationError

router = APIRouter(prefix="/templates", tags=["templates"])


class LayoutUpdate(BaseModel):
    columns: int | None = None
    color_scheme: dict[str, str] | None = None
    fonts: dict[str, str] | None = None


@router.get("/")
async def list_templates(db: AsyncSession = Depends(get_db)):
    service = TemplateService(db)
    return await service.get_public_templates()


@router.get("/{template_id}")
async def get_template(template_id: str, db: AsyncSession = Depends(get_db)):
    service = TemplateService(db)
    template = await service.get_by_id(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    return template


@router.patch("/{template_id}/layout")
async def update_template_layout(
    template_id: str, body: LayoutUpdate, db: AsyncSession = Depends(get_db)
):
    service = TemplateService(db)
    template = await service.get_by_id(template_id)
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    layout = {}
    if body.columns is not None:
        layout["columns"] = body.columns
    if body.color_scheme is not None:
        layout["color_scheme"] = body.color_scheme
    if body.fonts is not None:
        layout["fonts"] = body.fonts
    try:
        updated_def = service.update_layout(template.definition, layout)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail={"message": e.message})
    return {"status": "ok", "definition": updated_def}


@router.post("/")
async def create_template(body: TemplateCreate, db: AsyncSession = Depends(get_db)):
    service = TemplateService(db)
    result = service.validate_definition(body.definition)
    if not result.is_valid:
        raise HTTPException(status_code=422, detail={
            "message": "Template definition validation failed",
            "errors": result.errors,
            "warnings": result.warnings,
        })
    return {"status": "ok", "message": "Template validated successfully"}
