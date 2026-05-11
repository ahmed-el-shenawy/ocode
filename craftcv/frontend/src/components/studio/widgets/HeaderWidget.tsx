"use client";

interface HeaderWidgetProps {
  items: Record<string, unknown>[];
}

export function HeaderWidget({ items }: HeaderWidgetProps) {
  const data = items[0] || {};

  return (
    <div className="text-center break-words">
      <h1 className="text-2xl font-bold text-gray-900">
        {String(data.full_name || "")}
      </h1>
      {Boolean(data.headline) && (
        <p className="text-lg text-gray-600 mt-1">{String(data.headline)}</p>
      )}
      <div className="flex justify-center gap-4 mt-2 text-sm text-gray-500">
        {Boolean(data.email) && <span>{String(data.email)}</span>}
        {Boolean(data.phone) && <span>{String(data.phone)}</span>}
        {Boolean(data.location) && <span>{String(data.location)}</span>}
      </div>
    </div>
  );
}
