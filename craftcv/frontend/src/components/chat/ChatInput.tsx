"use client";

import { useState } from "react";
import { Send, Search } from "lucide-react";

interface ChatInputProps {
  onSend: (content: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  isLoading,
  placeholder = "Type a message...",
}: ChatInputProps) {
  const [input, setInput] = useState("");

  function handleSend() {
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput("");
  }

  return (
    <div className="border-t p-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={placeholder}
          className="flex-1 rounded-lg border p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          onClick={() => setInput("Search the web for latest resume trends")}
          className="p-2 hover:bg-gray-100 rounded-lg"
          title="Web search"
        >
          <Search className="w-4 h-4 text-gray-500" />
        </button>
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
