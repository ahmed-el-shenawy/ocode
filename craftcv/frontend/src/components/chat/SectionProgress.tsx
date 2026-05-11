"use client";

import { CheckCircle2, Circle } from "lucide-react";

interface SectionProgressProps {
  progress: Record<string, unknown>;
}

const SECTIONS = [
  { key: "header", label: "Header" },
  { key: "summary", label: "Summary" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "certifications", label: "Certifications" },
  { key: "languages", label: "Languages" },
];

export function SectionProgress({ progress }: SectionProgressProps) {
  const completedCount = Object.keys(progress).length;

  return (
    <div className="px-3 py-2 border-b">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">
          Progress ({completedCount}/{SECTIONS.length})
        </span>
      </div>
      <div className="flex gap-1">
        {SECTIONS.map((section) => {
          const isCompleted = Boolean(progress[section.key]);
          return (
            <div
              key={section.key}
              className="flex-1"
              title={section.label}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3 h-3 text-green-500 mx-auto" />
              ) : (
                <Circle className="w-3 h-3 text-gray-300 mx-auto" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
