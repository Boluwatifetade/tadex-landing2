// Zustand store for the access token. Deliberately NOT persisted to
// localStorage/sessionStorage — lives in JS memory only, cleared on tab
// close/reload. The refresh token (httpOnly cookie) is what survives reload
// and silently gets us a new access token via /auth/refresh.
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setAccessToken: (token: string | null) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  setAccessToken: (token) =>
    set({ accessToken: token, isAuthenticated: !!token }),
  clear: () => set({ accessToken: null, isAuthenticated: false }),
}));
