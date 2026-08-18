import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminApplicationsQueue from "@/components/admin/AdminApplicationsQueue";
import * as apiClientModule from "@/lib/api-client";
import {
  AdminProviderApplicationOut,
  AdminProviderApplicationListResponse,
} from "@/types/admin";

const mockApplications: AdminProviderApplicationOut[] = [
  {
    id: "app-1",
    user_id: "user-101",
    user_email: "applicant1@tadex.app",
    status: "pending",
    display_name: "Sterling Signals",
    contact_email: "sterling@tadex.app",
    bio: "Algorithmic crypto scalper with 1:2 RR.",
    experience_level: "3+ years",
    trading_focus: ["Crypto Futures", "Spot"],
    referral_source: "Telegram",
    submitted_at: "2026-08-17T12:00:00Z",
  },
  {
    id: "app-2",
    user_id: "user-102",
    user_email: "applicant2@tadex.app",
    status: "approved",
    display_name: "Macro Trader",
    contact_email: "macro@tadex.app",
    bio: "Macro economic swing strategy",
    experience_level: "1-3 years",
    trading_focus: ["Forex"],
    referral_source: "Twitter",
    submitted_at: "2026-08-16T12:00:00Z",
    reviewed_at: "2026-08-16T15:00:00Z",
  },
];

const mockListResponse: AdminProviderApplicationListResponse = {
  items: mockApplications,
  total: 2,
  page: 1,
  per_page: 20,
  total_pages: 1,
};

describe("AdminApplicationsQueue Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders applications queue with submitted details and trading focus chips", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockListResponse);

    render(<AdminApplicationsQueue />);

    expect(await screen.findByText("Sterling Signals")).toBeInTheDocument();
    expect(screen.getByText("sterling@tadex.app")).toBeInTheDocument();
    expect(screen.getByText("3+ years")).toBeInTheDocument();
    expect(screen.getByText("Crypto Futures")).toBeInTheDocument();
    expect(screen.getByText("Spot")).toBeInTheDocument();
  });

  it("filters applications when status filter tab is selected", async () => {
    const apiSpy = vi.spyOn(apiClientModule, "apiClient").mockResolvedValue(mockListResponse);

    render(<AdminApplicationsQueue />);

    await screen.findByText("Sterling Signals");

    const approvedTab = screen.getByRole("button", { name: "Approved" });
    fireEvent.click(approvedTab);

    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(
        expect.stringContaining("status=approved")
      );
    });
  });

  it("opens approve modal and calls POST /admin/providers/applications/{id}/approve", async () => {
    const user = userEvent.setup();
    const apiSpy = vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path, options) => {
      if (path.includes("/admin/providers/applications?")) return mockListResponse;
      if (path === "/admin/providers/applications/app-1/approve" && options?.method === "POST") {
        return { ...mockApplications[0], status: "approved" };
      }
      return {};
    });

    render(<AdminApplicationsQueue />);

    await screen.findByText("Sterling Signals");

    const approveBtn = screen.getByRole("button", { name: /approve & activate/i });
    await user.click(approveBtn);

    expect(await screen.findByText("Approve Signal Provider")).toBeInTheDocument();

    const confirmApproveBtn = screen.getByRole("button", { name: /confirm approval/i });
    await user.click(confirmApproveBtn);

    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith("/admin/providers/applications/app-1/approve", {
        method: "POST",
        body: JSON.stringify({
          provider_name: "Sterling Signals",
        }),
      });
    });
  });

  it("enforces mandatory reason to reject an application and calls POST /admin/providers/applications/{id}/reject", async () => {
    const user = userEvent.setup();
    const apiSpy = vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path, options) => {
      if (path.includes("/admin/providers/applications?")) return mockListResponse;
      if (path === "/admin/providers/applications/app-1/reject" && options?.method === "POST") {
        return { ...mockApplications[0], status: "rejected" };
      }
      return {};
    });

    render(<AdminApplicationsQueue />);

    await screen.findByText("Sterling Signals");

    const rejectBtn = screen.getByRole("button", { name: /^reject$/i });
    await user.click(rejectBtn);

    expect(await screen.findByText("Reject Provider Application")).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/incomplete track record details/i);
    const confirmRejectBtn = screen.getByRole("button", { name: /confirm rejection/i });

    // Disabled initially
    expect(confirmRejectBtn).toBeDisabled();

    // Type rejection reason
    fireEvent.change(textarea, { target: { value: "Track record links are broken or unverifiable." } });
    expect(confirmRejectBtn).not.toBeDisabled();

    await user.click(confirmRejectBtn);

    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith("/admin/providers/applications/app-1/reject", {
        method: "POST",
        body: JSON.stringify({
          reason: "Track record links are broken or unverifiable.",
        }),
      });
    });
  });
});
