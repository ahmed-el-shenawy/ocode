export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  resumeId: string;
  userId: string;
  mode: "guided" | "freeform";
  createdAt: string;
  updatedAt: string;
}
