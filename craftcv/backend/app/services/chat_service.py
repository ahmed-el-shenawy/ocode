from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.conversation_repo import ConversationRepository
from app.models.conversation import Conversation, Message


class ChatService:
    def __init__(self, db: AsyncSession):
        self.repo = ConversationRepository(db)

    async def get_or_create_conversation(self, resume_id: str, user_id: str) -> Conversation:
        existing = await self.repo.get_by_resume_and_user(resume_id, user_id)
        if existing:
            return existing
        conversation = Conversation(resume_id=resume_id, user_id=user_id)
        return await self.repo.create(conversation)

    async def send_message(self, conversation_id: str, content: str) -> Message:
        message = Message(conversation_id=conversation_id, role="user", content=content)
        return await self.repo.add_message(message)

    async def switch_mode(self, conversation_id: str, mode: str) -> Conversation | None:
        conversation = await self.repo.get_by_id(conversation_id)
        if conversation:
            conversation.mode = mode
            return await self.repo.update(conversation)
        return None
