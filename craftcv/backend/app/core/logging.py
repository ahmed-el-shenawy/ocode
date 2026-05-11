import time
import uuid

import structlog
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse


def setup_logging() -> None:
    structlog.configure(
        processors=[
            structlog.stdlib.add_log_level,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.JSONRenderer(),
        ],
        wrapper_class=structlog.stdlib.BoundLogger,
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        cache_logger_on_first_use=True,
    )


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        correlation_id = str(uuid.uuid4())
        request.state.correlation_id = correlation_id
        logger = structlog.get_logger()
        start = time.time()
        try:
            response = await call_next(request)
        except Exception as exc:
            duration = time.time() - start
            logger.error(
                "request_error",
                correlation_id=correlation_id,
                method=request.method,
                path=request.url.path,
                error=str(exc),
                duration_ms=round(duration * 1000, 2),
            )
            return JSONResponse(
                status_code=500,
                content={"detail": "Internal server error", "correlation_id": correlation_id},
            )
        duration = time.time() - start
        log_level = logger.error if response.status_code >= 500 else (logger.warning if response.status_code >= 400 else logger.info)
        log_level(
            "request",
            correlation_id=correlation_id,
            method=request.method,
            path=request.url.path,
            status=response.status_code,
            duration_ms=round(duration * 1000, 2),
        )
        response.headers["X-Correlation-ID"] = correlation_id
        return response
