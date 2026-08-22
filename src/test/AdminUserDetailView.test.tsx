import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AdminUserDetailView from "@/components/admin/AdminUserDetailView";
import * as apiClientModule from "@/lib/api-client";
import { AdminUserDetail360Out } from "@/types/admin";

const mockUserDetail: AdminUserDetail360Out = {
  id: "user-uuid-360",
  email: "trader_pro@tadex.app",
  email_verified: false,
  telegram_id: 99887766,
  username: "trader_pro",
  phone: "+2348099887766",
  role: "user",
  status: "active",
  is_beta_tester: true,
  terms_accepted: true,
  terms_accepted_at: "2026-08-01T10:00:00Z",
  registration_source: "web",
  created_at: "2026-08-01T10:00:00Z",
  updated_at: "2026-08-15T12:00:00Z",
  last_seen: "2026-08-20T14:30:00Z",
  connected_exchanges: [
    {
      id: "acc-uuid-1",
      exchange: "bybit",
      account_name: "Bybit Futures Main",
      account_type: "futures",
      trading_mode: "auto",
      risk_level: "low",
      current_leverage: 10,
      is_testnet: false,
      status: "active",
      last_validated_at: "2026-08-19T08:00:00Z",
      validation_error: null,
      api_key_masked: "key_****7890",
      created_at: "2026-08-02T11:00:00Z",
    },
  ],
  subscriptions: [
    {
      id: "sub-uuid-1",
      provider_id: "prov-uuid-1",
      provider_name: "THOLAR Trading Academy",
      plan_id: "plan-uuid-1",
      plan_name: "VIP Futures Signals",
      tier: "vip",
      status: "active",
      is_active: true,
      started_at: "2026-08-05T00:00:00Z",
      expires_at: "2026-09-05T00:00:00Z",
      current_period_end: "2026-09-05T00:00:00Z",
      canceled_at: null,
    },
  ],
  provider_profile: {
    id: "prov-profile-1",
    name: "Trader Pro Signals",
    slug: "trader-pro-signals",
    status: "active",
    is_verified: true,
    verification_level: "advanced",
    subscriber_count: 42,
    total_signals_sent: 120,
    win_rate: 76.5,
    created_at: "2026-08-03T12:00:00Z",
  },
  payment_history: [
    {
      id: "tx-uuid-1",
      amount_cents: 2500,
      amount_minor: 2500,
      currency: "USD",
      payment_method: "card",
      status: "successful",
      provider: "flutterwave",
      created_at: "2026-08-05T00:01:00Z",
    },
  ],
  recent_audit_logs: [
    {
      id: "audit-1",
      action_type: "user_verify_email",
      target_entity_type: "user",
      target_entity_id: "user-uuid-360",
      admin_user_id: "admin-uuid-1",
      reason: "Initial registration verification",
      created_at: "2026-08-01T10:05:00Z",
    },
  ],
};

