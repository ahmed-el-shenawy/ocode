from datetime import datetime
from pydantic import BaseModel
from typing import Any


class TemplateField(BaseModel):
    key: str
    label: str
    type: str
    required: bool = False


class SectionDefinition(BaseModel):
    key: str
    label: str
    fields: list[TemplateField]


class LayoutDefinition(BaseModel):
    columns: int = 1
    sections: list[str]


class TemplateDefinition(BaseModel):
    sections: list[SectionDefinition]
    layout: LayoutDefinition


class TemplateCreate(BaseModel):
    name: str
    description: str | None = None
    definition: Any
    default_styles: Any | None = None
    is_public: bool = False


class TemplateResponse(BaseModel):
    id: str
    name: str
    description: str | None = None
    thumbnail_url: str | None = None
    is_public: bool
    definition: Any
    default_styles: Any
    created_at: datetime
    updated_at: datetime
