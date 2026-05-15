"use client";

import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";

export function NetworkBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    function handleOnline() {
      setOffline(false);
    }
    function handleOffline() {
      setOffline(true);
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setOffline(!navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-red-50 border-b border-red-200">
      <WifiOff className="w-4 h-4 text-red-600 flex-shrink-0" />
      <span className="text-sm text-red-700 flex-1">
        You are offline. Changes will not be saved until connection is restored.
      </span>
      <button
        onClick={() => window.location.reload()}
        className="flex items-center gap-1 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
      >
        <RefreshCw className="w-3 h-3" />
        Retry
      </button>
    </div>
  );
}
