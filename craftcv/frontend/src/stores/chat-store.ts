"use client";

import { create } from "zustand";
import type { Message } from "@/types/chat";
import type { ContentPatch } from "@/lib/sync/types";

interface ChatStore {
  messages: Message[];
  conversationId: string | null;
  mode: "guided" | "free";
  progress: Record<string, unknown>;
  isLoading: boolean;
  pendingPatch: ContentPatch | null;

  setConversation: (id: string, mode: "guided" | "free", progress: Record<string, unknown>) => void;
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  setMode: (mode: "guided" | "free") => void;
  setProgress: (progress: Record<string, unknown>) => void;
  setLoading: (loading: boolean) => void;
  setPendingPatch: (patch: ContentPatch | null) => void;
  reset: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  conversationId: null,
  mode: "guided",
  progress: {},
  isLoading: false,
  pendingPatch: null,

  setConversation: (id, mode, progress) =>
    set({ conversationId: id, mode, progress }),

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  setMessages: (messages) => set({ messages }),

  setMode: (mode) => set({ mode }),

  setProgress: (progress) => set({ progress }),

  setLoading: (isLoading) => set({ isLoading }),

  setPendingPatch: (pendingPatch) => set({ pendingPatch }),

  reset: () =>
    set({
      messages: [],
      conversationId: null,
      mode: "guided",
      progress: {},
      isLoading: false,
      pendingPatch: null,
    }),
}));
