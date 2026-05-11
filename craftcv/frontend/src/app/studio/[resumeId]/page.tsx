"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Save, Undo2, Redo2 } from "lucide-react";
import { Canvas } from "@/components/studio/Canvas";
import { StylePanel } from "@/components/studio/StylePanel";
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
  const resumeId = params.resumeId as string;
  const { widgets, globalStyles, setWidgets, undo, redo } = useStudioStore();
  const [saving, setSaving] = useState(false);
  const savedRef = useRef(false);

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
      const resume = await api.get<Resume>(`/resumes/${resumeId}`);
      setWidgets(buildWidgetsFromResume(resume));
    } catch (err) {
      console.error("Failed to load resume:", err);
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

  return (
    <ErrorBoundary>
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
        <Canvas />
        <StylePanel />
      </div>
    </div>
    </ErrorBoundary>
  );
}
