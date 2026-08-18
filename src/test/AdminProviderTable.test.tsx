import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminProviderTable from "@/components/admin/AdminProviderTable";
import * as apiClientModule from "@/lib/api-client";
import { AdminProviderDetailOut, AdminProviderListResponse } from "@/types/admin";

const mockProviders: AdminProviderDetailOut[] = [
  {
    id: "prov-1",
    user_id: "user-1",
    user_email: "active_trader@tadex.app",
    name: "Apex Alpha Trading",
    slug: "apex-alpha",
    description: "Trend following crypto signals",
    status: "active",
    is_active: true,
    is_suspended: false,
    is_verified: true,
    verification_level: "advanced",
    subscriber_count: 14,
    total_signals_sent: 58,
    win_rate: 81.2,
    created_at: "2026-07-01T10:00:00Z",
  },
  {
    id: "prov-2",
    user_id: "user-2",
    user_email: "suspended_trader@tadex.app",
    name: "Risky Scalper",
    slug: "risky-scalper",
    description: "High risk scalping",
    status: "suspended",
    is_active: true,
    is_suspended: true,
    suspended_at: "2026-08-01T12:00:00Z",
    suspension_reason: "Drawdown violation (>25% daily loss).",
    is_verified: false,
    verification_level: "unverified",
    subscriber_count: 2,
    total_signals_sent: 20,
    win_rate: 45.0,
    created_at: "2026-07-10T10:00:00Z",
  },
];

const mockListResponse: AdminProviderListResponse = {
  items: mockProviders,
  total: 2,
  page: 1,
  per_page: 20,
  total_pages: 1,
};

describe("AdminProviderTable Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders provider directory with email, status, tier, metrics, and actions", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockListResponse);

    render(<AdminProviderTable />);

    expect(await screen.findByText("Apex Alpha Trading")).toBeInTheDocument();
    expect(screen.getByText("Risky Scalper")).toBeInTheDocument();
    expect(screen.getByText("active_trader@tadex.app")).toBeInTheDocument();
    expect(screen.getByText("suspended_trader@tadex.app")).toBeInTheDocument();
    expect(screen.getByText("81.2%")).toBeInTheDocument();
    expect(screen.getByText("advanced")).toBeInTheDocument();
  });

  it("filters providers when status filter tabs are clicked", async () => {
    const apiSpy = vi.spyOn(apiClientModule, "apiClient").mockResolvedValue(mockListResponse);

    render(<AdminProviderTable />);

    await screen.findByText("Apex Alpha Trading");

    const suspendedTab = screen.getByRole("button", { name: "Suspended" });
    fireEvent.click(suspendedTab);

    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(
        expect.stringContaining("status=suspended")
      );
    });
  });

  it("opens provider detail modal with admin-exclusive metadata", async () => {
    const user = userEvent.setup();
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValue(mockListResponse);

    render(<AdminProviderTable />);

    await screen.findByText("Risky Scalper");

    const detailBtns = screen.getAllByRole("button", { name: /details/i });
    await user.click(detailBtns[1]); // Click Risky Scalper's details

    const modal = await screen.findByRole("dialog");
    expect(within(modal).getByText("Provider Currently Suspended")).toBeInTheDocument();
    expect(within(modal).getByText(/Drawdown violation/)).toBeInTheDocument();
    expect(within(modal).getByText("suspended_trader@tadex.app")).toBeInTheDocument();
  });

  it("enforces mandatory reason to suspend a provider and fires POST /admin/providers/{id}/suspend", async () => {
    const user = userEvent.setup();
    const apiSpy = vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path, options) => {
      if (path.includes("/admin/providers?")) return mockListResponse;
      if (path === "/admin/providers/prov-1/suspend" && options?.method === "POST") {
        return { ...mockProviders[0], status: "suspended" };
      }
      return {};
    });

    render(<AdminProviderTable />);

    const row = await screen.findByText("Apex Alpha Trading");
    const tr = row.closest("tr");
    expect(tr).not.toBeNull();

    const suspendBtn = within(tr!).getByRole("button", { name: /suspend/i });
    await user.click(suspendBtn);

    expect(screen.getByText("Suspend Signal Provider")).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/repeated excessive leverage violations/i);
    const confirmBtn = screen.getByRole("button", { name: /confirm suspension/i });

    // Try submit without reason
    expect(confirmBtn).toBeDisabled();

    // Type valid reason
    fireEvent.change(textarea, { target: { value: "Channel ownership dispute under investigation." } });
    expect(confirmBtn).not.toBeDisabled();

    await user.click(confirmBtn);

    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith("/admin/providers/prov-1/suspend", {
        method: "POST",
        body: JSON.stringify({ reason: "Channel ownership dispute under investigation." }),
      });
    });
  }, 15000);

  it("opens unsuspend confirmation and fires POST /admin/providers/{id}/unsuspend", async () => {
    const user = userEvent.setup();
    const apiSpy = vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path, options) => {
      if (path.includes("/admin/providers?")) return mockListResponse;
      if (path === "/admin/providers/prov-2/unsuspend" && options?.method === "POST") {
        return { ...mockProviders[1], status: "active" };
      }
      return {};
    });

    render(<AdminProviderTable />);

    const row = await screen.findByText("Risky Scalper");
    const tr = row.closest("tr");
    expect(tr).not.toBeNull();

    const unsuspendBtn = within(tr!).getByRole("button", { name: /unsuspend/i });
    await user.click(unsuspendBtn);

    expect(screen.getByText("Unsuspend Signal Provider")).toBeInTheDocument();

    const confirmBtn = screen.getByRole("button", { name: /confirm unsuspend/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith("/admin/providers/prov-2/unsuspend", {
        method: "POST",
      });
    });
  }, 15000);
});
