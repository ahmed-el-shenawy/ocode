"use client";

import type { Resume } from "@/types/resume";

interface ResumePreviewProps {
  resume: Resume;
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-[816px] mx-auto">
      {resume.content.sections.map((section) => (
        <div key={section.section_id} className="mb-4">
          <p className="text-sm text-gray-500">
            {section.type} ({section.items.length} items)
          </p>
        </div>
      ))}
    </div>
  );
}
