from datetime import datetime
from pydantic import BaseModel
from typing import Any


class SectionItemData(BaseModel):
    id: str
    type: str
    content: Any


class ResumeContent(BaseModel):
    sections: list[SectionItemData]


class ResumeCreate(BaseModel):
    title: str
    template_id: str | None = None
    content: Any | None = None
    styles: Any | None = None


class ResumeUpdate(BaseModel):
    title: str | None = None
    content: Any | None = None
    styles: Any | None = None


class ResumeResponse(BaseModel):
    id: str
    user_id: str
    template_id: str | None = None
    title: str
    content: Any
    styles: Any
    status: str
    created_at: datetime
    updated_at: datetime
