"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
          {SECTION_TYPES.map((sec) => (
            <button
              key={sec.type}
              onClick={() => handleAdd(sec.type, sec.label)}
              className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
            >
              {sec.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
