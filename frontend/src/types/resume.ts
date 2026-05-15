export type ResumeStatus = "draft" | "complete" | "archived";

export interface SectionItemData {
  sectionId: string;
  type: string;
  items: Record<string, unknown>[];
}

export interface ResumeContent {
  sections: SectionItemData[];
}

export interface Resume {
  id: string;
  templateId?: string;
  title: string;
  content: ResumeContent;
  styles: Record<string, unknown>;
  status: ResumeStatus;
  createdAt: string;
  updatedAt: string;
}
