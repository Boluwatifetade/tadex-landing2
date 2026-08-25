import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminCohortControlCard from "@/components/admin/AdminCohortControlCard";
import AdminCohortModal from "@/components/admin/AdminCohortModal";
import { SystemControlState, ExecutionCohortResponse } from "@/types/admin";
import { apiClient } from "@/lib/api-client";

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

describe("Phase Admin-4b: AdminCohortControl Tests", () => {
  const mockControlState: SystemControlState = {
    control_type: "monitoring_cohort",
    effective_value: 75,
    source: "database",
    is_db_override: true,
    db_row: {
      id: "10b18494-2dc2-434e-a8cc-27296a2fa335",
      control_type: "monitoring_cohort",
      is_enabled: true,
      reason: "75% rollout cohort active",
      metadata: { cohort_percent: 75 },
      created_at: "2026-08-24T12:06:35Z",
      updated_at: "2026-08-24T12:06:35Z",
    },
    description: "Position monitoring user rollout percentage (0-100%).",
  };

  const mockTelemetry: ExecutionCohortResponse = {
    cohort_percent: 75,
    source: "database",
    is_db_override: true,
    total_users: 100,
    users_in_cohort: 75,
    users_excluded: 25,
    enabled_environments: ["mainnet", "testnet"],
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders cohort card with real user counts and progress gauge", () => {
    render(
      <AdminCohortControlCard
        controlState={mockControlState}
        cohortTelemetry={mockTelemetry}
        onMutationSuccess={vi.fn()}
      />
    );

    expect(screen.getByText("Position Monitoring Rollout Cohort")).toBeDefined();
    expect(screen.getByText("75% of accounts")).toBeDefined();
    expect(screen.getByText("75")).toBeDefined(); // in-cohort
    expect(screen.getByText("25")).toBeDefined(); // excluded
    expect(screen.getByText("100")).toBeDefined(); // total users
    expect(screen.getByText("Adjust Rollout Cohort")).toBeDefined();
  });

  it("allows setting percentage and enforces reason validation", async () => {
    const onSuccess = vi.fn();
    (apiClient as any).mockResolvedValueOnce({
      success: true,
      message: "Cohort updated to 50%",
      control: { ...mockControlState, effective_value: 50 },
    });

    render(
      <AdminCohortModal
        isOpen={true}
        onClose={vi.fn()}
        controlState={mockControlState}
        cohortTelemetry={mockTelemetry}
        onSuccess={onSuccess}
      />
    );

    expect(screen.getByText("Adjust Position Monitoring Rollout Cohort")).toBeDefined();
    const submitBtn = screen.getByRole("button", { name: /Apply Cohort Rollout/i });
    expect(submitBtn).toBeDisabled();

    // Select preset 50%
    fireEvent.click(screen.getByRole("button", { name: "50%" }));
    expect(screen.getAllByText("50%").length).toBeGreaterThan(0);

    // Enter reason
    const textarea = screen.getByPlaceholderText(/Explain the operational rationale/i);
    fireEvent.change(textarea, { target: { value: "Scale rollout to 50% accounts" } });
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(apiClient).toHaveBeenCalledWith(
        "/admin/execution/cohort",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            percent: 50,
            reason: "Scale rollout to 50% accounts",
            expected_updated_at: "2026-08-24T12:06:35Z",
          }),
        })
      );
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("handles 409 conflict when cohort state was modified concurrently", async () => {
    (apiClient as any).mockRejectedValueOnce(
      new Error("State conflict: cohort changed concurrently")
    );

    render(
      <AdminCohortModal
        isOpen={true}
        onClose={vi.fn()}
        controlState={mockControlState}
        cohortTelemetry={mockTelemetry}
        onSuccess={vi.fn()}
      />
    );

    const textarea = screen.getByPlaceholderText(/Explain the operational rationale/i);
    fireEvent.change(textarea, { target: { value: "Scale cohort to 100%" } });

    fireEvent.click(screen.getByRole("button", { name: /Apply Cohort Rollout/i }));

    await waitFor(() => {
      expect(screen.getByText("Optimistic Lock Conflict (409)")).toBeDefined();
    });
  });
});
