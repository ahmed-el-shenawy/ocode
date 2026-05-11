"use client";

import { AlertTriangle } from "lucide-react";
import { useStudioStore } from "@/stores/studio-store";

const statusConfig = {
  connected: { color: "bg-green-500", label: "Connected" },
  connecting: { color: "bg-yellow-500 animate-pulse", label: "Connecting..." },
  reconnecting: { color: "bg-yellow-500 animate-pulse", label: "Reconnecting..." },
  disconnected: { color: "bg-red-500", label: "Disconnected" },
  "fallback-polling": { color: "bg-yellow-500", label: "Fallback: polling" },
} as const;

export function ConnectionStatus() {
  const connectionStatus = useStudioStore((s) => s.syncState.connectionStatus);
  const isDegraded = useStudioStore((s) => s.syncState.isDegraded);
  const config = statusConfig[connectionStatus];

  return (
    <>
      {isDegraded && (
        <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border-b border-orange-200">
          <AlertTriangle className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
          <span className="text-xs text-orange-700">
            Chat service unavailable. Studio editing is still available.
          </span>
        </div>
      )}
      <div className="flex items-center gap-2 px-3 py-1.5 border-b bg-gray-50">
        <span className={`w-2 h-2 rounded-full ${config.color}`} />
        <span className="text-xs text-gray-500">{config.label}</span>
      </div>
    </>
  );
}
