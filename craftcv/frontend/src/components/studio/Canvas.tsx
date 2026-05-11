"use client";

import { useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Widget } from "./Widget";
import { SectionPicker } from "./SectionPicker";
import { useStudioStore } from "@/stores/studio-store";

export function Canvas() {
  const { widgets, reorderWidgets, selectWidget, selectedWidgetId } =
    useStudioStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const oldIndex = widgets.findIndex((w) => w.id === active.id);
        const newIndex = widgets.findIndex((w) => w.id === over.id);
        reorderWidgets(oldIndex, newIndex);
      }
    },
    [widgets, reorderWidgets]
  );

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
      <div
        className="mx-auto bg-white shadow-lg min-h-[1056px] w-[816px] relative p-12"
        onClick={() => selectWidget(null)}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={widgets.map((w) => w.id)}
            strategy={verticalListSortingStrategy}
          >
            {widgets.map((widget) => (
              <Widget
                key={widget.id}
                widget={widget}
                isSelected={selectedWidgetId === widget.id}
              />
            ))}
          </SortableContext>
        </DndContext>

        {widgets.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            Select a template or add sections to get started
          </div>
        )}
      </div>

      <SectionPicker />
    </div>
  );
}
