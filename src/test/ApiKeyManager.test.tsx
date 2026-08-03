import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ApiKeyManager from "@/components/dashboard/ApiKeyManager";
import * as apiClientModule from "@/lib/api-client";

describe("ApiKeyManager", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders empty state when GET /keys returns no keys", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce([]);

    render(<ApiKeyManager />);

    expect(await screen.findByText("No exchange connected yet")).toBeInTheDocument();
    expect(screen.getByText("Connect your Bybit API key using the form to start automated trading.")).toBeInTheDocument();
  });

  it("renders connected key card with correct masked key representation and environment badge", async () => {
    const mockKeys = [
      {
        id: "key_uuid_101",
        exchange: "bybit",
        api_key_masked: "...a1b2",
        is_testnet: false,
        status: "active",
        created_at: "2026-08-01T12:00:00Z",
      },
    ];

    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockKeys);

    render(<ApiKeyManager />);

    expect(await screen.findByText("bybit")).toBeInTheDocument();
    expect(screen.getByText("Mainnet")).toBeInTheDocument();
    expect(screen.getByText("...a1b2")).toBeInTheDocument();
    expect(screen.getByText("active")).toBeInTheDocument();
  });

  it("displays specific security withdrawal-rejection alert message on mocked 400 response", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path, options) => {
      if (path === "/keys" && (!options || !options.method || options.method === "GET")) {
        return [];
      }
      if (path === "/keys" && options?.method === "POST") {
        throw new Error(
          "This API key has withdrawal permission enabled. For your security, Tadex only accepts trade-only keys with withdrawal disabled. Please create a new key on Bybit without withdrawal permission."
        );
      }
      return [];
    });

    render(<ApiKeyManager />);

    await screen.findByText("No exchange connected yet");

    // Fill form
    const apiKeyInput = screen.getByPlaceholderText("e.g. 8x9F...A2b1");
    const apiSecretInput = screen.getByPlaceholderText("Enter your Bybit API Secret");

    await userEvent.type(apiKeyInput, "TEST_API_KEY_WITHDRAWAL");
    await userEvent.type(apiSecretInput, "TEST_API_SECRET_WITHDRAWAL");

    const submitBtn = screen.getByRole("button", { name: "Connect Bybit Account" });
    fireEvent.click(submitBtn);

    // Verify rejection alert box appears
    expect(await screen.findByText("Security Policy Rejection")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This API key has withdrawal permission enabled. For your security, Tadex only accepts trade-only keys with withdrawal disabled. Please create a new key on Bybit without withdrawal permission."
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/How to fix:/)).toBeInTheDocument();
  });

  it("requires explicit confirmation before firing DELETE /keys/{id}", async () => {
    const mockKeys = [
      {
        id: "key_to_delete_999",
        exchange: "bybit",
        api_key_masked: "...9999",
        is_testnet: true,
        status: "active",
        created_at: "2026-08-02T10:00:00Z",
      },
    ];

    const apiClientSpy = vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path, options) => {
      if (path === "/keys" && (!options || !options.method || options.method === "GET")) {
        return mockKeys;
      }
      if (path === "/keys/key_to_delete_999" && options?.method === "DELETE") {
        return { message: "API key revoked successfully" };
      }
      return [];
    });

    render(<ApiKeyManager />);

    expect(await screen.findByText("...9999")).toBeInTheDocument();

    // 1. Click Disconnect button
    const disconnectBtn = screen.getByRole("button", { name: /Disconnect/i });
    fireEvent.click(disconnectBtn);

    // 2. Verify confirmation banner appears and DELETE has NOT fired yet
    expect(screen.getByText("Confirm Disconnection")).toBeInTheDocument();
    expect(screen.getByText("Revoking this key will pause automated trading execution. Are you sure?")).toBeInTheDocument();

    const deleteCallsBeforeConfirm = apiClientSpy.mock.calls.filter(([p, o]) => p.includes("key_to_delete_999") && o?.method === "DELETE");
    expect(deleteCallsBeforeConfirm.length).toBe(0);

    // 3. Click "Yes, Revoke Key" confirmation button
    const confirmBtn = screen.getByRole("button", { name: "Yes, Revoke Key" });
    fireEvent.click(confirmBtn);

    // 4. Verify DELETE API call was fired
    await waitFor(() => {
      const deleteCallsAfterConfirm = apiClientSpy.mock.calls.filter(([p, o]) => p.includes("key_to_delete_999") && o?.method === "DELETE");
      expect(deleteCallsAfterConfirm.length).toBe(1);
    });

    // 5. Verify key is removed from UI
    await waitFor(() => {
      expect(screen.queryByText("...9999")).not.toBeInTheDocument();
    });
  });
});
