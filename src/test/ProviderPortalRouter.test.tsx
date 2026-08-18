import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProviderPortalPage from "@/app/dashboard/provider/page";
import * as apiClientModule from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/dashboard/provider",
}));

describe("ProviderPortalRouter Page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAuthStore.setState({
      accessToken: "mock-jwt-token",
      isAuthenticated: true,
    });
  });

  it("branches to 404 Unregistered state and shows Become a Signal Provider hero", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") {
        return { email: "trader@tadex.app", status: "active" };
      }
      if (path === "/provider/me") {
        throw new Error("No signal provider profile or application found for this account.");
      }
      return {};
    });

    render(<ProviderPortalPage />);

    expect(await screen.findByText("Become a Tadex Signal Provider")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /apply to become a signal provider/i })).toBeInTheDocument();
    expect(screen.getByText("100% Non-Custodial")).toBeInTheDocument();
  });

  it("branches to applicant pending state and shows under review status card", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") {
        return { email: "trader@tadex.app", status: "active" };
      }
      if (path === "/provider/me") {
        return {
          role: "applicant",
          provider: null,
          application: {
            id: "app-uuid-99",
            user_id: "user-uuid-1",
            status: "pending",
            display_name: "Apex Trading",
            contact_email: "apex@tadex.app",
            experience_level: "1-3 years",
            trading_focus: ["Crypto Futures"],
            referral_source: "Telegram",
            submitted_at: "2026-08-14T20:00:00Z",
          },
        };
      }
      return {};
    });

    render(<ProviderPortalPage />);

    expect(await screen.findByText("Provider Application Under Review")).toBeInTheDocument();
    expect(screen.getByText("app-uuid-99")).toBeInTheDocument();
    expect(screen.getByText("Apex Trading")).toBeInTheDocument();
    expect(screen.getByText("apex@tadex.app")).toBeInTheDocument();
    expect(screen.getByText("What happens next?")).toBeInTheDocument();
  });

  it("branches to applicant rejected state and shows reason with Update & Re-apply CTA", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") {
        return { email: "trader@tadex.app", status: "active" };
      }
      if (path === "/provider/me") {
        return {
          role: "applicant",
          provider: null,
          application: {
            id: "app-uuid-rejected",
            user_id: "user-uuid-1",
            status: "rejected",
            display_name: "Test Trader",
            contact_email: "test@tadex.app",
            experience_level: "Less than 1 year",
            trading_focus: ["Crypto Futures"],
            referral_source: "Telegram",
            submitted_at: "2026-08-14T18:00:00Z",
            reviewed_at: "2026-08-14T19:00:00Z",
            rejection_reason: "Insufficient historical trading track record.",
          },
        };
      }
      return {};
    });

    render(<ProviderPortalPage />);

    expect(await screen.findByText("Application Status: Not Approved")).toBeInTheDocument();
    expect(screen.getByText("Insufficient historical trading track record.")).toBeInTheDocument();

    const reapplyBtn = screen.getByRole("button", { name: /update & re-apply/i });
    expect(reapplyBtn).toBeInTheDocument();

    // Click Update & Re-apply to open apply form
    fireEvent.click(reapplyBtn);
    expect(screen.getByText("Apply as a Signal Provider")).toBeInTheDocument();
  });

  it("branches to provider role and renders full ProviderDashboard with plans", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path) => {
      if (path === "/me") {
        return { email: "boluwatifewisdom23@gmail.com", status: "active" };
      }
      if (path === "/provider/me") {
        return {
          role: "provider",
          provider: {
            id: "c0a8a1f0-1564-4d6e-85c3-0b93685785c1",
            name: "Trading academy",
            description: "We are the best traders",
            email: "boluwatifewisdom23@gmail.com",
            status: "suspended",
            is_verified: true,
            verification_level: "basic",
            verification_submitted_at: null,
            verification_approved_at: "2026-07-05T09:35:45Z",
            total_signals_sent: 42,
            win_rate: 78.5,
            subscriber_count: 5,
            created_at: "2026-07-05T09:35:45Z",
          },
          application: null,
        };
      }
      if (path === "/provider/plans") {
        return [
          {
            id: "plan-1",
            provider_id: "c0a8a1f0-1564-4d6e-85c3-0b93685785c1",
            name: "Trading Basics",
            monthly_price_cents: 1000000,
            currency: "NGN",
            max_duration_days: 30,
            description: "2 signals daily",
            is_active: true,
            status: "active",
          },
        ];
      }
      return {};
    });

    render(<ProviderPortalPage />);

    expect(await screen.findByText("Trading academy")).toBeInTheDocument();
    expect(screen.getByText("Signal Provider Profile Suspended")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("78.5%")).toBeInTheDocument();
    expect(screen.getByText("Trading Basics")).toBeInTheDocument();
  });
});
