import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordPage from "@/app/reset-password/page";
import * as apiClientModule from "@/lib/api-client";

const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams("token=valid_test_token");

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

describe("ResetPasswordPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockPush.mockReset();
    mockSearchParams = new URLSearchParams("token=valid_test_token");
  });

  it("renders missing token error when no token in URL", () => {
    mockSearchParams = new URLSearchParams("");
    render(<ResetPasswordPage />);

    expect(screen.getByRole("heading", { name: /invalid reset link/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /request new reset link/i })).toHaveAttribute(
      "href",
      "/forgot-password"
    );
  });

  it("renders new password and confirm password inputs when token exists", () => {
    render(<ResetPasswordPage />);

    expect(screen.getByRole("heading", { name: /set new password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset password/i })).toBeInTheDocument();
  });

  it("validates password minimum length and mismatch", async () => {
    render(<ResetPasswordPage />);

    fireEvent.change(screen.getByLabelText(/^new password/i), {
      target: { value: "short" },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: "mismatch" },
    });

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
    });
  });

  it("submits valid passwords and redirects to login with reset=success", async () => {
    const apiSpy = vi.spyOn(apiClientModule, "apiClient").mockResolvedValue({
      status: "success",
      message: "Password reset successfully. Please log in with your new password.",
    } as any);

    render(<ResetPasswordPage />);

    fireEvent.change(screen.getByLabelText(/^new password/i), {
      target: { value: "NewSecurePass123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: "NewSecurePass123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(
        "/auth/reset-password",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            token: "valid_test_token",
            new_password: "NewSecurePass123",
          }),
        }),
        { skipAuth: true }
      );
      expect(mockPush).toHaveBeenCalledWith("/login?reset=success");
    });
  });

  it("displays server error message on expired or reused token with link to request new link", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockRejectedValue(
      new Error("This password reset link has already been used or is invalid. Please request a new one.")
    );

    render(<ResetPasswordPage />);

    fireEvent.change(screen.getByLabelText(/^new password/i), {
      target: { value: "NewSecurePass123" },
    });
    fireEvent.change(screen.getByLabelText(/confirm new password/i), {
      target: { value: "NewSecurePass123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/this password reset link has already been used/i)
      ).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /request a new password reset link/i })).toHaveAttribute(
        "href",
        "/forgot-password"
      );
    });
  });
});
