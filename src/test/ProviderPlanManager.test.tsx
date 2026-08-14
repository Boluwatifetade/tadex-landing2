import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProviderPlanManager from "@/components/dashboard/provider/ProviderPlanManager";
import * as apiClientModule from "@/lib/api-client";
import { ProviderPlanOut } from "@/types/provider";

const mockPlans: ProviderPlanOut[] = [
  {
    id: "plan-1",
    provider_id: "prov-101",
    name: "Starter Alpha",
    monthly_price_cents: 500000,
    currency: "NGN",
    max_duration_days: 30,
    description: "Daily crypto signals",
    is_active: true,
    status: "active",
  },
  {
    id: "plan-2",
    provider_id: "prov-101",
    name: "VIP Scalper",
    monthly_price_cents: 1000000,
    currency: "NGN",
    max_duration_days: 30,
    description: "High frequency scalps",
    is_active: true,
    status: "active",
  },
];

describe("ProviderPlanManager", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders existing plans with pricing and status badges", async () => {
    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(mockPlans);

    render(<ProviderPlanManager providerId="prov-101" isSuspended={false} />);

    expect(await screen.findByText("Starter Alpha")).toBeInTheDocument();
    expect(screen.getByText("VIP Scalper")).toBeInTheDocument();
    expect(screen.getByText("NGN 5,000")).toBeInTheDocument();
    expect(screen.getByText("NGN 10,000")).toBeInTheDocument();
    expect(screen.getByText("Active: 2/3")).toBeInTheDocument();
  });

  it("disables Create Plan button when 3 active plans limit is reached", async () => {
    const threeActivePlans: ProviderPlanOut[] = [
      ...mockPlans,
      {
        id: "plan-3",
        provider_id: "prov-101",
        name: "Elite VIP",
        monthly_price_cents: 2000000,
        currency: "NGN",
        max_duration_days: 30,
        description: "All access",
        is_active: true,
        status: "active",
      },
    ];

    vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce(threeActivePlans);

    render(<ProviderPlanManager providerId="prov-101" isSuspended={false} />);

    expect(await screen.findByText("Elite VIP")).toBeInTheDocument();
    expect(screen.getByText("Active: 3/3")).toBeInTheDocument();

    const createBtn = screen.getByRole("button", { name: /create plan/i });
    expect(createBtn).toBeDisabled();
    expect(
      screen.getByText(/3 active plans limit reached/i)
    ).toBeInTheDocument();
  });

  it("opens create plan modal, prevents duplicate plan names, and submits to POST /provider/plans", async () => {
    const user = userEvent.setup();
    const createdPlan: ProviderPlanOut = {
      id: "plan-new",
      provider_id: "prov-101",
      name: "New Unique Plan",
      monthly_price_cents: 750000,
      currency: "NGN",
      max_duration_days: 30,
      description: "Unique signals",
      is_active: true,
      status: "active",
    };

    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path, options) => {
      if (path === "/provider/plans" && (!options || !options.method || options.method === "GET")) {
        return mockPlans;
      }
      if (path === "/provider/plans" && options?.method === "POST") {
        return createdPlan;
      }
      return [];
    });

    render(<ProviderPlanManager providerId="prov-101" isSuspended={false} />);

    await screen.findByText("Starter Alpha");

    // Open modal
    const createBtn = screen.getByRole("button", { name: /create plan/i });
    await user.click(createBtn);

    expect(screen.getByText("Create New Subscription Plan")).toBeInTheDocument();

    // Type duplicate name "Starter Alpha"
    const nameInput = screen.getByPlaceholderText("e.g. VIP Futures Signals");
    await user.type(nameInput, "Starter Alpha");

    // Should show duplicate warning
    expect(
      screen.getByText("⚠️ A plan with this name already exists.")
    ).toBeInTheDocument();

    // Change to unique name
    await user.clear(nameInput);
    await user.type(nameInput, "New Unique Plan");

    // Enter Price
    const priceInput = screen.getByPlaceholderText("e.g. 5000");
    await user.clear(priceInput);
    await user.type(priceInput, "7500");

    // Submit modal
    const modal = screen.getByRole("dialog");
    const submitBtn = modal.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(submitBtn).toBeInTheDocument();
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("New Unique Plan")).toBeInTheDocument();
    });
  });

  it("requires confirmation before deactivating plan and fires DELETE /provider/plans/{id}", async () => {
    const user = userEvent.setup();

    const deleteSpy = vi
      .spyOn(apiClientModule, "apiClient")
      .mockImplementation(async (path, options) => {
        if (path === "/provider/plans" && (!options || !options.method || options.method === "GET")) {
          return mockPlans;
        }
        if (path.startsWith("/provider/plans/") && options?.method === "DELETE") {
          return { message: "Plan archived successfully.", plan_id: "plan-1", status: "archived" };
        }
        return [];
      });

    render(<ProviderPlanManager providerId="prov-101" isSuspended={false} />);

    await screen.findByText("Starter Alpha");

    // Click Deactivate on first plan
    const deactivateBtns = screen.getAllByRole("button", { name: /deactivate/i });
    await user.click(deactivateBtns[0]);

    // Confirmation dialog appears
    expect(screen.getByText("Deactivate Subscription Plan?")).toBeInTheDocument();
    expect(
      screen.getByText(/deactivating will archive this plan and hide it from the public catalog/i)
    ).toBeInTheDocument();

    // Click Confirm Deactivation
    const confirmBtn = screen.getByRole("button", { name: /confirm deactivation/i });
    await user.click(confirmBtn);

    await waitFor(() => {
      expect(deleteSpy).toHaveBeenCalledWith("/provider/plans/plan-1", {
        method: "DELETE",
      });
      expect(screen.getByText("Archived (Locked)")).toBeInTheDocument();
    });
  });
});
