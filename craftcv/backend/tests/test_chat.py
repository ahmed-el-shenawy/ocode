from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.database import get_db
from app.core.dependencies import get_current_user, get_supabase
from app.main import app


class TestChat:
    @pytest.fixture(autouse=True)
    def _setup(self):
        yield
        app.dependency_overrides.clear()

    async def _make_client(self, mock_db, mock_supabase=None):
        async def _db():
            yield mock_db
        app.dependency_overrides[get_db] = _db
        app.dependency_overrides[get_supabase] = lambda: mock_supabase or MagicMock()
        app.dependency_overrides[get_current_user] = lambda: "test-user-id"
        transport = ASGITransport(app=app)
        return AsyncClient(transport=transport, base_url="http://test")

    async def test_create_conversation(self):
        mock_db = AsyncMock()
        result = MagicMock()
        result.scalar_one_or_none.return_value = None
        mock_db.execute = AsyncMock(return_value=result)
        mock_db.add = MagicMock()
        mock_db.commit = AsyncMock()
        mock_db.refresh = AsyncMock()

        async with await self._make_client(mock_db) as c:
            response = await c.post("/api/v1/chat/conversation/00000000-0000-0000-0000-000000000001")
            assert response.status_code == 201

    async def test_send_message(self):
        conv = MagicMock()
        conv.id = "conv-id"
        conv.user_id = "test-user-id"
        conv.resume_id = "resume-id"
        conv.mode = "guided"
        conv.progress = {}

        mock_db = AsyncMock()
        result = MagicMock()
        result.scalar_one_or_none.return_value = conv
        mock_db.execute = AsyncMock(return_value=result)
        mock_db.add = MagicMock()
        mock_db.commit = AsyncMock()
        mock_db.refresh = AsyncMock()

        async with await self._make_client(mock_db) as c:
            with patch("app.services.chat_service.CvAgent.process", new=AsyncMock(return_value={
                "reply": "AI response",
                "progress": {"completed": []},
                "intent": "free_form",
            })):
                response = await c.post(
                    "/api/v1/chat/message/conv-id",
                    json={"content": "Help me write a summary"},
                )
                assert response.status_code == 200
                data = response.json()
                assert data["reply"] == "AI response"

    async def test_send_message_conversation_not_found(self):
        mock_db = AsyncMock()
        result = MagicMock()
        result.scalar_one_or_none.return_value = None
        mock_db.execute = AsyncMock(return_value=result)

        async with await self._make_client(mock_db) as c:
            response = await c.post(
                "/api/v1/chat/message/nonexistent",
                json={"content": "Hello"},
            )
            assert response.status_code == 404

    async def test_switch_mode(self):
        conv = MagicMock()
        conv.id = "conv-id"
        conv.user_id = "test-user-id"
        conv.mode = "guided"

        mock_db = AsyncMock()
        result = MagicMock()
        result.scalar_one_or_none.return_value = conv
        mock_db.execute = AsyncMock(return_value=result)
        mock_db.commit = AsyncMock()
        mock_db.refresh = AsyncMock()

        async with await self._make_client(mock_db) as c:
            response = await c.post(
                "/api/v1/chat/switch-mode/conv-id",
                json={"mode": "free"},
            )
            assert response.status_code == 200
            data = response.json()
            assert data["mode"] == "free"

    async def test_get_messages(self):
        msg = MagicMock()
        msg.id = "msg-id"
        msg.role = "user"
        msg.content = "Hello"
        msg.created_at = "2024-01-01T00:00:00"

        conv = MagicMock()
        conv.id = "conv-id"
        conv.user_id = "test-user-id"

        mock_db = AsyncMock()
        result = MagicMock()
        result.scalar_one_or_none.return_value = conv
        result.scalars().all.return_value = [msg]
        mock_db.execute = AsyncMock(return_value=result)

        async with await self._make_client(mock_db) as c:
            response = await c.get("/api/v1/chat/messages/conv-id")
            assert response.status_code == 200
