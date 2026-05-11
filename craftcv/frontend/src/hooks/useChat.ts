"use client";

import { useCallback } from "react";
import { api } from "@/lib/api";
import { useChatStore } from "@/stores/chat-store";
import type { Message } from "@/types/chat";

export function useChat(resumeId: string) {
  const {
    messages,
    conversationId,
    mode,
    progress,
    isLoading,
    setConversation,
    addMessage,
    setMode,
    setProgress,
    setLoading,
    reset,
  } = useChatStore();

  const startConversation = useCallback(async () => {
    const data = await api.post<{
      conversation_id: string;
      mode: string;
      progress: Record<string, unknown>;
    }>(`/chat/conversation/${resumeId}`);

    setConversation(
      data.conversation_id,
      data.mode as "guided" | "free",
      data.progress
    );

    const systemMsg: Message = {
      id: "system-1",
      role: "assistant",
      content:
        data.mode === "guided"
          ? "I'll help you build your resume step by step. Let's start with your header — what's your full name?"
          : "I'm here to help you build your resume. What would you like to work on?",
      created_at: new Date().toISOString(),
    };
    addMessage(systemMsg);
  }, [resumeId, setConversation, addMessage]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!conversationId || isLoading) return;

      const userMsg: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      };
      addMessage(userMsg);
      setLoading(true);

      try {
        const data = await api.post<{ content: string; role: string }>(
          `/chat/message/${conversationId}`,
          { content }
        );

        const assistantMsg: Message = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: data.content,
          created_at: new Date().toISOString(),
        };
        addMessage(assistantMsg);
      } catch {
        const errorMsg: Message = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          created_at: new Date().toISOString(),
        };
        addMessage(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [conversationId, isLoading, addMessage, setLoading]
  );

  const switchMode = useCallback(async () => {
    if (!conversationId) return;
    const newMode = mode === "guided" ? "free" : "guided";
    await api.post(`/chat/switch-mode/${conversationId}`, { mode: newMode });
    setMode(newMode);

    const systemMsg: Message = {
      id: `system-${Date.now()}`,
      role: "assistant",
      content:
        newMode === "guided"
          ? "Switched to guided mode. I'll ask about each section one at a time."
          : "Switched to free mode. Ask me anything about your resume.",
      created_at: new Date().toISOString(),
    };
    addMessage(systemMsg);
  }, [conversationId, mode, setMode, addMessage]);

  return {
    messages,
    mode,
    progress,
    isLoading,
    startConversation,
    sendMessage,
    switchMode,
    reset,
  };
}
