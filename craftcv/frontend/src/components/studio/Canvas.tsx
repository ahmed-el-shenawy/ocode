"use client";

import { useCallback, useEffect, useRef } from "react";
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
import { AlertTriangle, FileText } from "lucide-react";
import { Widget } from "./Widget";
import { SectionPicker } from "./SectionPicker";
import { useStudioStore } from "@/stores/studio-store";
import { WebSocketClient } from "@/lib/sync/websocket-client";
import type { SyncEvent } from "@/lib/sync/types";

interface CanvasProps {
  resumeId: string;
}

export function Canvas({ resumeId }: CanvasProps) {
  const {
    widgets,
    reorderWidgets,
    selectWidget,
    selectedWidgetId,
    syncState,
    setConnectionStatus,
    applyPatch,
    setConflictSection,
    setSyncClient,
  } = useStudioStore();

  const clientRef = useRef<WebSocketClient | null>(null);

  useEffect(() => {
    const handleMessage = (event: SyncEvent) => {
      if (event.type === "patch_broadcast") {
        const payload = event.payload as {
          sectionId: string;
          fields: Record<string, unknown>;
        };
        applyPatch(payload.sectionId, payload.fields);
      } else if (event.type === "state_sync") {
        const payload = event.payload as {
          sections: Array<{ id: string; fields: Record<string, unknown> }>;
        };
        payload.sections.forEach((section) => {
          applyPatch(section.id, section.fields);
        });
      }
    };

    const handleStatusChange = setConnectionStatus;

    const client = new WebSocketClient(resumeId, handleMessage, handleStatusChange);
    clientRef.current = client;
    setSyncClient(client);
    client.connect();

    return () => {
      client.destroy();
      setSyncClient(null);
    };
  }, [resumeId]);

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
        {syncState.conflictSectionId && (
          <div className="mb-4 flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2 text-sm text-yellow-800">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>
              Conflict detected in section.{" "}
              <button
                onClick={() => setConflictSection(null)}
                className="underline font-medium hover:text-yellow-900"
              >
                Dismiss
              </button>
            </span>
          </div>
        )}

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
                widget={{
                  ...widget,
                  styles: {
                    ...widget.styles,
                    ...(syncState.conflictSectionId === widget.sectionId
                      ? { borderColor: "#eab308" }
                      : {}),
                  },
                }}
                isSelected={selectedWidgetId === widget.id}
              />
            ))}
          </SortableContext>
        </DndContext>

        {widgets.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <FileText className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-sm font-medium text-gray-500 mb-1">No sections yet</p>
            <p className="text-xs text-gray-400 max-w-xs">
              Add sections using the + button below, or use the chat assistant to build your resume step by step.
            </p>
          </div>
        )}
      </div>

      <SectionPicker />
    </div>
  );
}
