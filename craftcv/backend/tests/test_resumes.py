from unittest.mock import AsyncMock, MagicMock

import pytest
from httpx import ASGITransport, AsyncClient

from app.core.database import get_db
from app.core.dependencies import get_current_user, get_supabase
from app.main import app
from app.models.resume import Resume


def _mock_result(scalars_return=None, scalar_one_or_none_return=None):
    result = MagicMock()
    scalars_mock = MagicMock()
    if scalars_return is not None:
        scalars_mock.all.return_value = scalars_return
    result.scalars.return_value = scalars_mock
    result.scalar_one_or_none.return_value = scalar_one_or_none_return
    return result


def _override_db(mock_db):
    async def _gen():
        yield mock_db
    return _gen


class TestResumes:
    @pytest.fixture(autouse=True)
    def _setup(self):
        yield
        app.dependency_overrides.clear()

    async def _send(self, method, path, json=None, mock_db=None):
        db = mock_db or AsyncMock()
        supabase = MagicMock()
        async def _db():
            yield db
        app.dependency_overrides[get_db] = _db
        app.dependency_overrides[get_supabase] = lambda: supabase
        app.dependency_overrides[get_current_user] = lambda: "test-user-id"
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as c:
            if method == "GET":
                return await c.get(path)
            elif method == "POST":
                return await c.post(path, json=json)
            elif method == "PATCH":
                return await c.patch(path, json=json)
            elif method == "DELETE":
                return await c.delete(path)

    async def test_list_resumes(self):
        db = AsyncMock()
        db.execute = AsyncMock(return_value=_mock_result(scalars_return=[]))
        response = await self._send("GET", "/api/v1/resumes/", mock_db=db)
        assert response.status_code == 200

    async def test_create_resume(self):
        db = AsyncMock()
        db.execute = AsyncMock(return_value=_mock_result(scalar_one_or_none_return=None))
        db.add = MagicMock()
        db.commit = AsyncMock()
        db.refresh = AsyncMock()
        response = await self._send("POST", "/api/v1/resumes/",
                                    json={"title": "My Resume", "template_id": "00000000-0000-0000-0000-000000000001"},
                                    mock_db=db)
        assert response.status_code == 201

    async def test_get_resume_not_found(self):
        db = AsyncMock()
        db.execute = AsyncMock(return_value=_mock_result(scalar_one_or_none_return=None))
        response = await self._send("GET", "/api/v1/resumes/00000000-0000-0000-0000-000000000099", mock_db=db)
        assert response.status_code == 404

    async def test_delete_resume_not_found(self):
        db = AsyncMock()
        db.execute = AsyncMock(return_value=_mock_result(scalar_one_or_none_return=None))
        response = await self._send("DELETE", "/api/v1/resumes/00000000-0000-0000-0000-000000000099", mock_db=db)
        assert response.status_code == 404

    async def test_access_other_user_resume_returns_403(self):
        other = MagicMock(spec=Resume)
        other.user_id = "other-user-id"
        db = AsyncMock()
        db.execute = AsyncMock(return_value=_mock_result(scalar_one_or_none_return=other))
        response = await self._send("GET", "/api/v1/resumes/00000000-0000-0000-0000-000000000001", mock_db=db)
        assert response.status_code == 403
