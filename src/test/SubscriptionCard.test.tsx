import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import SubscriptionCard from "@/components/dashboard/SubscriptionCard";
import * as apiClientModule from "@/lib/api-client";

describe("SubscriptionCard", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders 'No active subscription' state when has_active_subscription is false", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce({
      has_active_subscription: false,
      subscription: null,
      notifications: [],
    });

    render(<SubscriptionCard />);

    expect(await screen.findByText("No active subscription")).toBeInTheDocument();
    expect(
      screen.getByText(/You are currently on the Free \/ Demo tier. Subscribe to a plan below/i)
    ).toBeInTheDocument();
  });

  it("renders active subscription details and notification warnings when active", async () => {
    const mockResponse = {
      has_active_subscription: true,
      subscription: {
        id: "sub_123",
        user_id: "user_456",
        tier: "pro",
        status: "active",
        is_active: true,
        current_period_end: "2026-08-30T00:00:00Z",
      },
      notifications: ["⚠️ Your subscription payment is past due."],
    };

    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockResponse);

    render(<SubscriptionCard />);

    expect(await screen.findByText("pro")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
    expect(screen.getByText("⚠️ Your subscription payment is past due.")).toBeInTheDocument();
  });

  it("renders error state when fetch fails and allows retry", async () => {
    const apiClientSpy = vi.spyOn(apiClientModule, "apiClient");
    apiClientSpy.mockRejectedValueOnce(new Error("Failed to load subscription status"));

    render(<SubscriptionCard />);

    expect(await screen.findByText("Failed to load subscription status")).toBeInTheDocument();

    // Retry
    apiClientSpy.mockResolvedValueOnce({
      has_active_subscription: false,
      subscription: null,
      notifications: [],
    });

    const retryBtn = screen.getByRole("button", { name: "Retry" });
    fireEvent.click(retryBtn);

    expect(await screen.findByText("No active subscription")).toBeInTheDocument();
  });
});
