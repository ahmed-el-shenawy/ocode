export interface ContentPatch {
  patchId: string;
  sectionId: string;
  fields: Record<string, unknown>;
  source: "chat" | "studio";
  timestamp: string;
}

export type ConnectionStatus =
  | "connected"
  | "connecting"
  | "reconnecting"
  | "disconnected"
  | "fallback-polling";

export interface SyncState {
  connectionStatus: ConnectionStatus;
  lastSyncAt: string | null;
  pendingPatches: number;
  conflictSectionId: string | null;
  isDegraded: boolean;
}

export interface PatchAck {
  patchId: string;
  status: "applied" | "conflict";
  currentState?: Record<string, unknown> | null;
  conflictSectionId?: string | null;
}

export interface SyncEvent {
  type: string;
  payload: Record<string, unknown>;
}

export type SyncLogger = Pick<Console, "log" | "warn" | "error">;
