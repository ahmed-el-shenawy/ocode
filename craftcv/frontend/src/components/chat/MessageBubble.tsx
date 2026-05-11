"use client";

import { User, Bot, AlertCircle } from "lucide-react";
import type { Message } from "@/types/chat";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isError = message.role === "system" && message.content.includes("error");

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser
            ? "bg-blue-100 text-blue-600"
            : isError
            ? "bg-red-100 text-red-600"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4" />
        ) : isError ? (
          <AlertCircle className="w-4 h-4" />
        ) : (
          <Bot className="w-4 h-4" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
          isUser
            ? "bg-blue-600 text-white"
            : isError
            ? "bg-red-50 text-red-700 border border-red-200"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isUser ? "text-blue-200" : "text-gray-400"
          }`}
        >
          {new Date(message.created_at).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
