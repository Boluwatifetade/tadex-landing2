import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminMonitoringControlsCard from "@/components/admin/AdminMonitoringControlsCard";
import AdminMonitoringModal from "@/components/admin/AdminMonitoringModal";
import { SystemControlState } from "@/types/admin";

vi.mock("@/lib/auth-store", () => ({
  useAuthStore: vi.fn(() => ({
    token: "mock-admin-token",
    user: { id: "123", email: "admin@tadexapp.com", role: "admin" },
  })),
  getAuthHeader: vi.fn(() => ({ Authorization: "Bearer mock-admin-token" })),
}));

describe("Phase Admin-4b: AdminMonitoringControls Tests", () => {
  const mockControls: Record<string, SystemControlState> = {
    monitoring_enabled: {
      control_type: "monitoring_enabled",
      effective_value: true,
      source: "database",
      is_db_override: true,
      db_row: {
        id: "2f9479d3-4422-4134-8c83-a4a7efe86649",
        control_type: "monitoring_enabled",
        is_enabled: true,
        reason: "Monitoring active — WebSocket position tracking enabled",
        created_at: "2026-08-24T12:06:35Z",
        updated_at: "2026-08-24T12:06:35Z",
      },
      description: "Position monitoring stream master switch.",
    },
    monitoring_actions_kill_switch: {
      control_type: "monitoring_actions_kill_switch",
      effective_value: false,
      source: "database",
      is_db_override: true,
      db_row: {
        id: "b8e8c8c8-5b9f-4657-9500-5a233c0463c5",
        control_type: "monitoring_actions_kill_switch",
        is_enabled: false,
        reason: "Automated actions active — software can execute automated SL/TP market closes",
        created_at: "2026-08-24T12:06:35Z",
        updated_at: "2026-08-24T12:06:35Z",
      },
      description: "Position monitoring automated actions kill switch.",
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders monitoring controls card with streaming and action kill switch status", () => {
    render(
      <AdminMonitoringControlsCard
        controls={mockControls}
        onMutationSuccess={vi.fn()}
      />
    );

    expect(screen.getByText("Position Monitoring & Automation Controls")).toBeDefined();
    expect(screen.getByText("WebSocket Position Streaming")).toBeDefined();
    expect(screen.getByText("STREAMING ACTIVE")).toBeDefined();
    expect(screen.getByText("Automated SL/TP Action Gating")).toBeDefined();
    expect(screen.getByText("AUTONOMOUS CLOSES ALLOWED")).toBeDefined();
  });

  it("enforces reason gating and sends optimistic lock payload on monitoring toggle", async () => {
    const onSuccess = vi.fn();
    render(
      <AdminMonitoringModal
        isOpen={true}
        onClose={vi.fn()}
        controlKey="monitoring_enabled"
        controlState={mockControls["monitoring_enabled"]}
        targetEnable={false}
        onSuccess={onSuccess}
      />
    );

    expect(screen.getByText("Disable Position Monitoring Stream")).toBeDefined();
    const submitBtn = screen.getByRole("button", { name: /Confirm Mutation/i });
    expect(submitBtn).toBeDisabled();

    const textarea = screen.getByPlaceholderText(/Explain why this monitoring control/i);
    fireEvent.change(textarea, { target: { value: "Pause streaming for upgrade" } });
    expect(submitBtn).not.toBeDisabled();

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        message: "Monitoring stream disabled",
        control: { ...mockControls["monitoring_enabled"], effective_value: false },
      }),
    });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/v1/admin/execution/monitoring",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            control: "monitoring_enabled",
            enable: false,
            reason: "Pause streaming for upgrade",
            expected_updated_at: "2026-08-24T12:06:35Z",
          }),
        })
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("handles 409 conflict when monitoring state was changed concurrently", async () => {
    render(
      <AdminMonitoringModal
        isOpen={true}
        onClose={vi.fn()}
        controlKey="monitoring_actions_kill_switch"
        controlState={mockControls["monitoring_actions_kill_switch"]}
        targetEnable={true}
        onSuccess={vi.fn()}
      />
    );

    const textarea = screen.getByPlaceholderText(/Explain why this monitoring control/i);
    fireEvent.change(textarea, { target: { value: "Block automated closes immediately" } });

    global.fetch = vi.fn().mockResolvedValueOnce({
      status: 409,
      ok: false,
      json: async () => ({
        detail: "State conflict: monitoring control modified concurrently",
      }),
    });

    fireEvent.click(screen.getByRole("button", { name: /Confirm Mutation/i }));

    await waitFor(() => {
      expect(screen.getByText("Optimistic Lock Conflict (409)")).toBeDefined();
    });
  });
});
