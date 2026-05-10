export interface TemplateField {
  key: string;
  label: string;
  type: string;
  required?: boolean;
}

export interface SectionDefinition {
  key: string;
  label: string;
  fields: TemplateField[];
}

export interface LayoutDefinition {
  columns: number;
  sections: string[];
}

export interface TemplateDefinition {
  sections: SectionDefinition[];
  layout: LayoutDefinition;
}

export interface Template {
  id: string;
  name: string;
  description?: string;
  thumbnailUrl?: string;
  isPublic: boolean;
  definition: TemplateDefinition;
  defaultStyles: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
