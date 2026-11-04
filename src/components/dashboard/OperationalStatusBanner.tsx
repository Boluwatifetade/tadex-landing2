"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, KeyRound, Radio, ShieldAlert } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type OperationalMode =
  | "optimal"
  | "degraded"
  | "disconnected"
  | "maintenance";

export interface OperationalStatusBannerProps {
  mode: OperationalMode;
  exchangeName?: string | null;
  networkName?: "Mainnet" | "Testnet" | null;
  providerName?: string | null;
  subscriptionTier?: string | null;
  /**
   * Independent positions-feed health. Deliberately separate from `mode`
   * (exchange communication health) so one signal never masks the other.
   */
  positionsFeedStatus?: "loading" | "success" | "empty" | "error" | "unavailable";
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
}

const modeConfig: Record<
  OperationalMode,
  {
    badgeVariant: "fresh" | "degraded" | "disconnected" | "danger";
    label: string;
    description: string;
    borderClass: string;
    accentGlow: string;
  }
> = {
  optimal: {
    badgeVariant: "fresh",
    label: "Exchange Connected",
    description:
      "Recent authenticated exchange API communication verified within 15 minutes.",
    borderClass: "border-status-success/30",
    accentGlow: "bg-status-success/5",
  },
  degraded: {
    badgeVariant: "degraded",
    label: "Connection Idle",
    description:
      "No authenticated exchange communication recorded in the last 15 minutes.",
    borderClass: "border-status-warning/30",
    accentGlow: "bg-status-warning/5",
  },
  disconnected: {
    badgeVariant: "disconnected",
    label: "Exchange Disconnected",
    description:
      "No active exchange API key connected. Connect a trade-only Bybit key to configure exchange communication.",
    borderClass: "border-surface-elevated",
    accentGlow: "bg-surface-subtle/40",
  },
  maintenance: {
    badgeVariant: "danger",
    label: "Platform Maintenance",
    description:
      "Explicit scheduled maintenance signal returned by API. Trade executions temporarily halted upstream.",
    borderClass: "border-status-danger/30",
    accentGlow: "bg-status-danger/5",
  },
};

export default function OperationalStatusBanner({
  mode,
  exchangeName,
  networkName,
  providerName,
  subscriptionTier,
  positionsFeedStatus = "unavailable",
  isLoading = false,
  className,
}: OperationalStatusBannerProps) {
  if (isLoading) {
    return (
      <div
        data-testid="operational-banner-skeleton"
        className={cn(
          "rounded-2xl border border-surface-elevated bg-surface-primary p-5 sm:p-6 animate-pulse space-y-4",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="h-6 w-36 rounded-full bg-surface-secondary" />
          <div className="h-4 w-48 rounded-md bg-surface-secondary" />
        </div>
        <div className="h-4 w-3/4 rounded-md bg-surface-secondary" />
        <div className="pt-2 border-t border-surface-elevated flex gap-3">
          <div className="h-6 w-28 rounded-md bg-surface-secondary" />
          <div className="h-6 w-28 rounded-md bg-surface-secondary" />
        </div>
      </div>
    );
  }

  const config = modeConfig[mode];
  const formattedExchange = exchangeName
    ? `${exchangeName.toUpperCase()} ${networkName || "Mainnet"}`
    : "Not Connected";

  // Positions feed is only meaningful with a configured key outside maintenance.
  const feedApplicable = mode !== "disconnected" && mode !== "maintenance";
  const feedState: "ok" | "error" | "standby" = !feedApplicable
    ? "standby"
    : positionsFeedStatus === "success" || positionsFeedStatus === "empty"
    ? "ok"
    : positionsFeedStatus === "error"
    ? "error"
    : "standby";
  const feedLabel =
    feedState === "ok"
      ? "POSITIONS FEED OK"
      : feedState === "error"
      ? "POSITIONS FEED UNAVAILABLE"
      : "POSITIONS FEED STANDBY";

  return (
    <div
      data-testid="operational-status-banner"
      data-mode={mode}
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-surface-primary p-5 sm:p-6 transition-all duration-200",
        config.borderClass,
        config.accentGlow,
        className
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Mode Badge & Description */}
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-3">
            <StatusBadge
              variant={config.badgeVariant}
              data-testid="operational-mode-badge"
              size="default"
              pulse={mode === "optimal"}
            >
              {config.label}
            </StatusBadge>
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
              PLATFORM STATUS
            </span>
          </div>

          <p className="body-sm text-text-secondary leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* Right: Key Telemetry Summary or Action Trigger */}
        <div className="flex flex-wrap items-center gap-3 pt-2 lg:pt-0">
          {mode === "disconnected" && (
            <Link href="/dashboard/keys">
              <Button
                variant="default"
                size="sm"
                className="gap-2 shadow-xs"
                data-testid="banner-connect-key-btn"
              >
                <KeyRound className="h-4 w-4" />
                <span>Connect Key</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}

          {mode === "maintenance" && (
            <div className="inline-flex items-center gap-2 rounded-xl border border-status-danger/30 bg-status-danger/10 px-3.5 py-2 text-xs font-medium text-status-danger">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>Maintenance Mode Active</span>
            </div>
          )}

          {mode !== "disconnected" && mode !== "maintenance" && (
            <Link href="/dashboard/trading">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                data-testid="banner-trading-btn"
              >
                <span>Trading Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Bottom Telemetry Strip */}
      <div className="mt-4 pt-3.5 border-t border-surface-elevated/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="text-text-tertiary">Exchange:</span>
          <span
            data-testid="banner-exchange-telemetry"
            className="font-medium text-text-primary"
          >
            {formattedExchange}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-text-tertiary">Provider:</span>
          <span
            data-testid="banner-provider-telemetry"
            className="font-medium text-text-primary"
          >
            {providerName || "None Configured"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-text-tertiary">Subscription:</span>
          <span
            data-testid="banner-subscription-telemetry"
            className="font-medium text-text-primary capitalize"
          >
            {subscriptionTier || "Free"}
          </span>
        </div>

        <div
          className="flex items-center gap-1.5 ml-auto"
          data-testid="banner-positions-feed"
          data-feed-state={feedState}
        >
          <Radio
            className={cn(
              "h-3 w-3",
              feedState === "ok"
                ? "text-status-success"
                : feedState === "error"
                ? "text-status-warning"
                : "text-text-tertiary"
            )}
          />
          <span
            className={cn(
              "font-mono text-[11px] uppercase",
              feedState === "error" ? "text-status-warning" : "text-text-tertiary"
            )}
          >
            {feedLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
