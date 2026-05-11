import { supabase } from "@/lib/supabase";
import { api } from "@/lib/api";
import type {
  ContentPatch,
  ConnectionStatus,
  PatchAck,
  SyncEvent,
} from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const MAX_RETRIES = 3;
const POLLING_INTERVAL = 3000;

export type SyncMessageHandler = (event: SyncEvent) => void;
export type StatusChangeHandler = (status: ConnectionStatus) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private resumeId: string;
  private retryCount = 0;
  private retryTimer: ReturnType<typeof setTimeout> | null = null;
  private pollingTimer: ReturnType<typeof setInterval> | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private isDestroyed = false;
  private onMessage: SyncMessageHandler;
  private onStatusChange: StatusChangeHandler;

  constructor(
    resumeId: string,
    onMessage: SyncMessageHandler,
    onStatusChange: StatusChangeHandler,
  ) {
    this.resumeId = resumeId;
    this.onMessage = onMessage;
    this.onStatusChange = onStatusChange;
  }

  async connect() {
    if (this.isDestroyed) return;
    this.logConnectionTransition(null, "connecting");
    this.onStatusChange("connecting");

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) {
      this.onStatusChange("disconnected");
      return;
    }

    const wsUrl = `${BASE_URL.replace(/^http/, "ws")}/api/v1/studio/ws/${this.resumeId}/sync`;

    try {
      this.ws = new WebSocket(wsUrl);
      this.ws.onopen = () => {
        this.ws?.send(
          JSON.stringify({ type: "auth", payload: { token } }),
        );
      };

      this.ws.onmessage = (event) => {
        try {
          const msg: SyncEvent = JSON.parse(event.data);
          this.handleServerMessage(msg);
        } catch {
          console.warn("Failed to parse WebSocket message");
        }
      };

      this.ws.onclose = () => {
        this.metrics.log("WebSocket closed");
        this.cleanup();
        if (!this.isDestroyed) {
          this.attemptReconnect();
        }
      };

      this.ws.onerror = () => {
        this.metrics.error("WebSocket connection error");
      };
    } catch {
      this.attemptReconnect();
    }
  }

  private handleServerMessage(msg: SyncEvent) {
    switch (msg.type) {
      case "auth_ok":
        this.retryCount = 0;
        this.logConnectionTransition("reconnecting", "connected");
        this.onStatusChange("connected");
        this.startPing();
        break;
      case "auth_error":
        this.metrics.error("Authentication failed");
        this.onStatusChange("disconnected");
        break;
      case "state_sync":
        this.metrics.log("State sync received");
        this.onMessage(msg);
        break;
      case "patch_broadcast":
        this.logPatchEvent("received");
        this.onMessage(msg);
        break;
      case "patch_ack": {
        const payload = msg.payload as { patchId?: string; status?: string };
        this.logPatchEvent(payload.status === "conflict" ? "conflict" : "ack", payload.patchId);
        this.onMessage(msg);
        break;
      }
      case "error":
        this.metrics.error("Server error:", msg.payload);
        break;
    }
  }

  sendPatch(patch: ContentPatch) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({ type: "patch", payload: patch }),
      );
    }
  }

  private attemptReconnect() {
    if (this.isDestroyed) return;

    if (this.retryCount < MAX_RETRIES) {
      this.retryCount++;
      this.logConnectionTransition("disconnected", "reconnecting");
      this.onStatusChange("reconnecting");
      const delay = Math.min(1000 * Math.pow(2, this.retryCount - 1), 30000);
      this.metrics.log(`Reconnecting in ${delay}ms (attempt ${this.retryCount}/${MAX_RETRIES})`);
      this.retryTimer = setTimeout(() => this.connect(), delay);
    } else {
      this.metrics.warn("Max retries reached, switching to polling");
      this.startPolling();
    }
  }

  private startPolling() {
    this.logConnectionTransition("reconnecting", "fallback-polling");
    this.onStatusChange("fallback-polling");
    this.metrics.log("Polling started at 3s interval");
    this.pollingTimer = setInterval(async () => {
      try {
        const state = await api.get<{
          sections: Array<{ id: string; fields: Record<string, unknown>; updatedAt: string }>;
          updatedAt: string;
        }>(`/studio/sync/${this.resumeId}/state`);
        this.onMessage({
          type: "state_sync",
          payload: state as unknown as Record<string, unknown>,
        });
      } catch {
        this.metrics.warn("Polling failed");
      }
    }, POLLING_INTERVAL);
  }

  private startPing() {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping", payload: {} }));
      }
    }, 30000);
  }

  private cleanup() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = null;
    }
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    this.ws = null;
  }

  destroy() {
    this.isDestroyed = true;
    this.cleanup();
    this.ws?.close();
  }

  private metrics = {
    log: (message: string, ...args: unknown[]) =>
      console.log(`[Sync:${this.resumeId}]`, message, ...args),
    warn: (message: string, ...args: unknown[]) =>
      console.warn(`[Sync:${this.resumeId}]`, message, ...args),
    error: (message: string, ...args: unknown[]) =>
      console.error(`[Sync:${this.resumeId}]`, message, ...args),
  };

  private logConnectionTransition(from: ConnectionStatus | null, to: ConnectionStatus) {
    this.metrics.log(`Connection: ${from || "initial"} → ${to}`);
  }

  private logPatchEvent(event: string, patchId?: string) {
    this.metrics.log(`Patch ${event}${patchId ? ` [${patchId}]` : ""}`);
  }
}
