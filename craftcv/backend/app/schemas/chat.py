from pydantic import BaseModel
from typing import Any


class SendMessageRequest(BaseModel):
    content: str


class SendMessageResponse(BaseModel):
    reply: str
    metadata: dict[str, Any] | None = None


class SwitchModeRequest(BaseModel):
    mode: str
