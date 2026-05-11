export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Conversation {
  id: string;
  resume_id: string;
  mode: "guided" | "free";
  progress: Record<string, unknown>;
}

export interface SectionProgress {
  sectionId: string;
  label: string;
  completed: boolean;
  itemCount: number;
}
