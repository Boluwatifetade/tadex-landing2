import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardLayout from "@/app/dashboard/layout";
import AccountSettings from "@/components/dashboard/AccountSettings";
import * as apiClientModule from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  usePathname: () => "/dashboard/settings",
}));

describe("AccountSettings -> DashboardHeader State Synchronization", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    useAuthStore.getState().clear();
    useAuthStore.getState().setAccessToken("mock_jwt_token_valid");
  });

  it("synchronizes Telegram unlinking from AccountSettings directly into DashboardHeader without page reload", async () => {
    let currentTelegramLinked = true;
    let currentTelegramUsername: string | null = "tadex_trader_ng";

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (endpoint: string, options?: any) => {
      if (endpoint === "/me") {
        return {
          id: "u_sync_1",
          email: "sync_trader@tadex.app",
          status: "active",
          email_verified: true,
          telegram_linked: currentTelegramLinked,
          telegram_username: currentTelegramUsername,
        };
      }
      if (endpoint === "/auth/telegram/unlink" && options?.method === "POST") {
        currentTelegramLinked = false;
        currentTelegramUsername = null;
        return { success: true };
      }
      return null;
    });

    render(
      <DashboardLayout>
        <AccountSettings />
      </DashboardLayout>
    );

    // Initial load: header displays linked telegram handle
    expect(await screen.findByTestId("header-telegram")).toHaveTextContent("@tadex_trader_ng");
    expect(screen.getByText("Connected")).toBeInTheDocument();

    // Open unlink dialog
    const disconnectBtn = screen.getByRole("button", { name: /Disconnect Telegram Account/i });
    fireEvent.click(disconnectBtn);

    expect(screen.getByText("Confirm Disconnect Telegram")).toBeInTheDocument();

    // Enter password
    const passwordInput = screen.getByPlaceholderText("Current password");
    fireEvent.change(passwordInput, { target: { value: "SecretPass123!" } });

    // Submit confirmation
    const confirmBtn = screen.getByRole("button", { name: "Confirm Disconnect" });
    fireEvent.click(confirmBtn);

    // Wait for unlinking to complete and verify notification banner
    expect(await screen.findByText("Telegram unlinked successfully. Active trading paused.")).toBeInTheDocument();

    // Verify Zustand store user state was updated
    await waitFor(() => {
      const storeUser = useAuthStore.getState().user;
      expect(storeUser?.telegram_linked).toBe(false);
      expect(storeUser?.telegram_username).toBeNull();
    });

    // Verify header no longer shows the telegram handle
    await waitFor(() => {
      expect(screen.queryByTestId("header-telegram")).not.toBeInTheDocument();
    });

    // Verify AccountSettings card shows Not Linked
    expect(screen.getByText("Not Linked")).toBeInTheDocument();
  });

  it("updates Zustand store user and header when user checks Telegram status after bot pairing", async () => {
    let currentTelegramLinked = false;
    let currentTelegramUsername: string | null = null;

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (endpoint: string, options?: any) => {
      if (endpoint === "/me") {
        return {
          id: "u_sync_2",
          email: "trader2@tadex.app",
          status: "active",
          email_verified: true,
          telegram_linked: currentTelegramLinked,
          telegram_username: currentTelegramUsername,
        };
      }
      if (endpoint === "/auth/telegram-link/request" && options?.method === "POST") {
        return {
          deep_link: "https://t.me/TadexBot?start=pairing_token_abc",
        };
      }
      return null;
    });

    render(
      <DashboardLayout>
        <AccountSettings />
      </DashboardLayout>
    );

    // Initially unlinked
    expect(await screen.findByText("No Telegram account paired")).toBeInTheDocument();
    expect(screen.queryByTestId("header-telegram")).not.toBeInTheDocument();

    // Request connection link
    const connectBtn = screen.getByRole("button", { name: /Connect Telegram Account/i });
    fireEvent.click(connectBtn);

    expect(await screen.findByText("Single-Use Pairing Link (Valid for 10 minutes)")).toBeInTheDocument();

    // Simulate user connecting with bot in external Telegram client
    currentTelegramLinked = true;
    currentTelegramUsername = "newly_linked_bot";

    // Click "Check Status" button
    const checkStatusBtn = screen.getByRole("button", { name: "Check Status" });
    fireEvent.click(checkStatusBtn);

    // Verify Zustand auth store and Header update reactively
    await waitFor(() => {
      const storeUser = useAuthStore.getState().user;
      expect(storeUser?.telegram_linked).toBe(true);
      expect(storeUser?.telegram_username).toBe("newly_linked_bot");
    });

    await waitFor(() => {
      expect(screen.getByTestId("header-telegram")).toHaveTextContent("@newly_linked_bot");
    });
  });
});
