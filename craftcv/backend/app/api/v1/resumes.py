from fastapi import APIRouter

router = APIRouter(prefix="/resumes", tags=["resumes"])


@router.get("/")
async def list_resumes():
    pass


@router.post("/")
async def create_resume():
    pass


@router.get("/{resume_id}")
async def get_resume(resume_id: str):
    pass


@router.patch("/{resume_id}")
async def update_resume(resume_id: str):
    pass


@router.delete("/{resume_id}")
async def delete_resume(resume_id: str):
    pass
