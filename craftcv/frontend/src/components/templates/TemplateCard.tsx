"use client";

import { FileText } from "lucide-react";
import type { Template } from "@/types/template";

interface TemplateCardProps {
  template: Template;
  onSelect: (template: Template) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  return (
    <button
      onClick={() => onSelect(template)}
      className="group text-left border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
    >
      <div className="aspect-[210/297] bg-gray-50 rounded mb-3 flex items-center justify-center border">
        <FileText className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="font-medium text-gray-900">{template.name}</h3>
      {template.description && (
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {template.description}
        </p>
      )}
    </button>
  );
}
