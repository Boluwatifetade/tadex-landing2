import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AdminUserTable from "@/components/admin/AdminUserTable";
import * as apiClientModule from "@/lib/api-client";
import { AdminUserListResponse } from "@/types/admin";

const mockUsersResponse: AdminUserListResponse = {
  items: [
    {
      id: "user-uuid-1",
      email: "trader1@tadex.app",
      email_verified: true,
      telegram_id: 12345678,
      telegram_username: "cryptotrader",
      phone: "+2348011223344",
      role: "user",
      status: "active",
      registration_source: "web",
      created_at: "2026-08-01T12:00:00Z",
      last_seen: "2026-08-20T10:00:00Z",
      connected_accounts_count: 2,
      active_subscriptions_count: 1,
    },
    {
      id: "user-uuid-2",
      email: "unverified_bot@tadex.app",
      email_verified: false,
      telegram_id: 87654321,
      telegram_username: "bot_operator",
      phone: null,
      role: "user",
      status: "banned",
      registration_source: "telegram",
      created_at: "2026-08-10T15:30:00Z",
      last_seen: null,
      connected_accounts_count: 0,
      active_subscriptions_count: 0,
    },
  ],
  total: 2,
  page: 1,
  per_page: 15,
  total_pages: 1,
};

describe("AdminUserTable Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders user directory with status badges and summary counts", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockUsersResponse);

    render(<AdminUserTable />);

    const trader1Emails = await screen.findAllByText("trader1@tadex.app");
    expect(trader1Emails.length).toBeGreaterThan(0);

    const botEmails = screen.getAllByText("unverified_bot@tadex.app");
    expect(botEmails.length).toBeGreaterThan(0);

    expect(screen.getAllByText("@cryptotrader").length).toBeGreaterThan(0);
    expect(screen.getAllByText("active").length).toBeGreaterThan(0);
    expect(screen.getAllByText("banned").length).toBeGreaterThan(0);

    const links = screen.getAllByText("View 360°");
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].closest("a")).toHaveAttribute("href", "/admin/users/user-uuid-1");
  });

  it("triggers search query when typing in 5-dimension search bar", async () => {
    const apiClientSpy = vi.spyOn(apiClientModule, "apiClient").mockResolvedValue(mockUsersResponse);

    render(<AdminUserTable />);
    await screen.findAllByText("trader1@tadex.app");

    const searchInput = screen.getByPlaceholderText(/Search across Email, Telegram/i);
    fireEvent.change(searchInput, { target: { value: "cryptotrader" } });

    await waitFor(() => {
      expect(apiClientSpy).toHaveBeenCalledWith(
        expect.stringContaining("q=cryptotrader")
      );
    });
  });

  it("filters by status and email verification dropdowns", async () => {
    const apiClientSpy = vi.spyOn(apiClientModule, "apiClient").mockResolvedValue(mockUsersResponse);

    render(<AdminUserTable />);
    await screen.findAllByText("trader1@tadex.app");

    const statusSelect = screen.getByDisplayValue("All Statuses");
    fireEvent.change(statusSelect, { target: { value: "banned" } });

    await waitFor(() => {
      expect(apiClientSpy).toHaveBeenCalledWith(
        expect.stringContaining("status=banned")
      );
    });

    const verifSelect = screen.getByDisplayValue("All Verifications");
    fireEvent.change(verifSelect, { target: { value: "unverified" } });

    await waitFor(() => {
      expect(apiClientSpy).toHaveBeenCalledWith(
        expect.stringContaining("email_verified=false")
      );
    });
  });

  it("renders empty state when no users match search criteria", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce({
      items: [],
      total: 0,
      page: 1,
      per_page: 15,
      total_pages: 0,
    });

    render(<AdminUserTable />);

    const noUsers = await screen.findAllByText("No users found");
    expect(noUsers.length).toBeGreaterThan(0);
    expect(screen.getByText(/Try adjusting your search term/i)).toBeInTheDocument();
  });
});
