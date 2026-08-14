import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProviderVerificationForm from "@/components/dashboard/provider/ProviderVerificationForm";
import * as apiClientModule from "@/lib/api-client";

describe("ProviderVerificationForm", () => {
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.restoreAllMocks();
    mockOnSuccess.mockReset();
    mockOnCancel.mockReset();
  });

  it("renders all 5 sections and pre-fills 3 default signal samples", () => {
    render(
      <ProviderVerificationForm
        initialDisplayName="Apex Signals"
        initialEmail="apex@tadex.app"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByText("Section 1: Operator Identity")).toBeInTheDocument();
    expect(screen.getByText("Section 2: Signal Operation")).toBeInTheDocument();
    expect(screen.getByText("Section 3: Trading Evidence")).toBeInTheDocument();
    expect(screen.getByText("Section 4: Historical Signal Records")).toBeInTheDocument();
    expect(screen.getByText("Section 5: Affirmations & Declarations")).toBeInTheDocument();

    expect(screen.getByDisplayValue("Apex Signals")).toBeInTheDocument();
    expect(screen.getByDisplayValue("apex@tadex.app")).toBeInTheDocument();

    // 3 default signals are present
    expect(screen.getByText("Signal #1")).toBeInTheDocument();
    expect(screen.getByText("Signal #2")).toBeInTheDocument();
    expect(screen.getByText("Signal #3")).toBeInTheDocument();
  });

  it("validates that all 5 declaration checkboxes are required before submission", async () => {
    const user = userEvent.setup();

    render(
      <ProviderVerificationForm
        initialDisplayName="Apex Signals"
        initialEmail="apex@tadex.app"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Fill Required Identity Fields
    await user.type(screen.getByPlaceholderText("e.g. John Doe"), "John Doe");
    await user.type(screen.getByPlaceholderText("e.g. @alpha_trader"), "@apex_alpha");
    await user.type(
      screen.getByPlaceholderText("e.g. https://t.me/alphatradingchannel"),
      "https://t.me/apexalpha"
    );
    await user.type(
      screen.getByPlaceholderText("e.g. Nigeria, Kenya, Ghana, Global"),
      "Nigeria"
    );
    await user.type(
      screen.getByPlaceholderText(/explain your methodology/i),
      "ICT and Price Action strategy"
    );

    // Fill Required Operation fields
    await user.type(screen.getByPlaceholderText("e.g. 1500"), "250");

    // Click submit without checking the 5 declarations
    const submitBtn = screen.getByRole("button", { name: /submit verification request/i });
    await user.click(submitBtn);

    expect(
      await screen.findByText("You must confirm you own and operate the channel")
    ).toBeInTheDocument();
    expect(
      screen.getByText("You must confirm all submitted information is accurate")
    ).toBeInTheDocument();
    expect(
      screen.getByText("You must acknowledge verification does not guarantee returns")
    ).toBeInTheDocument();
    expect(
      screen.getByText("You must agree to platform provider rules and code of conduct")
    ).toBeInTheDocument();
    expect(
      screen.getByText("You must declare that no historical results are fabricated")
    ).toBeInTheDocument();
    expect(mockOnSuccess).not.toHaveBeenCalled();
  });

  it("submits structured verification payload to POST /provider/request-verification when valid", async () => {
    const user = userEvent.setup();
    const mockRes = {
      status: "pending",
      verification_submitted_at: "2026-08-14T22:00:00Z",
      message: "Verification request submitted successfully and is pending administrative review.",
    };

    const apiSpy = vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockRes);

    render(
      <ProviderVerificationForm
        initialDisplayName="Apex Signals"
        initialEmail="apex@tadex.app"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );

    // Fill Identity
    await user.type(screen.getByPlaceholderText("e.g. John Doe"), "John Doe");
    await user.type(screen.getByPlaceholderText("e.g. @alpha_trader"), "@apex_alpha");
    await user.type(
      screen.getByPlaceholderText("e.g. https://t.me/alphatradingchannel"),
      "https://t.me/apexalpha"
    );
    await user.type(
      screen.getByPlaceholderText("e.g. Nigeria, Kenya, Ghana, Global"),
      "Nigeria"
    );
    await user.type(
      screen.getByPlaceholderText(/explain your methodology/i),
      "ICT and Price Action strategy"
    );

    // Fill Signal Operation
    const subInput = screen.getByPlaceholderText("e.g. 1500");
    await user.clear(subInput);
    await user.type(subInput, "1200");

    // Check all 5 declarations
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes.length).toBe(5);
    for (const cb of checkboxes) {
      await user.click(cb);
    }

    // Submit
    const submitBtn = screen.getByRole("button", { name: /submit verification request/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(
        "/provider/request-verification",
        expect.objectContaining({
          method: "POST",
        })
      );
      expect(mockOnSuccess).toHaveBeenCalledWith(mockRes);
    });
  });
});
