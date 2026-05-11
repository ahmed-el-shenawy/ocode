"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { useResume } from "@/hooks/useResume";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import type { Template } from "@/types/template";

export default function TemplateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { createResume } = useResume();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  function loadTemplate() {
    setLoading(true);
    setError(null);
    api.get<Template>(`/templates/${params.id}`)
      .then(setTemplate)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load template"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadTemplate();
  }, [params.id]);

  async function handleUseTemplate() {
    if (!template) return;
    setIsCreating(true);
    try {
      const resume = await createResume(template.id, `My ${template.name}`);
      router.push(`/studio/${resume.id}`);
    } catch {
      setIsCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse p-6">
        <div className="h-4 bg-gray-200 rounded w-24 mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-[210/297] bg-gray-100 rounded-lg" />
          <div className="space-y-3">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <button
          onClick={loadTemplate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </button>
      </div>
    );
  }

  if (!template) {
    return <div className="p-6">Template not found.</div>;
  }

  return (
    <TemplatePreview
      template={template}
      onBack={() => router.push("/dashboard/templates")}
      onUseTemplate={handleUseTemplate}
      isCreating={isCreating}
    />
  );
}
