from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.schemas.chat import SendMessageRequest, SwitchModeRequest
from app.services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/conversation/{resume_id}", status_code=201)
async def create_conversation(
    resume_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    service = ChatService(db)
    conversation = await service.get_or_create_conversation(resume_id, user_id)
    return {
        "conversation_id": str(conversation.id),
        "resume_id": str(conversation.resume_id),
        "mode": conversation.mode,
        "progress": conversation.progress,
    }


@router.post("/message/{conversation_id}")
async def send_message(
    conversation_id: str,
    body: SendMessageRequest,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    service = ChatService(db)
    conversation = await service.conv_repo.get_by_id(conversation_id)
    if not conversation or str(conversation.user_id) != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    result = await service.send_message(conversation_id, body.content)
    return result


@router.post("/switch-mode/{conversation_id}")
async def switch_mode(
    conversation_id: str,
    body: SwitchModeRequest,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    service = ChatService(db)
    conversation = await service.conv_repo.get_by_id(conversation_id)
    if not conversation or str(conversation.user_id) != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    updated = await service.switch_mode(conversation_id, body.mode)
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    return {"mode": updated.mode, "conversation_id": conversation_id}


@router.get("/messages/{conversation_id}")
async def get_messages(
    conversation_id: str,
    db: AsyncSession = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    service = ChatService(db)
    conversation = await service.conv_repo.get_by_id(conversation_id)
    if not conversation or str(conversation.user_id) != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    messages = await service.get_messages(conversation_id)
    return [
        {"id": str(m.id), "role": m.role, "content": m.content, "created_at": str(m.created_at)}
        for m in messages
    ]
