"use client";

import { useCallback } from "react";
import { api } from "@/lib/api";
import { useStudioStore } from "@/stores/studio-store";
import type { Resume } from "@/types/resume";

export function useStudio(resumeId: string) {
  const { widgets, globalStyles, setWidgets } = useStudioStore();

  const loadResume = useCallback(async () => {
    const resume = await api.get<Resume>(`/resumes/${resumeId}`);
    const widgetList = resume.content.sections.map((section, index) => ({
      id: section.section_id,
      sectionId: section.section_id,
      type: section.type,
      items: section.items,
      position: { x: 0, y: index * 100 },
      width: 100,
      styles: {},
    }));
    setWidgets(widgetList);
    return resume;
  }, [resumeId, setWidgets]);

  const saveResume = useCallback(async () => {
    const sections = widgets.map((w) => ({
      section_id: w.sectionId,
      type: w.type,
      items: w.items,
    }));

    await api.patch(`/resumes/${resumeId}`, {
      content: { sections },
      styles: globalStyles,
    });
  }, [resumeId, widgets, globalStyles]);

  return { loadResume, saveResume };
}
