import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgotPasswordPage from "@/app/forgot-password/page";
import * as apiClientModule from "@/lib/api-client";

describe("ForgotPasswordPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders email input and submit button", () => {
    render(<ForgotPasswordPage />);

    expect(screen.getByRole("heading", { name: /reset your password/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  it("validates required and format of email", async () => {
    render(<ForgotPasswordPage />);

    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "invalid-email" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it("submits valid email and shows anti-enumeration success message", async () => {
    const apiSpy = vi.spyOn(apiClientModule, "apiClient").mockResolvedValue({
      status: "success",
      message: "If an account exists with that email, a password reset link has been sent.",
    } as any);

    render(<ForgotPasswordPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "trader@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(
        "/auth/forgot-password",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "trader@example.com" }),
        }),
        { skipAuth: true }
      );
      expect(screen.getByRole("heading", { name: /check your email/i })).toBeInTheDocument();
      expect(screen.getByText(/the link expires in 15 minutes/i)).toBeInTheDocument();
    });
  });

  it("handles 429 rate limit error", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockRejectedValue(new Error("Request failed: 429"));

    render(<ForgotPasswordPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "spam@example.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/too many password reset requests/i)).toBeInTheDocument();
    });
  });
});
