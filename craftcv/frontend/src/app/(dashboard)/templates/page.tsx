"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { useTemplates } from "@/hooks/useTemplates";
import { useResume } from "@/hooks/useResume";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { TemplatePreview } from "@/components/templates/TemplatePreview";
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
      router.push(`/studio/${resume.id}`);
    } catch {
      setIsCreating(false);
    }
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Choose a Template</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Choose a Template</h1>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={refetch}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <TemplatePreview
        template={selected}
        onBack={() => setSelected(null)}
        onUseTemplate={handleUseTemplate}
        isCreating={isCreating}
      />
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Choose a Template</h1>
      {templates.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500">No templates available yet.</p>
        </div>
      ) : (
        <TemplateGrid templates={templates} onSelect={setSelected} />
      )}
    </div>
  );
}
