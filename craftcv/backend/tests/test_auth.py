from unittest.mock import MagicMock

import pytest
from httpx import AsyncClient


class TestAuth:
    @pytest.fixture(autouse=True)
    def setup_mocks(self, mock_supabase):
        self.supabase = mock_supabase

    async def test_signup_success(self, client: AsyncClient):
        mock_user = MagicMock()
        mock_user.id = "test-id"
        mock_user.email = "test@example.com"
        self.supabase.auth.sign_up.return_value.user = mock_user

        response = await client.post(
            "/api/v1/auth/signup",
            json={"email": "test@example.com", "password": "pass123", "full_name": "Test"},
        )
        assert response.status_code == 201
        data = response.json()
        assert data["user_id"] == "test-id"
        self.supabase.auth.sign_up.assert_called_once()

    async def test_signin_success(self, client: AsyncClient):
        mock_session = MagicMock()
        mock_session.access_token = "test-token"
        mock_session.refresh_token = "test-refresh"
        mock_user = MagicMock()
        mock_user.id = "user-id"
        self.supabase.auth.sign_in_with_password.return_value.session = mock_session
        self.supabase.auth.sign_in_with_password.return_value.user = mock_user

        response = await client.post(
            "/api/v1/auth/signin",
            json={"email": "test@example.com", "password": "pass123"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["access_token"] == "test-token"

    async def test_signin_wrong_password(self, client: AsyncClient):
        self.supabase.auth.sign_in_with_password.side_effect = Exception("Invalid login credentials")

        response = await client.post(
            "/api/v1/auth/signin",
            json={"email": "test@example.com", "password": "wrong"},
        )
        assert response.status_code == 401

    async def test_logout_success(self, auth_client: AsyncClient):
        response = await auth_client.post("/api/v1/auth/logout")
        assert response.status_code == 200

    async def test_protected_route_no_token(self, client: AsyncClient):
        response = await client.post("/api/v1/auth/logout")
        assert response.status_code == 401

    async def test_rate_limit(self, client: AsyncClient):
        for _ in range(5):
            await client.post(
                "/api/v1/auth/signin",
                json={"email": "rate@test.com", "password": "pass"},
            )
        response = await client.post(
            "/api/v1/auth/signin",
            json={"email": "rate@test.com", "password": "pass"},
        )
        assert response.status_code == 429
