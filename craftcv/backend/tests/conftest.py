from unittest.mock import AsyncMock, MagicMock

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.dependencies import get_current_user, get_supabase
from app.main import app


@pytest.fixture
def mock_supabase():
    client = MagicMock()
    client.auth = MagicMock()
    client.auth.sign_up = MagicMock()
    client.auth.sign_in_with_password = MagicMock()
    client.auth.admin.sign_out = MagicMock()
    return client


@pytest.fixture
def mock_db_session():
    session = AsyncMock(spec=AsyncSession)
    session.__aenter__ = AsyncMock(return_value=session)
    session.__aexit__ = AsyncMock(return_value=None)
    return session


@pytest.fixture
def override_deps(mock_supabase, mock_db_session):
    async def _get_db_override():
        yield mock_db_session

    app.dependency_overrides[get_db] = _get_db_override
    app.dependency_overrides[get_supabase] = lambda: mock_supabase
    yield
    app.dependency_overrides.clear()


@pytest.fixture
def auth_headers():
    async def _override():
        return "test-user-id"

    app.dependency_overrides[get_current_user] = _override
    yield
    app.dependency_overrides.pop(get_current_user, None)


@pytest.fixture
async def client(override_deps):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


@pytest.fixture
async def auth_client(client, auth_headers):
    yield client
