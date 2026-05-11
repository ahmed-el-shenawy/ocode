"use client";

import { create } from "zustand";
import type { WidgetState } from "@/types/resume";
import type { ConnectionStatus, SyncState } from "@/lib/sync/types";
import type { WebSocketClient } from "@/lib/sync/websocket-client";

interface StudioStore {
  widgets: WidgetState[];
  selectedWidgetId: string | null;
  globalStyles: Record<string, unknown>;
  history: WidgetState[][];
  historyIndex: number;
  syncState: SyncState;
  syncClient: WebSocketClient | null;

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
  setConnectionStatus: (status: ConnectionStatus) => void;
  setSyncClient: (client: WebSocketClient | null) => void;
  applyPatch: (sectionId: string, fields: Record<string, unknown>) => void;
  setConflictSection: (sectionId: string | null) => void;
  setDegraded: (degraded: boolean) => void;
}

const initialSyncState: SyncState = {
  connectionStatus: "disconnected",
  lastSyncAt: null,
  pendingPatches: 0,
  conflictSectionId: null,
  isDegraded: false,
};

export const useStudioStore = create<StudioStore>((set, get) => ({
  widgets: [],
  selectedWidgetId: null,
  globalStyles: {},
  history: [],
  historyIndex: -1,
  syncState: initialSyncState,
  syncClient: null,

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

  setConnectionStatus: (connectionStatus) =>
    set((state) => ({
      syncState: { ...state.syncState, connectionStatus },
    })),

  setSyncClient: (syncClient) => set({ syncClient }),

  applyPatch: (sectionId, fields) => {
    get().pushHistory();
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.sectionId === sectionId
          ? { ...w, items: [{ ...w.items[0], ...fields }] }
          : w,
      ),
      syncState: {
        ...state.syncState,
        lastSyncAt: new Date().toISOString(),
        pendingPatches: Math.max(0, state.syncState.pendingPatches - 1),
      },
    }));
  },

  setConflictSection: (conflictSectionId) =>
    set((state) => ({
      syncState: { ...state.syncState, conflictSectionId },
    })),

  setDegraded: (isDegraded) =>
    set((state) => ({
      syncState: { ...state.syncState, isDegraded },
    })),
}));
