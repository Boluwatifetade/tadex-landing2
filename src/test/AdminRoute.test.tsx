import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AdminRoute from "@/components/admin/AdminRoute";
import * as apiClientModule from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

const mockReplace = vi.fn();
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  usePathname: () => "/admin",
}));

describe("AdminRoute Guard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockReplace.mockReset();
    mockPush.mockReset();
    useAuthStore.setState({ accessToken: null, isAuthenticated: false });
  });

  it("redirects non-admin user (role === 'user') to /dashboard and blocks children rendering", async () => {
    useAuthStore.setState({ accessToken: "mock-token", isAuthenticated: true });
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce({
      id: "user-1",
      email: "trader@tadex.app",
      role: "user",
      status: "active",
    });

    render(
      <AdminRoute>
        <div>Secret Admin Content</div>
      </AdminRoute>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
    expect(screen.queryByText("Secret Admin Content")).not.toBeInTheDocument();
  });

  it("redirects unauthenticated user to /login", async () => {
    useAuthStore.setState({ accessToken: null, isAuthenticated: false });
    vi.spyOn(apiClientModule, "apiClient").mockRejectedValueOnce(
      new Error("401 Unauthorized")
    );

    render(
      <AdminRoute>
        <div>Secret Admin Content</div>
      </AdminRoute>
    );

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/login");
    });
    expect(screen.queryByText("Secret Admin Content")).not.toBeInTheDocument();
  });

  it("renders children when user is an administrator (role === 'admin')", async () => {
    useAuthStore.setState({ accessToken: "mock-admin-token", isAuthenticated: true });
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce({
      id: "admin-uuid",
      email: "admin@tadexapp.com",
      role: "admin",
      status: "active",
    });

    render(
      <AdminRoute>
        <div>Secret Admin Content</div>
      </AdminRoute>
    );

    expect(await screen.findByText("Secret Admin Content")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
