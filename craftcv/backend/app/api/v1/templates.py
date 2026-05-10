from fastapi import APIRouter

router = APIRouter(prefix="/templates", tags=["templates"])


@router.get("/")
async def list_templates():
    pass


@router.get("/{template_id}")
async def get_template(template_id: str):
    pass


@router.post("/")
async def create_template():
    pass
