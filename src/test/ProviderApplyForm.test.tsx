import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProviderApplyForm from "@/components/dashboard/provider/ProviderApplyForm";
import * as apiClientModule from "@/lib/api-client";

describe("ProviderApplyForm", () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    mockOnSuccess.mockReset();
    mockOnCancel.mockReset();
  });

  it("renders form fields with default values", () => {
    render(
      <ProviderApplyForm
        initialEmail="trader@tadex.app"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("Apply as a Signal Provider")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("e.g. Apex Crypto Alpha")).toBeInTheDocument();
    expect(screen.getByDisplayValue("trader@tadex.app")).toBeInTheDocument();
    expect(screen.getByText("Crypto Futures")).toBeInTheDocument();
  });

  it("validates mandatory fields and blocks submit if terms are not accepted", async () => {
    render(
      <ProviderApplyForm
        initialEmail=""
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    const submitBtn = screen.getByRole("button", { name: /submit application/i });
    fireEvent.click(submitBtn);

    expect(await screen.findByText("Display name is required")).toBeInTheDocument();
    expect(screen.getByText("Please enter a valid email address")).toBeInTheDocument();
    expect(screen.getByText("You must accept the Provider Terms of Service to apply")).toBeInTheDocument();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("submits valid application payload to POST /provider/apply and calls onSuccess", async () => {
    const user = userEvent.setup();
    const mockResponse = {
      id: "app-uuid-101",
      user_id: "user-123",
      status: "pending",
      display_name: "Apex Alpha",
      contact_email: "alpha@tadex.app",
      bio: "Strict 1:2 R:R scalping strategy",
      experience_level: "3+ years",
      trading_focus: ["Crypto Futures"],
      referral_source: "Telegram",
      submitted_at: "2026-08-14T20:00:00Z",
    };

    const apiSpy = vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockResponse);

    render(
      <ProviderApplyForm
        initialEmail=""
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Fill Display Name
    const nameInput = screen.getByPlaceholderText("e.g. Apex Crypto Alpha");
    await user.type(nameInput, "Apex Alpha");

    // Fill Contact Email
    const emailInput = screen.getByPlaceholderText("provider@example.com");
    await user.type(emailInput, "alpha@tadex.app");

    // Fill Bio
    const bioInput = screen.getByPlaceholderText(/tell subscribers about your trading methodology/i);
    await user.type(bioInput, "Strict 1:2 R:R scalping strategy");

    // Accept Terms checkbox
    const termsCheckbox = screen.getByRole("checkbox");
    await user.click(termsCheckbox);

    // Submit
    const submitBtn = screen.getByRole("button", { name: /submit application/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith("/provider/apply", {
        method: "POST",
        body: JSON.stringify({
          display_name: "Apex Alpha",
          contact_email: "alpha@tadex.app",
          bio: "Strict 1:2 R:R scalping strategy",
          experience_level: "1-3 years",
          trading_focus: ["Crypto Futures"],
          referral_source: "Telegram",
          terms_accepted: true,
        }),
      });
      expect(mockOnSuccess).toHaveBeenCalledWith(mockResponse);
    });
  });

  it("handles 409 conflict specifically with a clear alert", async () => {
    const user = userEvent.setup();

    vi.spyOn(apiClientModule, "apiClient").mockRejectedValueOnce(
      new Error("User already has a provider application with status 'pending'.")
    );

    render(
      <ProviderApplyForm
        initialEmail="duplicate@tadex.app"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Fill Name
    await user.type(screen.getByPlaceholderText("e.g. Apex Crypto Alpha"), "Duplicate Trader");

    // Check terms
    await user.click(screen.getByRole("checkbox"));

    // Submit
    await user.click(screen.getByRole("button", { name: /submit application/i }));

    expect(await screen.findByText("Application or Provider Profile Already Exists")).toBeInTheDocument();
    expect(
      screen.getByText("User already has a provider application with status 'pending'.")
    ).toBeInTheDocument();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });
});
