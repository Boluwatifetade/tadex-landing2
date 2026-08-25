import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminKillSwitchCard from "@/components/admin/AdminKillSwitchCard";
import AdminKillSwitchModal from "@/components/admin/AdminKillSwitchModal";
import { SystemControlState } from "@/types/admin";
import { apiClient } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

describe("Phase Admin-4b: AdminKillSwitch Tests", () => {
  const normalControlState: SystemControlState = {
    control_type: "kill_switch",
    effective_value: false,
    source: "database",
    is_db_override: true,
    db_row: {
      id: "dd7ba17f-3256-47ce-b608-5108fbac9a5c",
      control_type: "kill_switch",
      is_enabled: false,
      reason: "Normal operations — trading active",
      created_at: "2026-08-24T12:06:35Z",
      updated_at: "2026-08-24T12:06:35Z",
    },
    description: "Global emergency stop. When enabled, halts all new trade executions platform-wide.",
  };

  const haltedControlState: SystemControlState = {
    ...normalControlState,
    effective_value: true,
    db_row: {
      ...normalControlState.db_row!,
      is_enabled: true,
      reason: "Emergency halt active",
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders kill switch card with normal trading status and Emergency Halt button", () => {
    render(
      <AdminKillSwitchCard
        controlState={normalControlState}
        onMutationSuccess={vi.fn()}
      />
    );

    expect(screen.getByText("Global Emergency Kill Switch")).toBeDefined();
    expect(screen.getByText("NORMAL OPERATIONS (TRADING ACTIVE)")).toBeDefined();
    expect(screen.getByText("Emergency Halt Trading")).toBeDefined();
  });

  it("renders kill switch card in halted critical state with Resume Trading button", () => {
    render(
      <AdminKillSwitchCard
        controlState={haltedControlState}
        onMutationSuccess={vi.fn()}
      />
    );

    expect(screen.getByText("EMERGENCY HALT ACTIVE")).toBeDefined();
    expect(screen.getByText("Resume Trading Pipeline")).toBeDefined();
  });

  it("enforces 2-step confirmation and exact phrase 'HALT TRADING' for emergency halt", async () => {
    const onSuccess = vi.fn();
    (apiClient as any).mockResolvedValueOnce({
      success: true,
      message: "Kill switch engaged",
      control: haltedControlState,
    });

    render(
      <AdminKillSwitchModal
        isOpen={true}
        onClose={vi.fn()}
        controlState={normalControlState}
        targetEnable={true}
        onSuccess={onSuccess}
      />
    );

    // Step 1: Impact review
    expect(screen.getByText("EMERGENCY ACTION: HALT ALL TRADING")).toBeDefined();
    expect(screen.getByText("Proceed to Confirmation")).toBeDefined();

    // Click Proceed to Step 2
    fireEvent.click(screen.getByText("Proceed to Confirmation"));

    // Step 2: Exact phrase input
    expect(screen.getByText(/Type "HALT TRADING" to confirm/i)).toBeDefined();

    const submitBtn = screen.getByRole("button", { name: /HALT TRADING NOW/i });
    expect(submitBtn).toBeDisabled();

    // Enter wrong phrase
    const phraseInput = screen.getByPlaceholderText("HALT TRADING");
    fireEvent.change(phraseInput, { target: { value: "halt trading" } }); // lowercase
    expect(submitBtn).toBeDisabled();

    // Enter correct phrase but reason < 3 chars
    fireEvent.change(phraseInput, { target: { value: "HALT TRADING" } });
    const reasonInput = screen.getByPlaceholderText(/Explain the emergency incident/i);
    fireEvent.change(reasonInput, { target: { value: "ab" } });
    expect(submitBtn).toBeDisabled();

    // Enter valid reason >= 3 chars
    fireEvent.change(reasonInput, { target: { value: "Emergency flash crash halt" } });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(
        "/admin/execution/kill-switch",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            enable: true,
            reason: "Emergency flash crash halt",
            expected_updated_at: "2026-08-24T12:06:35Z",
            confirmation_phrase: "HALT TRADING",
          }),
        })
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("renders live exchange pre-flight connectivity check for resume trading flow", async () => {
    (apiClient as any).mockResolvedValueOnce({
      exchange: "bybit",
      status: "online",
      latency_ms: 280.5,
      server_time: "1787658974",
      checked_at: new Date().toISOString(),
    });

    render(
      <AdminKillSwitchModal
        isOpen={true}
        onClose={vi.fn()}
        controlState={haltedControlState}
        targetEnable={false}
        onSuccess={vi.fn()}
      />
    );

    expect(screen.getByText("RESUME TRADING PIPELINE")).toBeDefined();
    expect(screen.getByText("Live Exchange Pre-flight Connectivity (Bybit)")).toBeDefined();

    await waitFor(() => {
      expect(screen.getByText("280.5 ms")).toBeDefined();
    });
  });

  it("handles 409 conflict error when state was modified by another session", async () => {
    (apiClient as any).mockResolvedValueOnce({
      exchange: "bybit",
      status: "online",
      latency_ms: 280.5,
      server_time: "1787658974",
      checked_at: new Date().toISOString(),
    });

    (apiClient as any).mockRejectedValueOnce(
      new Error("State conflict: kill switch was updated by another administrator")
    );

    render(
      <AdminKillSwitchModal
        isOpen={true}
        onClose={vi.fn()}
        controlState={haltedControlState}
        targetEnable={false}
        onSuccess={vi.fn()}
      />
    );

    const reasonInput = screen.getByPlaceholderText(/Explain the operational reason/i);
    fireEvent.change(reasonInput, { target: { value: "Resuming after review" } });

    const submitBtn = screen.getByRole("button", { name: /CONFIRM & RESUME TRADING/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Optimistic Lock Conflict (409)")).toBeDefined();
    });
  });
});
