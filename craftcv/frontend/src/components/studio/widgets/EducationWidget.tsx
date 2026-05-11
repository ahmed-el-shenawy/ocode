"use client";

interface EducationWidgetProps {
  items: Record<string, unknown>[];
}

export function EducationWidget({ items }: EducationWidgetProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-3">
        Education
      </h2>
      {items.length === 0 && (
        <p className="text-gray-400 text-sm">No education added yet</p>
      )}
      {items.map((item, idx) => (
        <div key={idx} className="mb-3">
          <h3 className="font-medium text-gray-900">
            {String(item.degree || "")} {item.field ? `in ${item.field}` : ""}
          </h3>
          <p className="text-gray-600 text-sm">{String(item.institution || "")}</p>
          {Boolean(item.start_date) && (
            <span className="text-sm text-gray-400">
              {String(item.start_date)} - {String(item.end_date || "")}
            </span>
          )}
          {Boolean(item.gpa) && (
            <p className="text-sm text-gray-500 break-words">GPA: {String(item.gpa)}</p>
          )}
        </div>
      ))}
    </div>
  );
}
