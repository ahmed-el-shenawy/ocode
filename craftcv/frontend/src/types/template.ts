export interface TemplateField {
  type: "text" | "url" | "date" | "boolean" | "richtext" | "list" | "tags" | "select";
  label: string;
  required?: boolean;
  max_length?: number;
  min?: number;
  max?: number;
  options?: string[];
}

export interface SectionDefinition {
  id: string;
  type: string;
  label: string;
  required?: boolean;
  min_items?: number;
  max_items?: number;
  fields: Record<string, TemplateField>;
}

export interface LayoutDefinition {
  columns: number;
  color_scheme: Record<string, string>;
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
  thumbnail_url?: string;
  is_public: boolean;
  definition: TemplateDefinition;
  default_styles: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
