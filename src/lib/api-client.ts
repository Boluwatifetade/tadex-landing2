// Central fetch wrapper for Tadex API endpoints
import { useAuthStore } from "./auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.tadexapp.com/api/v1";

interface ApiEnvelope<T> {
  success?: boolean;
  data?: T;
  error?: { message: string; code?: string };
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", // sends the httpOnly refresh cookie
    })
      .then(async (res) => {
        if (!res.ok) return null;
        const json = await res.json();
        const token = (json.access_token || (json.data && json.data.access_token)) as string;
        if (token) {
          useAuthStore.getState().setAccessToken(token);
          return token;
        }
        return null;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {},
  { skipAuth = false }: { skipAuth?: boolean } = {}
): Promise<T> {
  const token = useAuthStore.getState().accessToken;

  const doFetch = (accessToken: string | null) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && !skipAuth
          ? { Authorization: `Bearer ${accessToken}` }
          : {}),
        ...options.headers,
      },
    });

  let res = await doFetch(token);

  // Access token expired mid-session -> silent refresh, then retry once.
  if (res.status === 401 && !skipAuth) {
    const newToken = await refreshAccessToken();
    if (!newToken) {
      useAuthStore.getState().clear();
      throw new Error("Session expired");
    }
    res = await doFetch(newToken);
  }

  if (res.status === 204) {
    return null as T;
  }

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const errJson = await res.json();
      if (typeof errJson.detail === "string") {
        message = errJson.detail;
      } else if (Array.isArray(errJson.detail) && errJson.detail.length > 0) {
        message = errJson.detail.map((e: { msg?: string; message?: string }) => e.msg || e.message).join(", ");
      } else if (errJson.detail && typeof errJson.detail === "object") {
        const d = errJson.detail as Record<string, unknown>;
        message = (d.message as string) || (d.code as string) || JSON.stringify(d);
      } else if (errJson.error?.message) {
        message = errJson.error.message;
      } else if (errJson.message) {
        message = errJson.message;
      }
    } catch {
      /* non-JSON error body, keep default message */
    }
    throw new Error(message);
  }

  const json = await res.json();
  if (json && typeof json === "object" && "data" in json && json.data !== undefined) {
    return json.data as T;
  }
  return json as T;
}
