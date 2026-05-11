import json
import logging
import time
from datetime import datetime, timezone
from typing import Any

from fastapi import WebSocket

logger = logging.getLogger("craftcv.sync")


class ConnectionManager:
    def __init__(self) -> None:
        self._connections: dict[str, list[WebSocket]] = {}

    def connect(self, resume_id: str, websocket: WebSocket) -> None:
        if resume_id not in self._connections:
            self._connections[resume_id] = []
        self._connections[resume_id].append(websocket)

    def disconnect(self, resume_id: str, websocket: WebSocket) -> None:
        conns = self._connections.get(resume_id, [])
        if websocket in conns:
            conns.remove(websocket)
        if not conns:
            self._connections.pop(resume_id, None)

    async def broadcast(self, resume_id: str, message: dict) -> None:
        conns = self._connections.get(resume_id, [])
        dead: list[WebSocket] = []
        for ws in conns:
            try:
                await ws.send_json(message)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self.disconnect(resume_id, ws)

    def get_active_connections(self) -> int:
        return sum(len(conns) for conns in self._connections.values())


class SyncMetrics:
    def __init__(self) -> None:
        self.patches_sent: int = 0
        self.patches_received: int = 0
        self.conflicts: int = 0
        self.errors: int = 0
        self._start_time: float = time.time()

    def record_sent(self) -> None:
        self.patches_sent += 1

    def record_received(self) -> None:
        self.patches_received += 1

    def record_conflict(self) -> None:
        self.conflicts += 1

    def record_error(self) -> None:
        self.errors += 1

    def snapshot(self) -> dict:
        return {
            "patchesSent": self.patches_sent,
            "patchesReceived": self.patches_received,
            "conflicts": self.conflicts,
            "errors": self.errors,
            "activeConnections": 0,
            "uptimeSeconds": time.time() - self._start_time,
        }


class SyncService:
    def __init__(self) -> None:
        self.manager = ConnectionManager()
        self.metrics = SyncMetrics()
        self._section_states: dict[str, dict[str, Any]] = {}

    async def handle_websocket(self, websocket: WebSocket, resume_id: str) -> None:
        await websocket.accept()
        self.manager.connect(resume_id, websocket)
        logger.info("WebSocket connected for resume %s", resume_id)

        try:
            auth_msg = await websocket.receive_json()
            if not self._validate_auth(auth_msg):
                await websocket.send_json({"type": "auth_error", "payload": {"error": "AUTH_FAILED"}})
                return

            await websocket.send_json({"type": "auth_ok", "payload": {"resumeId": resume_id}})

            state = self._build_state_snapshot(resume_id)
            await websocket.send_json({"type": "state_sync", "payload": state})

            while True:
                data = await websocket.receive_json()
                msg_type = data.get("type")

                if msg_type == "ping":
                    await websocket.send_json({"type": "pong", "payload": {}})

                elif msg_type == "patch":
                    result = await self._apply_patch(resume_id, data.get("payload", {}))
                    await websocket.send_json({"type": "patch_ack", "payload": result})

                    if result.get("status") == "applied":
                        broadcast_msg = {
                            "type": "patch_broadcast",
                            "payload": data["payload"],
                        }
                        await self.manager.broadcast(resume_id, broadcast_msg)

        except Exception:
            logger.exception("WebSocket error for resume %s", resume_id)
            self.metrics.record_error()
        finally:
            self.manager.disconnect(resume_id, websocket)
            logger.info("WebSocket disconnected for resume %s", resume_id)

    def _validate_auth(self, msg: dict) -> bool:
        return msg.get("type") == "auth" and bool(msg.get("payload", {}).get("token"))

    def _build_state_snapshot(self, resume_id: str) -> dict:
        sections_data = self._section_states.get(resume_id, {})
        sections = [
            {"id": sid, "fields": data.get("fields", {}), "updatedAt": data.get("updated_at", "")}
            for sid, data in sections_data.items()
        ]
        return {"sections": sections, "updatedAt": datetime.now(timezone.utc).isoformat()}

    async def _apply_patch(self, resume_id: str, payload: dict) -> dict:
        section_id = payload.get("sectionId")
        patch_timestamp = payload.get("timestamp", "")
        patch_fields = payload.get("fields", {})

        self.metrics.record_received()

        if not section_id:
            self.metrics.record_error()
            return {"patchId": payload.get("patchId", ""), "status": "error", "currentState": None, "conflictSectionId": None}

        existing = self._section_states.get(resume_id, {}).get(section_id, {})
        existing_timestamp = existing.get("updated_at", "")

        if existing_timestamp and patch_timestamp < existing_timestamp:
            self.metrics.record_conflict()
            return {
                "patchId": payload.get("patchId", ""),
                "status": "conflict",
                "currentState": existing.get("fields", {}),
                "conflictSectionId": section_id,
            }

        if resume_id not in self._section_states:
            self._section_states[resume_id] = {}
        self._section_states[resume_id][section_id] = {
            "fields": {**(existing.get("fields", {})), **patch_fields},
            "updated_at": patch_timestamp or datetime.now(timezone.utc).isoformat(),
        }

        self.metrics.record_sent()
        return {"patchId": payload.get("patchId", ""), "status": "applied", "currentState": None, "conflictSectionId": None}

    def get_state(self, resume_id: str) -> dict:
        sections_data = self._section_states.get(resume_id, {})
        sections = [
            {"id": sid, "fields": data.get("fields", {}), "updatedAt": data.get("updated_at", "")}
            for sid, data in sections_data.items()
        ]
        return {"sections": sections, "updatedAt": datetime.now(timezone.utc).isoformat()}

    async def apply_patch_rest(self, resume_id: str, payload: dict) -> dict:
        return await self._apply_patch(resume_id, payload)

    def get_metrics(self) -> dict:
        m = self.metrics.snapshot()
        m["activeConnections"] = self.manager.get_active_connections()
        return m
