"use client";

interface SkillsWidgetProps {
  items: Record<string, unknown>[];
}

export function SkillsWidget({ items }: SkillsWidgetProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
        Skills
      </h2>
      <div className="flex flex-wrap gap-4">
        {items.map((item, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-medium text-gray-700">
              {String(item.category || "")}
            </h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {((item.skills as string[]) || []).map((skill, si) => (
                <span
                  key={si}
                  className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
