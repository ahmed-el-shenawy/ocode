"use client";

import { create } from "zustand";
import type { WidgetState } from "@/types/resume";

interface StudioStore {
  widgets: WidgetState[];
  selectedWidgetId: string | null;
  globalStyles: Record<string, unknown>;
  history: WidgetState[][];
  historyIndex: number;

  setWidgets: (widgets: WidgetState[]) => void;
  selectWidget: (id: string | null) => void;
  updateWidgetPosition: (id: string, x: number, y: number) => void;
  updateWidgetStyles: (id: string, styles: Record<string, unknown>) => void;
  updateWidgetContent: (id: string, items: Record<string, unknown>[]) => void;
  updateGlobalStyles: (styles: Record<string, unknown>) => void;
  addWidget: (widget: WidgetState) => void;
  removeWidget: (id: string) => void;
  reorderWidgets: (fromIndex: number, toIndex: number) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

export const useStudioStore = create<StudioStore>((set, get) => ({
  widgets: [],
  selectedWidgetId: null,
  globalStyles: {},
  history: [],
  historyIndex: -1,

  setWidgets: (widgets) => set({ widgets }),

  selectWidget: (id) => set({ selectedWidgetId: id }),

  updateWidgetPosition: (id, x, y) => {
    get().pushHistory();
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === id ? { ...w, position: { x, y } } : w
      ),
    }));
  },

  updateWidgetStyles: (id, styles) => {
    get().pushHistory();
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === id ? { ...w, styles: { ...w.styles, ...styles } } : w
      ),
    }));
  },

  updateWidgetContent: (id, items) => {
    get().pushHistory();
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === id ? { ...w, items } : w
      ),
    }));
  },

  updateGlobalStyles: (styles) => {
    get().pushHistory();
    set((state) => ({
      globalStyles: { ...state.globalStyles, ...styles },
    }));
  },

  addWidget: (widget) => {
    get().pushHistory();
    set((state) => ({ widgets: [...state.widgets, widget] }));
  },

  removeWidget: (id) => {
    get().pushHistory();
    set((state) => ({
      widgets: state.widgets.filter((w) => w.id !== id),
      selectedWidgetId:
        state.selectedWidgetId === id ? null : state.selectedWidgetId,
    }));
  },

  reorderWidgets: (fromIndex, toIndex) => {
    get().pushHistory();
    set((state) => {
      const widgets = [...state.widgets];
      const [removed] = widgets.splice(fromIndex, 1);
      widgets.splice(toIndex, 0, removed);
      return { widgets };
    });
  },

  pushHistory: () => {
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(JSON.parse(JSON.stringify(state.widgets)));
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      set({
        widgets: JSON.parse(JSON.stringify(history[historyIndex - 1])),
        historyIndex: historyIndex - 1,
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      set({
        widgets: JSON.parse(JSON.stringify(history[historyIndex + 1])),
        historyIndex: historyIndex + 1,
      });
    }
  },
}));
