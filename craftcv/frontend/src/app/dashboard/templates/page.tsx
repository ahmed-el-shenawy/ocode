"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, FileText } from "lucide-react";
import { toast } from "sonner";
import { useTemplates } from "@/hooks/useTemplates";
import { useResume } from "@/hooks/useResume";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
import { Skeleton } from "@/components/ui/Skeleton";
import { LoadingButton } from "@/components/ui/LoadingButton";
import type { Template } from "@/types/template";

export default function TemplatesPage() {
  const router = useRouter();
  const { templates, loading, error, refetch } = useTemplates();
  const { createResume } = useResume();
  const [selected, setSelected] = useState<Template | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  async function handleUseTemplate() {
    if (!selected) return;
    setIsCreating(true);
    try {
      const resume = await createResume(selected.id, `My ${selected.name}`);
      toast.success("Resume created successfully");
      router.push(`/studio/${resume.id}`);
    } catch {
      toast.error("Failed to create resume");
      setIsCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Choose a Template</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rect" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-6">Choose a Template</h1>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <LoadingButton onClick={refetch} variant="secondary" size="sm">
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </LoadingButton>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="animate-fade-in">
        <TemplatePreview
          template={selected}
          onBack={() => setSelected(null)}
          onUseTemplate={handleUseTemplate}
          isCreating={isCreating}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Choose a Template</h1>
      {templates.length === 0 ? (
        <div className="text-center py-16">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-1">No templates available</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
            Templates will appear here once they are added by the admin.
          </p>
        </div>
      ) : (
        <TemplateGrid templates={templates} onSelect={setSelected} />
      )}
    </div>
  );
}
