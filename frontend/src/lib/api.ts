import { supabase } from "./supabase";
import { API_BASE_URL } from "./constants";

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  requestId: string;
}

export class ApiRequestError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, string[]>,
    public readonly requestId?: string
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    headers["Authorization"] = `Bearer ${session.access_token}`;
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorBody: ApiError;
    try {
      errorBody = await response.json();
    } catch {
      throw new ApiRequestError(
        "UNKNOWN_ERROR",
        `Request failed with status ${response.status}`,
        undefined,
        undefined
      );
    }

    throw new ApiRequestError(
      errorBody.code || "UNKNOWN_ERROR",
      errorBody.message || "An unexpected error occurred",
      errorBody.details,
      errorBody.requestId
    );
  }

  return response.json() as Promise<T>;
}

export const api = {
  async get<T>(path: string, params?: Record<string, string>): Promise<T> {
    const url = new URL(`${API_BASE_URL}${path}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) =>
        url.searchParams.append(key, value)
      );
    }

    const headers = await getAuthHeaders();
    const response = await fetch(url.toString(), { headers });
    return handleResponse<T>(response);
  },

  async post<T>(path: string, body?: unknown): Promise<T> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(response);
  },

  async patch<T>(path: string, body: unknown): Promise<T> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });
    return handleResponse<T>(response);
  },

  async del(path: string): Promise<void> {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "DELETE",
      headers,
    });
    if (!response.ok) {
      await handleResponse<void>(response);
    }
  },
};
