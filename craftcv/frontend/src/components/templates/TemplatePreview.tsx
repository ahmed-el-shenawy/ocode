"use client";

import { FileText, ArrowLeft, Check } from "lucide-react";
import type { Template } from "@/types/template";

interface TemplatePreviewProps {
  template: Template;
  onBack: () => void;
  onUseTemplate: () => void;
  isCreating: boolean;
}

export function TemplatePreview({
  template,
  onBack,
  onUseTemplate,
  isCreating,
}: TemplatePreviewProps) {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to templates
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-[210/297] bg-gray-50 rounded-lg border flex items-center justify-center">
          <FileText className="w-16 h-16 text-gray-300" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
          {template.description && (
            <p className="text-gray-600 mt-2">{template.description}</p>
          )}

          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-2">Sections</h3>
            <ul className="space-y-1">
              {template.definition.sections.map((section) => (
                <li
                  key={section.id}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <Check className="w-3.5 h-3.5 text-green-500" />
                  {section.label}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onUseTemplate}
            disabled={isCreating}
            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
          >
            {isCreating ? "Creating..." : "Use This Template"}
          </button>
        </div>
      </div>
    </div>
  );
}
