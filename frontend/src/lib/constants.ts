export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  settings: "/dashboard/settings",
  templates: "/dashboard/templates",
  templateDetail: (id: string) => `/dashboard/templates/${id}`,
  studio: (resumeId: string) => `/studio/${resumeId}`,
  chat: (resumeId: string) => `/chat/${resumeId}`,
  preview: (resumeId: string) => `/resume/${resumeId}/preview`,
} as const;

export const STORAGE_KEYS = {
  pendingChanges: "craftcv_pending_changes",
  selectedTemplate: "craftcv_selected_template",
} as const;

export const LIMITS = {
  resumeTitleMaxLength: 255,
  maxResumesPerUser: 20,
  maxSectionsPerResume: 12,
  maxItemsPerSection: 50,
  messagesPerConversation: 500,
} as const;
