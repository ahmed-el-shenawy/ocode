from datetime import datetime

from pydantic import BaseModel


class ContentPatch(BaseModel):
    patchId: str
    sectionId: str
    fields: dict
    source: str
    timestamp: str


class SyncEvent(BaseModel):
    type: str
    payload: dict


class SectionState(BaseModel):
    id: str
    fields: dict
    updatedAt: str


class PollingStateResponse(BaseModel):
    sections: list[SectionState]
    updatedAt: str


class PatchAck(BaseModel):
    patchId: str
    status: str
    currentState: dict | None = None
    conflictSectionId: str | None = None


class SyncMetrics(BaseModel):
    patchesSent: int = 0
    patchesReceived: int = 0
    conflicts: int = 0
    errors: int = 0
    activeConnections: int = 0
    uptimeSeconds: float = 0
