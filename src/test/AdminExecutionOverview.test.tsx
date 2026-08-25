import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AdminReadOnlyControlsGrid from "@/components/admin/AdminReadOnlyControlsGrid";
import AdminExecutionAuditFeed from "@/components/admin/AdminExecutionAuditFeed";
import AdminExecutionNav from "@/components/admin/AdminExecutionNav";
import { SystemControlState } from "@/types/admin";
import { apiClient } from "@/lib/api-client";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(() => "/admin/execution"),
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

vi.mock("@/lib/api-client", () => ({
  apiClient: vi.fn(),
}));

describe("Phase Admin-4b: Execution Overview & Read-Only Grid Tests", () => {
  const mockControls: Record<string, SystemControlState> = {
    kill_switch: {
      control_type: "kill_switch",
      effective_value: false,
      source: "database",
      is_db_override: true,
      description: "Global emergency stop.",
    },
    monitoring_enabled: {
      control_type: "monitoring_enabled",
      effective_value: true,
      source: "database",
      is_db_override: true,
      description: "Position monitoring stream switch.",
    },
    monitoring_actions_kill_switch: {
      control_type: "monitoring_actions_kill_switch",
      effective_value: false,
      source: "database",
      is_db_override: true,
      description: "Automated actions kill switch.",
    },
    monitoring_cohort: {
      control_type: "monitoring_cohort",
      effective_value: 100,
      source: "database",
      is_db_override: true,
      description: "Rollout cohort percentage.",
    },
    // The 6 live read-only controls:
    beta_mode: {
      control_type: "beta_mode",
      effective_value: true,
      source: "database",
      is_db_override: true,
      description: "General beta mode flag; used for UI indicators.",
    },
    allow_new_providers: {
      control_type: "allow_new_providers",
      effective_value: true,
      source: "database",
      is_db_override: true,
      description: "When FALSE, new provider applications are rejected at the gate.",
    },
    allow_new_subscribers: {
      control_type: "allow_new_subscribers",
      effective_value: true,
      source: "database",
      is_db_override: true,
      description: "When FALSE, new subscriber registrations are blocked at the gate.",
    },
    max_beta_providers: {
      control_type: "max_beta_providers",
      effective_value: true,
      source: "database",
      is_db_override: true,
      db_row: {
        id: "1",
        control_type: "max_beta_providers",
        is_enabled: true,
        created_at: "",
        updated_at: "",
        metadata: { max: 50 },
      },
      description: "Maximum number of active providers allowed during beta.",
    },
    max_beta_subscribers: {
      control_type: "max_beta_subscribers",
      effective_value: true,
      source: "database",
      is_db_override: true,
      db_row: {
        id: "2",
        control_type: "max_beta_subscribers",
        is_enabled: true,
        created_at: "",
        updated_at: "",
        metadata: { max: 200 },
      },
      description: "Maximum number of active subscribers allowed during beta.",
    },
    beta_whitelist_enabled: {
      control_type: "beta_whitelist_enabled",
      effective_value: false,
      source: "database",
      is_db_override: true,
      description: "When TRUE, onboarding users must be present in beta_whitelist table.",
    },
  };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders sub-navigation tabs for System Controls, Telemetry, and Reconciliation", () => {
    render(<AdminExecutionNav />);
    expect(screen.getByText("System Controls & Kill Switch")).toBeDefined();
    expect(screen.getByText("Pipeline Health & Telemetry")).toBeDefined();
    expect(screen.getByText("Position Reconciliation")).toBeDefined();
  });

  it("dynamically renders the 6 live read-only controls while filtering out operational controls", () => {
    render(<AdminReadOnlyControlsGrid controls={mockControls} />);

    // Renders the 6 live non-operational controls
    expect(screen.getByText("beta_mode")).toBeDefined();
    expect(screen.getByText("allow_new_providers")).toBeDefined();
    expect(screen.getByText("allow_new_subscribers")).toBeDefined();
    expect(screen.getByText("max_beta_providers")).toBeDefined();
    expect(screen.getByText("max_beta_subscribers")).toBeDefined();
    expect(screen.getByText("beta_whitelist_enabled")).toBeDefined();

    // Filters out operational keys from the read-only grid
    expect(screen.queryByText("kill_switch")).toBeNull();
    expect(screen.queryByText("monitoring_enabled")).toBeNull();
    expect(screen.queryByText("monitoring_actions_kill_switch")).toBeNull();
    expect(screen.queryByText("monitoring_cohort")).toBeNull();

    // Shows tracked count
    expect(screen.getByText("6 Parameters Tracked")).toBeDefined();
  });

  it("renders execution audit activity feed front-and-center", async () => {
    (apiClient as any).mockResolvedValueOnce({
      items: [
        {
          id: "audit-1",
          action_type: "kill_switch_toggle",
          target_entity_type: "system_control",
          target_entity_id: "kill_switch",
          reason: "Resumed trading after stabilization",
          admin_email: "tadex.team@gmail.com",
          created_at: new Date().toISOString(),
        },
      ],
    });

    render(<AdminExecutionAuditFeed />);

    await waitFor(() => {
      expect(screen.getByText("Recent System Control Mutations & Audit Trail")).toBeDefined();
      expect(screen.getByText("kill_switch_toggle")).toBeDefined();
      expect(screen.getByText(/Resumed trading after stabilization/i)).toBeDefined();
    });
  });
});
