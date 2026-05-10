from fastapi import APIRouter

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup")
async def signup():
    pass


@router.post("/signin")
async def signin():
    pass


@router.post("/logout")
async def logout():
    pass
