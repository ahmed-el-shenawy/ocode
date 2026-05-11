export interface SectionItemData {
  section_id: string;
  type: string;
  items: Record<string, unknown>[];
}

export interface ResumeContent {
  sections: SectionItemData[];
}

export interface Resume {
  id: string;
  template_id?: string;
  title: string;
  content: ResumeContent;
  styles: Record<string, unknown>;
  status: "draft" | "complete";
  created_at: string;
  updated_at: string;
}

export interface WidgetPosition {
  x: number;
  y: number;
}

export interface WidgetState {
  id: string;
  sectionId: string;
  type: string;
  items: Record<string, unknown>[];
  position: WidgetPosition;
  width: number;
  styles: Record<string, unknown>;
}

export interface StudioState {
  widgets: WidgetState[];
  selectedWidgetId: string | null;
  globalStyles: Record<string, unknown>;
}
