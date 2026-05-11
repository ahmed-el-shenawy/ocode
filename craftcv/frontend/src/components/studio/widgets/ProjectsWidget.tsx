"use client";

import { ExternalLink } from "lucide-react";

interface ProjectsWidgetProps {
  items: Record<string, unknown>[];
}

export function ProjectsWidget({ items }: ProjectsWidgetProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
        Projects
      </h2>
      {items.length === 0 && (
        <p className="text-gray-400 text-sm">No projects added yet</p>
      )}
      {items.map((item, idx) => (
        <div key={idx} className="mb-3">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">
              {String(item.title || "")}
            </h3>
            {Boolean(item.link) && (
              <a
                href={String(item.link)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          {Boolean(item.bullets) && Array.isArray(item.bullets) && (
            <ul className="mt-1 list-disc list-inside text-sm text-gray-600 space-y-0.5 break-words">
              {(item.bullets as string[]).map((bullet, bi) => (
                <li key={bi}>{bullet}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
