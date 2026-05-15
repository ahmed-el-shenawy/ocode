export interface TemplateField {
  type: "text" | "url" | "date" | "boolean" | "richtext" | "list" | "tags" | "select";
  label: string;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  options?: string[];
}

export interface SectionDefinition {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  minItems?: number;
  maxItems?: number;
  fields: Record<string, TemplateField>;
}

export interface LayoutDefinition {
  columns: number;
  colorScheme: Record<string, string>;
  fonts: Record<string, string>;
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
