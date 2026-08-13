import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountSettings from "@/components/dashboard/AccountSettings";
import * as apiClientModule from "@/lib/api-client";
import * as authStoreModule from "@/lib/auth-store";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("AccountSettings", () => {
  const mockClear = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockReset();
    mockClear.mockReset();

    vi.spyOn(authStoreModule, "useAuthStore").mockReturnValue({
      accessToken: "mock_token",
      user: { id: "u1", email: "user@tadex.app", status: "active" },
      setAccessToken: vi.fn(),
      setUser: vi.fn(),
      clear: mockClear,
    });
  });

  it("renders change password form and log out everywhere security card", () => {
    render(<AccountSettings />);

    expect(screen.getByText("Account & Security Settings")).toBeInTheDocument();
    expect(screen.getByText("Change Password")).toBeInTheDocument();
    expect(screen.getByText("Active Sessions & Security")).toBeInTheDocument();
  });

  it("displays validation error when new password and confirm password do not match", async () => {
    render(<AccountSettings />);

    fireEvent.change(screen.getByPlaceholderText("Enter your current password"), {
      target: { value: "OldPassword123!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Minimum 8 characters"), {
      target: { value: "NewPassword123!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Re-enter your new password"), {
      target: { value: "DifferentPassword123!" },
    });

    const submitBtn = screen.getByRole("button", { name: "Update Password" });
    fireEvent.click(submitBtn);

    expect(await screen.findByText("Passwords do not match")).toBeInTheDocument();
  });

  it("calls POST /auth/change-password and displays success banner on valid password change", async () => {
    const apiClientSpy = vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(null);

    render(<AccountSettings />);

    fireEvent.change(screen.getByPlaceholderText("Enter your current password"), {
      target: { value: "OldPassword123!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Minimum 8 characters"), {
      target: { value: "NewPassword123!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Re-enter your new password"), {
      target: { value: "NewPassword123!" },
    });

    const submitBtn = screen.getByRole("button", { name: "Update Password" });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(apiClientSpy).toHaveBeenCalledWith(
        "/auth/change-password",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            current_password: "OldPassword123!",
            new_password: "NewPassword123!",
          }),
        })
      );
    });

    expect(
      await screen.findByText(
        "Your password has been changed successfully. You've been logged out of all other devices."
      )
    ).toBeInTheDocument();
  });

  it("displays explicit error message when current password is wrong", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockRejectedValueOnce(
      new Error("Current password is invalid")
    );

    render(<AccountSettings />);

    fireEvent.change(screen.getByPlaceholderText("Enter your current password"), {
      target: { value: "WrongOldPassword" },
    });
    fireEvent.change(screen.getByPlaceholderText("Minimum 8 characters"), {
      target: { value: "NewPassword123!" },
    });
    fireEvent.change(screen.getByPlaceholderText("Re-enter your new password"), {
      target: { value: "NewPassword123!" },
    });

    const submitBtn = screen.getByRole("button", { name: "Update Password" });
    fireEvent.click(submitBtn);

    expect(await screen.findByText("Current password is invalid")).toBeInTheDocument();
  });

  it("requires explicit confirmation before calling POST /auth/logout-all and redirects to /login on success", async () => {
    const apiClientSpy = vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(null);

    render(<AccountSettings />);

    const openLogoutAllBtn = screen.getByRole("button", { name: "Log Out of All Devices" });
    fireEvent.click(openLogoutAllBtn);

    // Assert confirmation prompt opens without calling API yet
    expect(screen.getByText("Confirm Log Out Everywhere")).toBeInTheDocument();
    expect(apiClientSpy).not.toHaveBeenCalled();

    // Confirm logout-all
    const confirmBtn = screen.getByRole("button", { name: "Yes, Log Out Everywhere" });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(apiClientSpy).toHaveBeenCalledWith("/auth/logout-all", { method: "POST" });
      expect(mockClear).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });
});
