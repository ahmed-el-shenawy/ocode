"use client";

interface LanguagesWidgetProps {
  items: Record<string, unknown>[];
}

export function LanguagesWidget({ items }: LanguagesWidgetProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
        Languages
      </h2>
      {items.length === 0 && (
        <p className="text-gray-400 text-sm">No languages added yet</p>
      )}
      <div className="space-y-1">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-gray-700">{String(item.language || "")}</span>
            {Boolean(item.proficiency) && (
              <span className="text-gray-500">{String(item.proficiency)}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
