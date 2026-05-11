import time
from collections import defaultdict

from passlib.context import CryptContext
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

RATE_LIMIT_WINDOW = 60
RATE_LIMIT_MAX = 5
_rate_store: dict[str, list[float]] = defaultdict(list)


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path.startswith("/api/v1/auth"):
            ip = request.client.host if request.client else "unknown"
            now = time.time()
            window_start = now - RATE_LIMIT_WINDOW
            _rate_store[ip] = [t for t in _rate_store[ip] if t > window_start]
            if len(_rate_store[ip]) >= RATE_LIMIT_MAX:
                return JSONResponse(
                    status_code=429,
                    content={"detail": "Rate limit exceeded. Try again later."},
                )
            _rate_store[ip].append(now)
        return await call_next(request)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(data: dict) -> str:
    from datetime import datetime, timedelta

    from jose import jwt

    from app.core.config import settings
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)
