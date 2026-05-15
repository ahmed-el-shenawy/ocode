"use client";

import type { Resume } from "@/types/resume";

interface ResumeListItemProps {
  resume: Resume;
  onClick: (id: string) => void;
}

export function ResumeListItem({ resume, onClick }: ResumeListItemProps) {
  return (
    <button
      onClick={() => onClick(resume.id)}
      className="block w-full text-left p-4 border rounded-lg hover:shadow-lg hover:border-blue-200 transition-all duration-200 bg-white hover:scale-[1.02]"
    >
      <h3 className="font-medium text-gray-900">{resume.title}</h3>
      <p className="text-sm text-gray-500 mt-1">
        {resume.status === "draft" ? "Draft" : "Complete"}
      </p>
      <p className="text-xs text-gray-400 mt-2">
        Updated {new Date(resume.updated_at).toLocaleDateString()}
      </p>
    </button>
  );
}
