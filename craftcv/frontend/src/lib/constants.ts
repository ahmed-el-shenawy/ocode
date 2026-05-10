export const APP_NAME = "CraftCV";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export const ROUTES = {
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  templates: "/dashboard/templates",
  settings: "/dashboard/settings",
} as const;
