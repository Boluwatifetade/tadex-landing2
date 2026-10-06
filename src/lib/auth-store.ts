// Zustand store for the access token. Deliberately NOT persisted to
// localStorage/sessionStorage — lives in JS memory only, cleared on tab
// close/reload. The refresh token (httpOnly cookie) is what survives reload
// and silently gets us a new access token via /auth/refresh.
import { create } from "zustand";

export interface UserProfile {
  id?: string;
  email?: string;
  role?: string;
  status?: string;
  email_verified?: boolean;
  telegram_linked?: boolean;
  telegram_username?: string | null;
}

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  user: UserProfile | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: UserProfile | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  user: null,
  setAccessToken: (token) =>
    set({ accessToken: token, isAuthenticated: !!token }),
  setUser: (user) => set({ user }),
  clear: () => set({ accessToken: null, isAuthenticated: false, user: null }),
}));

export function getAuthHeader(): Record<string, string> {
  const token = useAuthStore.getState().accessToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

