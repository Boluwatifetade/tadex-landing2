import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "@/lib/auth-store";

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().clear();
  });

  it("initializes with null accessToken and false isAuthenticated", () => {
    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("sets access token and derives isAuthenticated = true when token is non-null", () => {
    useAuthStore.getState().setAccessToken("mock_access_token_123");
    const state = useAuthStore.getState();
    expect(state.accessToken).toBe("mock_access_token_123");
    expect(state.isAuthenticated).toBe(true);
  });

  it("sets accessToken to null and derives isAuthenticated = false when setAccessToken(null) is called", () => {
    useAuthStore.getState().setAccessToken("mock_access_token_123");
    useAuthStore.getState().setAccessToken(null);

    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("clears access token and resets isAuthenticated on clear()", () => {
    useAuthStore.getState().setAccessToken("mock_access_token_123");
    useAuthStore.getState().clear();

    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