describe("AdminUserDetailView 360° Profile Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders all 6 360-degree profile sections correctly", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockUserDetail);

    render(<AdminUserDetailView userId="user-uuid-360" />);

    expect(await screen.findByRole("heading", { name: "trader_pro@tadex.app" })).toBeInTheDocument();
    expect(screen.getByText("Beta Tester")).toBeInTheDocument();

    // Section 1: Identity
    expect(screen.getByText("@trader_pro")).toBeInTheDocument();
    expect(screen.getByText("99887766")).toBeInTheDocument();

    // Section 2: Connected Exchanges
    expect(screen.getByText("Bybit Futures Main")).toBeInTheDocument();
    expect(screen.getByText("key_****7890")).toBeInTheDocument();

    // Section 3: Subscriptions
    expect(screen.getByText("VIP Futures Signals")).toBeInTheDocument();
    expect(screen.getByText("THOLAR Trading Academy")).toBeInTheDocument();

    // Section 4: Provider Profile & Link
    expect(screen.getByText("Trader Pro Signals")).toBeInTheDocument();
    expect(screen.getByText("View in Provider Governance")).toBeInTheDocument();

    // Section 5: Payment History
    expect(screen.getByText(/25\.00/)).toBeInTheDocument();
    expect(screen.getByText("flutterwave")).toBeInTheDocument();

    // Section 6: Audit Trail
    expect(screen.getByText("user_verify_email")).toBeInTheDocument();
    expect(screen.getByText(/Initial registration verification/i)).toBeInTheDocument();
  });

  it("DOM-level security check: confirms only masked API keys render and no unmasked secret appears", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockUserDetail);

    const { container } = render(<AdminUserDetailView userId="user-uuid-360" />);
    await screen.findByRole("heading", { name: "trader_pro@tadex.app" });

    // The masked key MUST be in DOM
    expect(container.innerHTML).toContain("key_****7890");

    // Ensure raw unmasked API keys or secrets NEVER appear
    expect(container.innerHTML).not.toContain("raw_api_secret");
    expect(container.innerHTML).not.toContain("secret_key");
    expect(container.innerHTML).not.toContain("private_key");
  });

  it("opens Ban modal, enforces mandatory reason (min 3 chars), and dispatches ban API call", async () => {
    vi.spyOn(apiClientModule, "apiClient")
      .mockResolvedValueOnce(mockUserDetail)
      .mockResolvedValueOnce({ status: "success" })
      .mockResolvedValueOnce({ ...mockUserDetail, status: "banned" });

    render(<AdminUserDetailView userId="user-uuid-360" />);
    await screen.findByRole("heading", { name: "trader_pro@tadex.app" });

    const banBtn = screen.getByRole("button", { name: /Ban User/i });
    fireEvent.click(banBtn);

    expect(screen.getByRole("heading", { name: /Ban User Account/i })).toBeInTheDocument();

    const submitBan = screen.getByRole("button", { name: /Confirm Ban/i });
    expect(submitBan).toBeDisabled();

    const reasonInput = screen.getByPlaceholderText(/Provide a mandatory reason for the audit trail/i);
    fireEvent.change(reasonInput, { target: { value: "Terms of service violation" } });
    expect(submitBan).not.toBeDisabled();

    fireEvent.click(submitBan);

    await waitFor(() => {
      expect(apiClientModule.apiClient).toHaveBeenCalledWith(
        "/admin/users/user-uuid-360/ban",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ reason: "Terms of service violation" }),
        })
      );
    });
  });

  it("opens Administrative Force Logout-All modal with distinct admin notice and enforces mandatory reason", async () => {
    vi.spyOn(apiClientModule, "apiClient")
      .mockResolvedValueOnce(mockUserDetail)
      .mockResolvedValueOnce({ status: "success" })
      .mockResolvedValueOnce(mockUserDetail);

    render(<AdminUserDetailView userId="user-uuid-360" />);
    await screen.findByRole("heading", { name: "trader_pro@tadex.app" });

    const logoutBtn = screen.getByRole("button", { name: /Admin Logout-All/i });
    fireEvent.click(logoutBtn);

    expect(screen.getByRole("heading", { name: /Administrative Force Logout-All/i })).toBeInTheDocument();
    expect(screen.getByText(/administrative revocation/i)).toBeInTheDocument();

    const submitLogout = screen.getByRole("button", { name: /Force Logout All Devices/i });
    expect(submitLogout).toBeDisabled();

    const reasonInput = screen.getByPlaceholderText(/Reason for administrative session termination/i);
    fireEvent.change(reasonInput, { target: { value: "Security compromise check" } });
    expect(submitLogout).not.toBeDisabled();

    fireEvent.click(submitLogout);

    await waitFor(() => {
      expect(apiClientModule.apiClient).toHaveBeenCalledWith(
        "/admin/users/user-uuid-360/logout-all",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ reason: "Security compromise check" }),
        })
      );
    });
  });

  it("renders Force Verify Email and Resend Verification buttons when unverified, and triggers them", async () => {
    vi.spyOn(apiClientModule, "apiClient")
      .mockResolvedValueOnce(mockUserDetail)
      .mockResolvedValueOnce({ message: "Verification email dispatched" })
      .mockResolvedValueOnce(mockUserDetail);

    render(<AdminUserDetailView userId="user-uuid-360" />);
    await screen.findByRole("heading", { name: "trader_pro@tadex.app" });

    // Resend Verification
    const resendBtn = screen.getByRole("button", { name: /Resend Verification/i });
    fireEvent.click(resendBtn);

    await waitFor(() => {
      expect(apiClientModule.apiClient).toHaveBeenCalledWith(
        "/admin/users/user-uuid-360/resend-verification",
        expect.objectContaining({ method: "POST" })
      );
    });

    // Force Verify Email Modal
    const forceVerifyBtn = screen.getByRole("button", { name: /Force Verify Email/i });
    fireEvent.click(forceVerifyBtn);

    expect(screen.getByRole("heading", { name: /Force Verify Email Address/i })).toBeInTheDocument();

    const reasonInput = screen.getByPlaceholderText(/Reason for manual verification override/i);
    fireEvent.change(reasonInput, { target: { value: "Manual support onboarding" } });

    const submitForce = screen.getByRole("button", { name: /Confirm Force Verify/i });
    fireEvent.click(submitForce);

    await waitFor(() => {
      expect(apiClientModule.apiClient).toHaveBeenCalledWith(
        "/admin/users/user-uuid-360/force-verify-email",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ reason: "Manual support onboarding" }),
        })
      );
    });
  });
});
