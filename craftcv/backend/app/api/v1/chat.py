from fastapi import APIRouter

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/conversation/{resume_id}")
async def create_conversation(resume_id: str):
    pass


@router.post("/message/{conversation_id}")
async def send_message(conversation_id: str):
    pass


@router.post("/switch-mode/{conversation_id}")
async def switch_mode(conversation_id: str):
    pass
