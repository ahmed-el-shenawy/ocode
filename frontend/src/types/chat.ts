export type MessageRole = "user" | "assistant" | "system";
export type ConversationMode = "guided" | "free";

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Conversation {
  id: string;
  resumeId: string;
  mode: ConversationMode;
  progress: Record<string, unknown>;
}
