"use client";

interface CustomWidgetProps {
  items: Record<string, unknown>[];
}

export function CustomWidget({ items }: CustomWidgetProps) {
  const data = items[0] || {};
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
        {String(data.title || "Custom Section")}
      </h2>
      {Boolean(data.content) && (
        <div className="text-sm text-gray-600 break-words">{String(data.content)}</div>
      )}
    </div>
  );
}
