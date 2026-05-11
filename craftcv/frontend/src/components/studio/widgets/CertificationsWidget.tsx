"use client";

interface CertificationsWidgetProps {
  items: Record<string, unknown>[];
}

export function CertificationsWidget({ items }: CertificationsWidgetProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
        Certifications
      </h2>
      {items.length === 0 && (
        <p className="text-gray-400 text-sm">No certifications added yet</p>
      )}
      {items.map((item, idx) => (
        <div key={idx} className="mb-2">
          <p className="text-sm">
            <strong>{String(item.name || "")}</strong>
            {item.issuer ? ` - ${item.issuer}` : ""}
            {item.date ? ` (${item.date})` : ""}
          </p>
        </div>
      ))}
    </div>
  );
}
