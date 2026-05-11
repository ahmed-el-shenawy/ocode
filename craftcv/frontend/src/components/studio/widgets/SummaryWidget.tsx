"use client";

interface SummaryWidgetProps {
  items: Record<string, unknown>[];
}

export function SummaryWidget({ items }: SummaryWidgetProps) {
  const data = items[0] || {};
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
        Professional Summary
      </h2>
      <p className="text-sm text-gray-600 break-words">
        {data.content ? String(data.content) : "No summary added yet"}
      </p>
    </div>
  );
}
