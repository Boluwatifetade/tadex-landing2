import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminVerificationQueue from "@/components/admin/AdminVerificationQueue";
import * as apiClientModule from "@/lib/api-client";
import {
  AdminVerificationQueueItem,
  AdminVerificationQueueResponse,
} from "@/types/admin";

const mockVerificationItem: AdminVerificationQueueItem = {
  provider_id: "prov-uuid-1",
  provider_name: "Apex Alpha Pro",
  provider_status: "active",
  user_id: "user-uuid-1",
  user_email: "apex@tadexapp.com",
  telegram_username: "@apex_alpha_trader",
  verification_submitted_at: "2026-08-17T20:00:00Z",
  dossier: {
    identity: {
      full_name: "Alexander Hayes",
      telegram_username: "@apex_alpha_trader",
      telegram_channel_link: "https://t.me/apexalpha",
      email: "apex@tadexapp.com",
      country_region: "Nigeria",
      display_name: "Apex Alpha Pro",
      service_description: "Algorithmic momentum scalper.",
    },
    signal_operation: {
      telegram_channel_link: "https://t.me/apexalpha",
      approx_subscriber_count: 2850,
      time_providing_signals: "2 years",
      markets_traded: ["Crypto Futures"],
      exchanges_supported: ["Bybit"],
      manual_or_automated: "automated",
      typical_signal_frequency: "3 daily",
    },
    trading_evidence: {
      exchange_name: "Bybit",
      exchange_uid: "91827364",
      trading_profile_link: "https://bybit.com/leaderboard/apex",
      performance_report_link: "https://tadex.app/report.pdf",
    },
    historical_signals: [
      {
        symbol: "BTCUSDT",
        entry: "62400",
        stop_loss: "61200",
        take_profit: "65100",
        datetime: "2026-08-01 10:30 UTC",
        result: "TP2 hit (+4.3%)",
        original_message_link: "https://t.me/apexalpha/482",
      },
      {
        symbol: "ETHUSDT",
        entry: "3320",
        stop_loss: "3250",
        take_profit: "3490",
        datetime: "2026-08-04 14:15 UTC",
        result: "TP1 & TP2 hit (+5.1%)",
        original_message_link: "https://t.me/apexalpha/491",
      },
      {
        symbol: "SOLUSDT",
        entry: "178.5",
        stop_loss: "172.0",
        take_profit: "192.0",
        datetime: "2026-08-08 08:45 UTC",
        result: "Full TP hit (+7.5%)",
        original_message_link: "https://t.me/apexalpha/505",
      },
    ],
    declarations: {
      owns_channel: true,
      info_accurate: true,
      understands_no_guarantee: true,
      agrees_to_rules: true,
      no_fabricated_results: true,
    },
  },
};

const mockQueueResponse: AdminVerificationQueueResponse = {
  items: [mockVerificationItem],
  total: 1,
  page: 1,
  per_page: 20,
  total_pages: 1,
};

describe("AdminVerificationQueue Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders full 5-section evidence dossier for submitted verification requests", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockQueueResponse);

    render(<AdminVerificationQueue />);

    expect(await screen.findByText("Apex Alpha Pro")).toBeInTheDocument();
    expect(screen.getByText("Section 1: Operator Identity")).toBeInTheDocument();
    expect(screen.getByText("Alexander Hayes")).toBeInTheDocument();
    expect(screen.getByText("Section 2: Signal Operation")).toBeInTheDocument();
    expect(screen.getByText("2,850")).toBeInTheDocument();
    expect(screen.getByText("Section 3: Trading Evidence & External Proof")).toBeInTheDocument();
    expect(screen.getByText(/Bybit: 91827364/)).toBeInTheDocument();
    expect(screen.getByText("Section 4: Historical Signals Table (3 Samples)")).toBeInTheDocument();
    expect(screen.getByText("BTCUSDT")).toBeInTheDocument();
    expect(screen.getByText("ETHUSDT")).toBeInTheDocument();
    expect(screen.getByText("SOLUSDT")).toBeInTheDocument();
    expect(screen.getByText("Section 5: Operator Affirmations & Declarations")).toBeInTheDocument();
  });

  it("opens verify modal, selects tier level, and calls POST /admin/providers/{id}/verify", async () => {
    const user = userEvent.setup();
    const apiSpy = vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path, options) => {
      if (path.includes("/admin/providers/verification-queue?")) return mockQueueResponse;
      if (path === "/admin/providers/prov-uuid-1/verify" && options?.method === "POST") {
        return { is_verified: true, verification_level: "advanced" };
      }
      return {};
    });

    render(<AdminVerificationQueue />);

    await screen.findByText("Apex Alpha Pro");

    const verifyBtn = screen.getByRole("button", { name: /verify provider/i });
    await user.click(verifyBtn);

    expect(await screen.findByText("Grant Verified Provider Status")).toBeInTheDocument();

    // Select "Advanced" tier level
    const advancedRadio = screen.getByLabelText(/advanced/i);
    fireEvent.click(advancedRadio);

    // Add review notes
    const notesInput = screen.getByPlaceholderText(/audited bybit copytrade/i);
    fireEvent.change(notesInput, { target: { value: "Verified Bybit copytrade leaderboard rank #4." } });

    // Submit modal
    const confirmBtn = screen.getByRole("button", { name: /grant verified badge/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith("/admin/providers/prov-uuid-1/verify", {
        method: "POST",
        body: JSON.stringify({
          verification_level: "advanced",
          notes: "Verified Bybit copytrade leaderboard rank #4.",
        }),
      });
    });
  }, 15000);

  it("enforces mandatory reason to reject verification and calls POST /admin/providers/{id}/reject-verification", async () => {
    const user = userEvent.setup();
    const apiSpy = vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path, options) => {
      if (path.includes("/admin/providers/verification-queue?")) return mockQueueResponse;
      if (path === "/admin/providers/prov-uuid-1/reject-verification" && options?.method === "POST") {
        return { is_verified: false };
      }
      return {};
    });

    render(<AdminVerificationQueue />);

    await screen.findByText("Apex Alpha Pro");

    const rejectBtn = screen.getByRole("button", { name: /^reject$/i });
    await user.click(rejectBtn);

    expect(await screen.findByText("Reject Verification Request")).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText(/historical signal message links did not match/i);
    const confirmRejectBtn = screen.getByRole("button", { name: /confirm rejection/i });

    expect(confirmRejectBtn).toBeDisabled();

    fireEvent.change(textarea, { target: { value: "Historical trade screenshots are missing execution timestamps." } });
    expect(confirmRejectBtn).not.toBeDisabled();

    await user.click(confirmRejectBtn);

    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith("/admin/providers/prov-uuid-1/reject-verification", {
        method: "POST",
        body: JSON.stringify({
          reason: "Historical trade screenshots are missing execution timestamps.",
        }),
      });
    });
  }, 15000);
});
