"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Resume } from "@/types/resume";

export function useResume() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  async function loadResumes() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<Resume[]>("/resumes/");
      setResumes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resumes");
    } finally {
      setLoading(false);
    }
  }

  async function createResume(templateId: string, title?: string) {
    const resume = await api.post<Resume>("/resumes/", {
      template_id: templateId,
      title: title || "Untitled Resume",
    });
    setResumes((prev) => [resume, ...prev]);
    return resume;
  }

  return { resumes, loading, error, createResume, refetch: loadResumes };
}
