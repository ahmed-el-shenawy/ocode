"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { useResume } from "@/hooks/useResume";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import { Skeleton } from "@/components/ui/Skeleton";
import { LoadingButton } from "@/components/ui/LoadingButton";
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
      <div className="animate-fade-in p-6">
        <Skeleton className="h-4 w-24 mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="aspect-[210/297]" variant="rect" />
          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <LoadingButton onClick={loadTemplate} variant="secondary" size="sm">
          <RefreshCw className="w-3.5 h-3.5" />
          Retry
        </LoadingButton>
      </div>
    );
  }

  if (!template) {
    return <div className="p-6 animate-fade-in">Template not found.</div>;
  }

  return (
    <div className="animate-fade-in">
      <TemplatePreview
        template={template}
        onBack={() => router.push("/dashboard/templates")}
        onUseTemplate={handleUseTemplate}
        isCreating={isCreating}
      />
    </div>
  );
}
