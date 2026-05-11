"use client";

import type { Template } from "@/types/template";
import { TemplateCard } from "./TemplateCard";

interface TemplateGridProps {
  templates: Template[];
  onSelect: (template: Template) => void;
}

export function TemplateGrid({ templates, onSelect }: TemplateGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
