"use client";

interface GuidedFlowIndicatorProps {
  currentSection: string | null;
  mode: "guided" | "free";
}

export function GuidedFlowIndicator({
  currentSection,
  mode,
}: GuidedFlowIndicatorProps) {
  if (mode === "free") return null;

  return (
    <div className="px-3 py-2 bg-blue-50 border-b border-blue-100">
      <p className="text-xs text-blue-700">
        {currentSection
          ? `Current section: ${currentSection}`
          : "Guided mode — answering questions step by step"}
      </p>
    </div>
  );
}
