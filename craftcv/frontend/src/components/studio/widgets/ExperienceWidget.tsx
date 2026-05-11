"use client";

import { Briefcase } from "lucide-react";

interface ExperienceWidgetProps {
  items: Record<string, unknown>[];
}

export function ExperienceWidget({ items }: ExperienceWidgetProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3 flex items-center gap-2">
        <Briefcase className="w-4 h-4" /> Experience
      </h2>
      {items.length === 0 && (
        <p className="text-gray-400 text-sm">No experience added yet</p>
      )}
      {items.map((item, idx) => (
        <div key={idx} className="mb-3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">
                {String(item.position || "")}
              </h3>
              <p className="text-gray-600 text-sm">{String(item.company || "")}</p>
            </div>
            {Boolean(item.start_date) && (
              <span className="text-sm text-gray-400">
                {String(item.start_date)} - {item.current ? "Present" : String(item.end_date || "")}
              </span>
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
