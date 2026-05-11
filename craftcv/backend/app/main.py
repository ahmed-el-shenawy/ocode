import time
from collections import defaultdict
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from app.api.v1 import auth, chat, pdf, resumes, studio, templates
from app.core.logging import LoggingMiddleware, setup_logging
from app.core.security import RateLimitMiddleware
from app.core.supabase import get_supabase_admin

_metrics: dict[str, dict] = defaultdict(lambda: {"count": 0, "total_duration_ms": 0, "errors": 0})


async def _metrics_endpoint(request: Request):
    lines = ['# HELP craftcv_request_count Total requests per endpoint']
    lines.append('# TYPE craftcv_request_count counter')
    for endpoint, data in sorted(_metrics.items()):
        lines.append(f'craftcv_request_count{{endpoint="{endpoint}"}} {data["count"]}')
    lines.append('')
    lines.append('# HELP craftcv_request_duration_ms Total request duration per endpoint')
    lines.append('# TYPE craftcv_request_duration_ms counter')
    for endpoint, data in sorted(_metrics.items()):
        lines.append(f'craftcv_request_duration_ms{{endpoint="{endpoint}"}} {data["total_duration_ms"]}')
    lines.append('')
    lines.append('# HELP craftcv_request_errors Total errors per endpoint')
    lines.append('# TYPE craftcv_request_errors counter')
    for endpoint, data in sorted(_metrics.items()):
        lines.append(f'craftcv_request_errors{{endpoint="{endpoint}"}} {data["errors"]}')
    return PlainTextResponse("\n".join(lines) + "\n")


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    admin = get_supabase_admin()
    app.state.supabase = admin
    yield


app = FastAPI(title="CraftCV API", lifespan=lifespan)

app.add_middleware(RateLimitMiddleware)
app.add_middleware(LoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def track_metrics(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = (time.time() - start) * 1000
    endpoint = f"{request.method} {request.url.path}"
    _metrics[endpoint]["count"] += 1
    _metrics[endpoint]["total_duration_ms"] += duration
    if response.status_code >= 500:
        _metrics[endpoint]["errors"] += 1
    return response


app.add_api_route("/metrics", _metrics_endpoint, include_in_schema=False)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(templates.router, prefix="/api/v1")
app.include_router(resumes.router, prefix="/api/v1")
app.include_router(studio.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(pdf.router, prefix="/api/v1")
