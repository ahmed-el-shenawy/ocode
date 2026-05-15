"use client";

import { useState } from "react";
import { Plus, CheckCircle2 } from "lucide-react";
import { useStudioStore } from "@/stores/studio-store";

const SECTION_TYPES = [
  { type: "header", label: "Header" },
  { type: "summary", label: "Summary" },
  { type: "experience", label: "Experience" },
  { type: "education", label: "Education" },
  { type: "skills", label: "Skills" },
  { type: "projects", label: "Projects" },
  { type: "certifications", label: "Certifications" },
  { type: "languages", label: "Languages" },
  { type: "custom", label: "Custom" },
];

export function SectionPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const { widgets, addWidget } = useStudioStore();

  const addedTypes = new Set(widgets.map((w) => w.type));
  const allAdded = SECTION_TYPES.every((s) => addedTypes.has(s.type));
  const availableTypes = SECTION_TYPES.filter((s) => !addedTypes.has(s.type));

  function handleAdd(type: string, label: string) {
    const id = `${type}-${Date.now()}`;
    addWidget({
      id,
      sectionId: type,
      type,
      items: [],
      position: { x: 0, y: widgets.length * 100 },
      width: 100,
      styles: {},
    });
    setIsOpen(false);
  }

  return (
    <div className="fixed bottom-6 right-6">
      {isOpen && (
        <div className="absolute bottom-12 right-0 bg-white border rounded-lg shadow-lg p-2 w-48">
          {allAdded ? (
            <div className="px-3 py-4 text-center">
              <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-xs text-gray-500">All section types have been added</p>
            </div>
          ) : (
            availableTypes.map((sec) => (
              <button
                key={sec.type}
                onClick={() => handleAdd(sec.type, sec.label)}
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
              >
                {sec.label}
              </button>
            ))
          )}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
