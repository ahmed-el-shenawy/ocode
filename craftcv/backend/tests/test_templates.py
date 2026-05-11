from unittest.mock import AsyncMock, MagicMock

import pytest
from httpx import AsyncClient


class TestTemplates:
    @pytest.fixture(autouse=True)
    def setup_mocks(self, mock_db_session):
        self.db = mock_db_session

    def _mock_result(self, scalars_return=None, scalar_one_or_none_return=None):
        result = MagicMock()
        scalars_mock = MagicMock()
        if scalars_return is not None:
            scalars_mock.all.return_value = scalars_return
        result.scalars.return_value = scalars_mock
        result.scalar_one_or_none.return_value = scalar_one_or_none_return
        return result

    async def test_list_public_templates(self, client: AsyncClient):
        result = self._mock_result(scalars_return=[])
        self.db.execute = AsyncMock(return_value=result)
        response = await client.get("/api/v1/templates/public")
        assert response.status_code == 200

    async def test_list_user_templates(self, auth_client: AsyncClient):
        result = self._mock_result(scalars_return=[])
        self.db.execute = AsyncMock(return_value=result)
        response = await auth_client.get("/api/v1/templates/")
        assert response.status_code == 200

    async def test_get_template_not_found(self, client: AsyncClient):
        result = self._mock_result(scalar_one_or_none_return=None)
        self.db.execute = AsyncMock(return_value=result)
        response = await client.get(
            "/api/v1/templates/00000000-0000-0000-0000-000000000099"
        )
        assert response.status_code == 404

    async def test_create_template(self, auth_client: AsyncClient):
        result = self._mock_result(scalar_one_or_none_return=None)
        self.db.execute = AsyncMock(return_value=result)
        self.db.commit = AsyncMock()
        self.db.refresh = AsyncMock()
        self.db.add = MagicMock()

        definition = {
            "sections": [
                {
                    "id": "header",
                    "type": "header",
                    "label": "Header",
                    "fields": {
                        "name": {"type": "text", "label": "Full Name", "required": True},
                    },
                }
            ],
            "layout": {"columns": 1},
        }
        response = await auth_client.post(
            "/api/v1/templates/",
            json={"name": "Test Template", "definition": definition},
        )
        assert response.status_code == 201

    async def test_create_template_invalid_definition(self, auth_client: AsyncClient):
        response = await auth_client.post(
            "/api/v1/templates/",
            json={
                "name": "Bad Template",
                "definition": {"sections": [], "layout": {"columns": 0}},
            },
        )
        assert response.status_code == 422
