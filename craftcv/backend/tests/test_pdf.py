from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.database import get_db
from app.core.dependencies import get_current_user, get_supabase
from app.main import app


class TestPdf:
    @pytest.fixture(autouse=True)
    def _setup(self):
        yield
        app.dependency_overrides.clear()

    async def test_download_pdf_success(self):
        resume = MagicMock()
        resume.id = "resume-id"
        resume.user_id = "test-user-id"
        resume.title = "My Resume"
        resume.content = {"sections": []}
        resume.styles = {}

        mock_db = AsyncMock()
        result = MagicMock()
        result.scalar_one_or_none.return_value = resume
        mock_db.execute = AsyncMock(return_value=result)

        async def _db():
            yield mock_db
        app.dependency_overrides[get_db] = _db
        app.dependency_overrides[get_supabase] = lambda: MagicMock()
        app.dependency_overrides[get_current_user] = lambda: "test-user-id"

        with patch("app.api.v1.pdf.generate_pdf_bytes", new=AsyncMock(return_value=b"%PDF-1.4 test data")):
            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://test") as c:
                response = await c.get("/api/v1/pdf/resumes/resume-id")
                assert response.status_code == 200
                assert response.headers["content-type"] == "application/pdf"

    async def test_download_pdf_not_found(self):
        mock_db = AsyncMock()
        result = MagicMock()
        result.scalar_one_or_none.return_value = None
        mock_db.execute = AsyncMock(return_value=result)

        async def _db():
            yield mock_db
        app.dependency_overrides[get_db] = _db
        app.dependency_overrides[get_supabase] = lambda: MagicMock()
        app.dependency_overrides[get_current_user] = lambda: "test-user-id"

        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as c:
            response = await c.get("/api/v1/pdf/resumes/nonexistent")
            assert response.status_code == 404
