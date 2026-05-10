export interface SectionItemData {
  id: string;
  type: string;
  content: unknown;
}

export interface ResumeContent {
  sections: SectionItemData[];
}

export interface Resume {
  id: string;
  userId: string;
  templateId?: string;
  title: string;
  content: ResumeContent;
  styles: Record<string, unknown>;
  status: string;
  createdAt: string;
  updatedAt: string;
}
