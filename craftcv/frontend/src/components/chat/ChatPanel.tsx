"use client";

import { useCallback, useEffect, useRef } from "react";
import { Check, MessageSquare, X } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { SectionProgress } from "./SectionProgress";
import { QuickActions } from "./QuickActions";
import { ChatInput } from "./ChatInput";
import { GuidedFlowIndicator } from "./GuidedFlowIndicator";
import { useChat } from "@/hooks/useChat";
import { useChatStore } from "@/stores/chat-store";
import { useStudioStore } from "@/stores/studio-store";

interface ChatPanelProps {
  resumeId: string;
}

export function ChatPanel({ resumeId }: ChatPanelProps) {
  const { messages, mode, progress, isLoading, startConversation, sendMessage, switchMode } =
    useChat(resumeId);
  const pendingPatch = useChatStore((s) => s.pendingPatch);
  const setPendingPatch = useChatStore((s) => s.setPendingPatch);
  const syncClient = useStudioStore((s) => s.syncClient);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startConversation();
  }, [resumeId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleApply = useCallback(() => {
    if (pendingPatch && syncClient) {
      syncClient.sendPatch(pendingPatch);
      setPendingPatch(null);
    }
  }, [pendingPatch, syncClient, setPendingPatch]);

  const handleDiscard = useCallback(() => {
    setPendingPatch(null);
  }, [setPendingPatch]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <span className="font-medium text-sm">Resume Assistant</span>
        </div>
        <button
          onClick={switchMode}
          className="text-xs px-2 py-1 rounded-full border hover:bg-gray-50 transition-colors"
        >
          {mode === "guided" ? "Guided" : "Free"} mode
        </button>
      </div>

      <SectionProgress progress={progress} />

      {pendingPatch && (
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-b border-blue-100">
          <span className="text-xs text-blue-700 flex-1">AI suggested content changes</span>
          <button
            onClick={handleApply}
            className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
          >
            <Check className="w-3 h-3" />
            Apply
          </button>
          <button
            onClick={handleDiscard}
            className="flex items-center gap-1 px-2 py-1 bg-white border rounded text-xs hover:bg-gray-50"
          >
            <X className="w-3 h-3" />
            Discard
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
            Thinking...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <QuickActions onAction={(action) => sendMessage(action)} />
      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        placeholder={
          mode === "guided"
            ? "Answer the question above..."
            : "Ask me anything about your resume..."
        }
      />
    </div>
  );
}
