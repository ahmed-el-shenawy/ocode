import { create } from "zustand";

interface ChatState {
  messages: unknown[];
  sendMessage: (content: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  sendMessage: (content: string) =>
    set((state) => ({
      messages: [...state.messages, { role: "user", content }],
    })),
}));
