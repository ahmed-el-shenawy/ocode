"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MessageSquare, Save, Undo2, Redo2 } from "lucide-react";
import { Canvas } from "@/components/studio/Canvas";
import { StylePanel } from "@/components/studio/StylePanel";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { ConnectionStatus } from "@/components/studio/ConnectionStatus";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useStudioStore } from "@/stores/studio-store";
import { api } from "@/lib/api";
import type { Resume } from "@/types/resume";

function buildWidgetsFromResume(resume: Resume) {
  return resume.content.sections.map((section, index) => ({
    id: section.section_id,
    sectionId: section.section_id,
    type: section.type,
    items: section.items,
    position: { x: 0, y: index * 100 },
    width: 100,
    styles: {},
  }));
}

export default function StudioPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.resumeId as string;
  const { widgets, globalStyles, setWidgets, undo, redo } = useStudioStore();
  const [saving, setSaving] = useState(false);
  const [chatOpen, setChatOpen] = useState(true);
  const [chatWidth, setChatWidth] = useState(380);
  const [error, setError] = useState<string | null>(null);
  const savedRef = useRef(false);
  const resizeRef = useRef(false);

  useEffect(() => {
    loadResume();
  }, [resumeId]);

  useEffect(() => {
    savedRef.current = false;
  }, [widgets, globalStyles]);

  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (!savedRef.current) {
        e.preventDefault();
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  async function loadResume() {
    try {
      setError(null);
      const resume = await api.get<Resume>(`/resumes/${resumeId}`);
      setWidgets(buildWidgetsFromResume(resume));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load resume";
      if (message.includes("404") || message.includes("Not Found")) {
        setError("This resume was not found or has been deleted.");
      } else {
        setError(message);
      }
    }
  }

  async function saveResume() {
    setSaving(true);
    try {
      const sections = widgets.map((w) => ({
        section_id: w.sectionId,
        type: w.type,
        items: w.items,
      }));

      await api.patch(`/resumes/${resumeId}`, {
        content: { sections },
        styles: globalStyles,
      });
      savedRef.current = true;
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  }

  const handleResizeStart = useCallback(() => {
    resizeRef.current = true;
    const handleMouseMove = (e: MouseEvent) => {
      if (!resizeRef.current) return;
      setChatWidth((prev) => {
        const newWidth = prev - e.movementX;
        return Math.max(280, Math.min(600, newWidth));
      });
    };
    const handleMouseUp = () => {
      resizeRef.current = false;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <ErrorBoundary>
    {error ? (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-sm border p-8 max-w-md text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Resume Not Found</h2>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    ) : (
    <div className="h-screen flex flex-col">
      <div className="flex items-center justify-between border-b bg-white px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            className="p-1.5 hover:bg-gray-100 rounded"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            className="p-1.5 hover:bg-gray-100 rounded"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
              chatOpen
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "hover:bg-gray-50"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Assistant
          </button>
          <button
            onClick={saveResume}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <Canvas resumeId={resumeId} />
        {chatOpen && (
          <>
            <div
              className="w-1.5 cursor-col-resize bg-gray-200 hover:bg-blue-300 transition-colors flex-shrink-0"
              onMouseDown={handleResizeStart}
            />
            <div
              className="flex flex-col border-l flex-shrink-0"
              style={{ width: chatWidth }}
            >
              <ConnectionStatus />
              <div className="flex-1 overflow-hidden">
                <ChatPanel resumeId={resumeId} />
              </div>
            </div>
          </>
        )}
        <StylePanel />
      </div>
    </div>
    )}
    </ErrorBoundary>
  );
}
