"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import type { WidgetState } from "@/types/resume";
import { useStudioStore } from "@/stores/studio-store";
import { HeaderWidget } from "./widgets/HeaderWidget";
import { ExperienceWidget } from "./widgets/ExperienceWidget";
import { SummaryWidget } from "./widgets/SummaryWidget";
import { SkillsWidget } from "./widgets/SkillsWidget";
import { ProjectsWidget } from "./widgets/ProjectsWidget";
import { EducationWidget } from "./widgets/EducationWidget";
import { CertificationsWidget } from "./widgets/CertificationsWidget";
import { LanguagesWidget } from "./widgets/LanguagesWidget";
import { CustomWidget } from "./widgets/CustomWidget";

const widgetComponents: Record<string, React.FC<{ items: Record<string, unknown>[] }>> = {
  header: HeaderWidget,
  summary: SummaryWidget,
  experience: ExperienceWidget,
  education: EducationWidget,
  skills: SkillsWidget,
  projects: ProjectsWidget,
  certifications: CertificationsWidget,
  languages: LanguagesWidget,
  custom: CustomWidget,
};

interface WidgetProps {
  widget: WidgetState;
  isSelected: boolean;
}

export function Widget({ widget, isSelected }: WidgetProps) {
  const { selectWidget, removeWidget } = useStudioStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Component = widgetComponents[widget.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group border-2 rounded-lg mb-4 p-4 transition-all duration-200 overflow-hidden ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-transparent hover:border-gray-200"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        selectWidget(widget.id);
      }}
    >
      <button
        {...attributes}
        {...listeners}
        className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </button>

      <div className="absolute -top-3 right-2 opacity-0 group-hover:opacity-100 flex gap-1 bg-white border rounded-md shadow-sm">
        <button
          onClick={(e) => {
            e.stopPropagation();
            removeWidget(widget.id);
          }}
          className="p-1 hover:bg-red-50 rounded"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-500" />
        </button>
      </div>

      {Component ? (
        <div className="overflow-x-auto">
          <Component items={widget.items} />
        </div>
      ) : (
        <div className="text-gray-400 text-sm">
          Unknown section type: {widget.type}
        </div>
      )}
    </div>
  );
}
