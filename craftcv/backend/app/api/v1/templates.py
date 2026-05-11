from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.template import TemplateCreate
from app.services.template_service import TemplateService, ValidationError

router = APIRouter(prefix="/templates", tags=["templates"])


class LayoutUpdate(BaseModel):
    columns: int | None = None
    color_scheme: dict[str, str] | None = None
    fonts: dict[str, str] | None = None


@router.get("/public")
async def list_public_templates(db: AsyncSession = Depends(get_db)):
    service = TemplateService(db)
    return await service.get_public_templates()


@router.get("/")
async def list_user_templates(
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    service = TemplateService(db)
    return await service.get_user_templates(user_id)


@router.get("/{template_id}")
async def get_template(template_id: str, db: AsyncSession = Depends(get_db)):
    service = TemplateService(db)
    template = await service.get_by_id(template_id)
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
    return template


@router.patch("/{template_id}/layout")
async def update_template_layout(
    template_id: str, body: LayoutUpdate, db: AsyncSession = Depends(get_db)
):
    service = TemplateService(db)
    template = await service.get_by_id(template_id)
    if not template:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Template not found")
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


@router.post("/", status_code=201)
async def create_template(
    body: TemplateCreate,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    service = TemplateService(db)
    result = service.validate_definition(body.definition)
    if not result.is_valid:
        raise HTTPException(status_code=422, detail={
            "message": "Template definition validation failed",
            "errors": result.errors,
            "warnings": result.warnings,
        })
    template = await service.create(
        name=body.name,
        definition=body.definition,
        user_id=user_id,
        description=body.description,
        default_styles=body.default_styles,
        is_public=body.is_public,
    )
    return template
