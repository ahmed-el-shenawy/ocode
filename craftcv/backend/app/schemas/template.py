from datetime import datetime
from pydantic import BaseModel, Field
from typing import Any, Optional

from app.core.validation import TemplateSchemaValidator


class TemplateField(BaseModel):
    type: str
    label: str = Field(max_length=255)
    required: bool = False
    max_length: int | None = None
    min: int | None = None
    max: int | None = None
    options: list[str] | None = None


class SectionDefinition(BaseModel):
    id: str = Field(pattern=r"^[a-z0-9-]+$", max_length=64)
    type: str
    label: str = Field(max_length=255)
    required: bool = False
    min_items: int = 0
    max_items: int | None = None
    fields: dict[str, TemplateField]


class LayoutDefinition(BaseModel):
    columns: int = 1
    color_scheme: dict[str, str] | None = None
    fonts: dict[str, str] | None = None


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
