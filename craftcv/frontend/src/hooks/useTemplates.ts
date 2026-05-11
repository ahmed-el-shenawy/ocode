"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import type { Template } from "@/types/template";

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<Template[]>("/templates/");
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load templates");
    } finally {
      setLoading(false);
    }
  }

  return { templates, loading, error, refetch: loadTemplates };
}
