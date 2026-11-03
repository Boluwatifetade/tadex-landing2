import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  FEATURE_FLAGS,
  isFeatureEnabled,
  getFeatureFlagForRoute,
  isRouteEnabled,
} from "@/lib/feature-flags";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { NumericValue } from "@/components/ui/NumericValue";

describe("Phase 1: Design Tokens, Feature Flags & UI Primitives", () => {
  it("keeps all unbuilt backend feature flags disabled by default and protects feature-gated routes", () => {
    expect(FEATURE_FLAGS.riskControl).toBe(false);
    expect(FEATURE_FLAGS.signalBuilder).toBe(false);
    expect(FEATURE_FLAGS.oauthLogin).toBe(false);
    expect(FEATURE_FLAGS.otpLogin).toBe(false);
    expect(FEATURE_FLAGS.manualPositionClose).toBe(false);
    expect(FEATURE_FLAGS.emergencyHalt).toBe(false);
    expect(FEATURE_FLAGS.revokeAllSessions).toBe(false);

    expect(isFeatureEnabled("riskControl")).toBe(false);
    expect(isFeatureEnabled("riskControl", { riskControl: true })).toBe(true);

    // Route-level feature flag protection
    expect(getFeatureFlagForRoute("/dashboard/automation")).toBe("riskControl");
    expect(getFeatureFlagForRoute("/dashboard/signal-builder")).toBe("signalBuilder");
    expect(getFeatureFlagForRoute("/dashboard/trading")).toBeNull();

    expect(isRouteEnabled("/dashboard/automation")).toBe(false);
    expect(isRouteEnabled("/dashboard/automation", { riskControl: true })).toBe(true);
    expect(isRouteEnabled("/dashboard/trading")).toBe(true);
  });

  it("renders Button with B4 semantic tokens, tactile active:scale-[0.98], and backward-compatible variants", () => {
    const { rerender } = render(<Button variant="default">Execute Signal</Button>);
    const btn = screen.getByRole("button", { name: "Execute Signal" });
    expect(btn.className).toContain("bg-brand-accent");
    expect(btn.className).toContain("active:scale-[0.98]");

    rerender(<Button variant="outline" size="sm">Refresh</Button>);
    expect(screen.getByRole("button", { name: "Refresh" }).className).toContain(
      "border-surface-elevated"
    );

    rerender(<Button variant="destructive" disabled>Revoke</Button>);
    expect(screen.getByRole("button", { name: "Revoke" })).toBeDisabled();
  });

  it("renders Card with B4 dark surface tokens and concentric rounded-2xl radius", () => {
    render(
      <Card data-testid="b4-card">
        <CardHeader>
          <CardTitle>Bybit Main Trades</CardTitle>
          <CardDescription>Trade-Only Non-Custodial Key</CardDescription>
        </CardHeader>
        <CardContent>Connected</CardContent>
        <CardFooter>Manage</CardFooter>
      </Card>
    );

    const card = screen.getByTestId("b4-card");
    expect(card.className).toContain("bg-surface-primary");
    expect(card.className).toContain("border-surface-elevated");
    expect(card.className).toContain("rounded-2xl");
  });

  it("renders StatusBadge variants with data-status attribute across all 6 data freshness states", () => {
    const { rerender } = render(
      <StatusBadge variant="fresh" data-testid="badge">
        Connected & Validated
      </StatusBadge>
    );
    const badge = screen.getByTestId("badge");
    expect(badge.getAttribute("data-status")).toBe("fresh");
    expect(badge.className).toContain("text-status-success");
    expect(screen.getByText("Connected & Validated")).toBeInTheDocument();

    rerender(
      <StatusBadge variant="degraded" data-testid="badge">
        Rate Limited (Cached)
      </StatusBadge>
    );
    expect(screen.getByTestId("badge").getAttribute("data-status")).toBe("degraded");
    expect(screen.getByTestId("badge").className).toContain("text-status-warning");

    rerender(
      <StatusBadge variant="disconnected" data-testid="badge">
        No API Key
      </StatusBadge>
    );
    expect(screen.getByTestId("badge").getAttribute("data-status")).toBe("disconnected");

    rerender(
      <StatusBadge variant="error" data-testid="badge">
        Credential Invalid
      </StatusBadge>
    );
    expect(screen.getByTestId("badge").getAttribute("data-status")).toBe("error");
    expect(screen.getByTestId("badge").className).toContain("text-status-danger");
  });

  it("renders NumericValue with font-mono tabular-nums, signed PnL coloring, and -0/Infinity protection", () => {
    const { rerender } = render(
      <NumericValue
        value={91.4}
        currency="$"
        signed
        size="lg"
        data-testid="num"
      />
    );
    const num = screen.getByTestId("num");
    expect(num.textContent).toBe("+$91.40");
    expect(num.className).toContain("font-mono");
    expect(num.className).toContain("tabular-nums");
    expect(num.className).toContain("text-status-success");

    rerender(
      <NumericValue
        value={-70.5}
        currency="$"
        signed
        size="lg"
        data-testid="num"
      />
    );
    expect(screen.getByTestId("num").textContent).toBe("-$70.50");
    expect(screen.getByTestId("num").className).toContain("text-status-danger");

    // Negative zero (-0) and sub-cent negative dust (-0.0001) must normalize to neutral $0.00
    rerender(
      <NumericValue value={-0} currency="$" signed data-testid="num" />
    );
    expect(screen.getByTestId("num").textContent).toBe("$0.00");
    expect(screen.getByTestId("num").className).toContain("text-content-secondary");

    rerender(
      <NumericValue value={-0.0001} currency="$" signed data-testid="num" />
    );
    expect(screen.getByTestId("num").textContent).toBe("$0.00");
    expect(screen.getByTestId("num").className).toContain("text-content-secondary");

    // Non-finite numbers (Infinity, NaN, null) must render fallback
    rerender(<NumericValue value={Infinity} currency="$" data-testid="num" />);
    expect(screen.getByTestId("num").textContent).toBe("—");

    rerender(<NumericValue value={null} data-testid="num" />);
    expect(screen.getByTestId("num").textContent).toBe("—");
  });
});
