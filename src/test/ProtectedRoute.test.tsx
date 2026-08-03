import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuthStore } from "@/lib/auth-store";
import * as navigation from "next/navigation";

describe("ProtectedRoute", () => {
  const replaceMock = vi.fn();

  beforeEach(() => {
    useAuthStore.getState().clear();
    vi.restoreAllMocks();
    vi.spyOn(navigation, "useRouter").mockReturnValue({
      push: vi.fn(),
      replace: replaceMock,
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    } as any);
    vi.spyOn(navigation, "usePathname").mockReturnValue("/dashboard");
  });

  it("renders children immediately when accessToken exists in memory on mount", async () => {
    useAuthStore.getState().setAccessToken("valid_in_memory_token");

    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock;

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(await screen.findByText("Protected Content")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("attempts silent refresh when token is null on mount and renders children on refresh success", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ access_token: "restored_token_123" }),
    });
    globalThis.fetch = fetchMock;

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Initial loading state
    expect(screen.getByText("Verifying session...")).toBeInTheDocument();

    // Session restored
    expect(await screen.findByText("Protected Content")).toBeInTheDocument();
    expect(useAuthStore.getState().accessToken).toBe("restored_token_123");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/auth/refresh"),
      expect.objectContaining({ credentials: "include", method: "POST" })
    );
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it("redirects to /login only after silent refresh fails, never before", async () => {
    let resolveRefreshPromise: (res: any) => void = () => {};
    const refreshPromise = new Promise((resolve) => {
      resolveRefreshPromise = resolve;
    });

    const fetchMock = vi.fn().mockImplementation(() => refreshPromise);
    globalThis.fetch = fetchMock;

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    // Verify initializing state is shown and NO redirect has occurred yet
    expect(screen.getByText("Verifying session...")).toBeInTheDocument();
    expect(replaceMock).not.toHaveBeenCalled();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();

    // Fail the refresh call (e.g. 401 Unauthorized)
    resolveRefreshPromise({
      ok: false,
      status: 401,
      json: async () => ({ detail: "Invalid refresh token" }),
    });

    // Verify redirect fires ONLY AFTER refresh failure completes
    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/login?redirect=%2Fdashboard");
    });

    expect(useAuthStore.getState().accessToken).toBeNull();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});
