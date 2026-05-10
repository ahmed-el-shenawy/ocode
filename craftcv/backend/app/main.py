from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import auth, templates, resumes, studio, chat, pdf


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(title="CraftCV API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(templates.router, prefix="/api/v1")
app.include_router(resumes.router, prefix="/api/v1")
app.include_router(studio.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(pdf.router, prefix="/api/v1")
