import logging

from sqlalchemy.ext.asyncio import AsyncSession

from app.agents.cv_agent import CvAgent
from app.agents.router import get_router
from app.models.conversation import Conversation, Message
from app.repositories.conversation_repo import ConversationRepository
from app.repositories.resume_repo import ResumeRepository

logger = logging.getLogger("craftcv.chat")


class ChatService:
    def __init__(self, db: AsyncSession):
        self.conv_repo = ConversationRepository(db)
        self.resume_repo = ResumeRepository(db)
        self.agent = CvAgent(get_router())

    async def get_or_create_conversation(self, resume_id: str, user_id: str) -> Conversation:
        existing = await self.conv_repo.get_by_resume_and_user(resume_id, user_id)
        if existing:
            return existing
        conversation = Conversation(resume_id=resume_id, user_id=user_id)
        return await self.conv_repo.create(conversation)

    async def send_message(self, conversation_id: str, content: str) -> dict:
        user_msg = Message(conversation_id=conversation_id, role="user", content=content)
        await self.conv_repo.add_message(user_msg)

        conversation = await self.conv_repo.get_by_id(conversation_id)
        resume = await self.resume_repo.get_by_id(str(conversation.resume_id)) if conversation else None

        history = await self.conv_repo.get_messages(conversation_id)
        messages_for_llm = [{"role": m.role, "content": m.content} for m in history]

        result = await self.agent.process(
            user_input=content,
            resume={"content": resume.content, "template_version": getattr(resume, "template_version", None)} if resume else None,
            conversation={"mode": conversation.mode, "progress": conversation.progress} if conversation else None,
            messages=messages_for_llm,
        )

        assistant_msg = Message(
            conversation_id=conversation_id,
            role="assistant",
            content=result["reply"],
            metadata_={"intent": result.get("intent"), "progress": result.get("progress")},
        )
        await self.conv_repo.add_message(assistant_msg)

        if conversation:
            conversation.progress = result.get("progress", conversation.progress or {})
            await self.conv_repo.update(conversation)

        return {
            "reply": result["reply"],
            "metadata": {"intent": result.get("intent"), "progress": result.get("progress")},
        }

    async def switch_mode(self, conversation_id: str, mode: str) -> Conversation | None:
        conversation = await self.conv_repo.get_by_id(conversation_id)
        if conversation:
            conversation.mode = mode
            return await self.conv_repo.update(conversation)
        return None

    async def get_messages(self, conversation_id: str) -> list[Message]:
        return await self.conv_repo.get_messages(conversation_id)
