import { describe, it, expect, beforeEach, vi } from "vitest";
import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

describe("apiClient", () => {
  beforeEach(() => {
    useAuthStore.getState().clear();
    vi.restoreAllMocks();
  });

  it("handles 401 -> silent refresh -> retry flow successfully", async () => {
    useAuthStore.getState().setAccessToken("expired_token_123");

    const fetchMock = vi.fn();
    // 1st call: GET /me -> 401
    fetchMock.mockResolvedValueOnce({
      status: 401,
      ok: false,
      json: async () => ({ detail: "Token expired" }),
    });
    // 2nd call: POST /auth/refresh -> 200 OK with new token
    fetchMock.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({ access_token: "refreshed_token_789" }),
    });
    // 3rd call: Retry GET /me -> 200 OK with user profile
    fetchMock.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({ data: { id: "usr_1", email: "trader@tadex.app" } }),
    });

    globalThis.fetch = fetchMock;

    const result = await apiClient<{ id: string; email: string }>("/me");

    expect(result).toEqual({ id: "usr_1", email: "trader@tadex.app" });
    expect(useAuthStore.getState().accessToken).toBe("refreshed_token_789");
    expect(fetchMock).toHaveBeenCalledTimes(3);

    // Verify 2nd call was the refresh request with credentials include
    const refreshCall = fetchMock.mock.calls[1];
    expect(refreshCall[0]).toContain("/auth/refresh");
    expect(refreshCall[1].credentials).toBe("include");

    // Verify 3rd call (retry) used the new Authorization header
    const retryCall = fetchMock.mock.calls[2];
    expect(retryCall[1].headers.Authorization).toBe("Bearer refreshed_token_789");
  });

  it("locks single in-flight refresh promise when multiple concurrent 401 requests occur", async () => {
    useAuthStore.getState().setAccessToken("expired_token_123");

    let refreshCallCount = 0;
    const fetchMock = vi.fn((url: string) => {
      if (url.endsWith("/auth/refresh")) {
        refreshCallCount++;
        return Promise.resolve({
          status: 200,
          ok: true,
          json: async () => ({ access_token: "single_refresh_token_999" }),
        } as Response);
      }
      if (url.endsWith("/req1")) {
        if (useAuthStore.getState().accessToken === "single_refresh_token_999") {
          return Promise.resolve({
            status: 200,
            ok: true,
            json: async () => ({ data: "res1" }),
          } as Response);
        }
        return Promise.resolve({ status: 401, ok: false, json: async () => ({}) } as Response);
      }
      if (url.endsWith("/req2")) {
        if (useAuthStore.getState().accessToken === "single_refresh_token_999") {
          return Promise.resolve({
            status: 200,
            ok: true,
            json: async () => ({ data: "res2" }),
          } as Response);
        }
        return Promise.resolve({ status: 401, ok: false, json: async () => ({}) } as Response);
      }
      return Promise.reject(new Error("Unknown endpoint"));
    });

    globalThis.fetch = fetchMock as any;

    // Fire two concurrent requests
    const [res1, res2] = await Promise.all([
      apiClient<string>("/req1"),
      apiClient<string>("/req2"),
    ]);

    expect(res1).toBe("res1");
    expect(res2).toBe("res2");
    expect(refreshCallCount).toBe(1); // Single in-flight refresh locking confirmed
  });

  it("clears auth store and throws 'Session expired' when refresh fails", async () => {
    useAuthStore.getState().setAccessToken("invalid_token");

    const fetchMock = vi.fn();
    // 1st call: GET /me -> 401
    fetchMock.mockResolvedValueOnce({
      status: 401,
      ok: false,
      json: async () => ({ detail: "Token invalid" }),
    });
    // 2nd call: POST /auth/refresh -> 401 (Refresh cookie expired/revoked)
    fetchMock.mockResolvedValueOnce({
      status: 401,
      ok: false,
      json: async () => ({ detail: "Refresh token revoked" }),
    });

    globalThis.fetch = fetchMock;

    await expect(apiClient("/me")).rejects.toThrow("Session expired");
    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
