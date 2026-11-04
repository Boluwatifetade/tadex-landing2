"use client";

import * as React from "react";
import {
  Activity,
  LineChart,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumericValue } from "@/components/ui/NumericValue";
import { cn } from "@/lib/utils";

export type KpiDataState = "loading" | "success" | "empty" | "error" | "unavailable";

export interface PortfolioKpiGridProps {
  positionsCount?: number | null;
  positionsStatus?: KpiDataState;
  netUnrealizedPnl?: number | null;
  pnlStatus?: KpiDataState;
  filledOrdersCount?: number | null;
  ordersStatus?: KpiDataState;
  isExchangeConnected?: boolean;
  isLoading?: boolean;
  className?: string;
}

export default function PortfolioKpiGrid({
  // Defaults are "unavailable" (never "empty") so an omitted status renders "—", not zero.
  positionsCount = null,
  positionsStatus = "unavailable",
  netUnrealizedPnl = null,
  pnlStatus = "unavailable",
  filledOrdersCount = null,
  ordersStatus = "unavailable",
  isExchangeConnected = true,
  isLoading = false,
  className,
}: PortfolioKpiGridProps) {
  if (isLoading) {
    return (
      <div
        data-testid="portfolio-kpi-grid-skeleton"
        className={cn(
          "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
          className
        )}
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-surface-elevated bg-surface-primary p-5 animate-pulse space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 rounded-md bg-surface-secondary" />
              <div className="h-4 w-4 rounded-md bg-surface-secondary" />
            </div>
            <div className="h-8 w-32 rounded-md bg-surface-secondary" />
            <div className="h-3 w-40 rounded-md bg-surface-secondary" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section
      aria-label="Portfolio Key Performance Indicators"
      data-testid="portfolio-kpi-grid"
      className={cn(
        "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        className
      )}
    >
      {/* KPI 1: Active Positions */}
      <Card className="relative overflow-hidden bg-surface-primary border-surface-elevated hover:border-surface-subtle transition-colors">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="caption-3 font-medium uppercase tracking-wider text-text-muted">
              Active Positions
            </span>
            <LineChart className="h-4 w-4 text-brand-accent" />
          </div>
          <CardTitle className="pt-1">
            {!isExchangeConnected ? (
              <span className="text-xl font-bold font-mono text-text-muted">
                0
              </span>
            ) : positionsStatus === "error" ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold font-mono text-text-muted">
                  —
                </span>
                <span className="rounded-full border border-status-warning/30 bg-status-warning/10 px-2 py-0.5 text-[11px] font-medium text-status-warning">
                  Unavailable
                </span>
              </div>
            ) : positionsStatus === "empty" || positionsCount === 0 ? (
              <span
                data-testid="kpi-active-positions"
                className="text-2xl font-bold font-mono text-text-muted tabular-nums tracking-tight"
              >
                0
                <span className="text-xs font-normal text-text-muted ml-1.5">
                  Open
                </span>
              </span>
            ) : positionsCount !== null ? (
              <span
                data-testid="kpi-active-positions"
                className="text-2xl font-bold font-mono text-text-primary tabular-nums tracking-tight"
              >
                {positionsCount}
                <span className="text-xs font-normal text-text-muted ml-1.5">
                  Open
                </span>
              </span>
            ) : (
              <span className="text-2xl font-bold font-mono text-text-muted">
                —
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="caption-4 text-text-muted">
            {!isExchangeConnected
              ? "Connect Bybit API key to trade"
              : positionsStatus === "error"
              ? "Position feed query failed"
              : positionsStatus === "empty" || positionsCount === 0
              ? "Zero open market exposure"
              : "Live positions managed on Bybit"}
          </p>
        </CardContent>
      </Card>

      {/* KPI 2: Net Unrealized PnL */}
      <Card className="relative overflow-hidden bg-surface-primary border-surface-elevated hover:border-surface-subtle transition-colors">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="caption-3 font-medium uppercase tracking-wider text-text-muted">
              Net Unrealized PnL
            </span>
            <TrendingUp className="h-4 w-4 text-brand-accent" />
          </div>
          <CardTitle className="pt-1">
            {!isExchangeConnected ? (
              <span className="text-xl font-bold font-mono text-text-muted">
                —
              </span>
            ) : pnlStatus === "error" || netUnrealizedPnl === null ? (
              <span
                data-testid="kpi-unrealized-pnl"
                className="text-2xl font-bold font-mono text-text-muted"
              >
                —
              </span>
            ) : pnlStatus === "empty" && netUnrealizedPnl === 0 ? (
              <NumericValue
                data-testid="kpi-unrealized-pnl"
                value={0}
                currency="$"
                signed={false}
                size="lg"
              />
            ) : (
              <NumericValue
                data-testid="kpi-unrealized-pnl"
                value={netUnrealizedPnl}
                currency="$"
                signed={true}
                size="lg"
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="caption-4 text-text-muted">
            {!isExchangeConnected
              ? "Awaiting key connection"
              : pnlStatus === "error" || netUnrealizedPnl === null
              ? "PnL telemetry unavailable"
              : pnlStatus === "empty" || (positionsCount === 0 && netUnrealizedPnl === 0)
              ? "Zero floating risk (no positions)"
              : "Aggregated open position PnL"}
          </p>
        </CardContent>
      </Card>

      {/* KPI 3: Available Margin / Equity (Honest Unavailable State) */}
      <Card className="relative overflow-hidden bg-surface-primary border-surface-elevated hover:border-surface-subtle transition-colors">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="caption-3 font-medium uppercase tracking-wider text-text-muted">
              Exchange Balance
            </span>
            <Wallet className="h-4 w-4 text-text-muted" />
          </div>
          <CardTitle className="pt-1">
            {!isExchangeConnected ? (
              <span className="text-xl font-bold font-mono text-text-muted">
                Not Connected
              </span>
            ) : (
              <div
                data-testid="kpi-exchange-balance"
                className="flex items-center gap-2"
              >
                <span className="text-2xl font-bold font-mono text-text-muted tracking-tight">
                  —
                </span>
                <span
                  title="Exchange balance feed is unavailable in the current API version."
                  className="rounded-full border border-surface-elevated bg-surface-secondary px-2 py-0.5 text-[11px] font-medium text-text-muted"
                >
                  Unavailable
                </span>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="caption-4 text-text-muted">
            {!isExchangeConnected
              ? "Key required for account telemetry"
              : "Feed not exposed in current API contract"}
          </p>
        </CardContent>
      </Card>

      {/* KPI 4: Order Fills (Renamed from Execution Activity) */}
      <Card className="relative overflow-hidden bg-surface-primary border-surface-elevated hover:border-surface-subtle transition-colors">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <span className="caption-3 font-medium uppercase tracking-wider text-text-muted">
              Order Fills
            </span>
            <Activity className="h-4 w-4 text-brand-accent" />
          </div>
          <CardTitle className="pt-1">
            {!isExchangeConnected ? (
              <span className="text-xl font-bold font-mono text-text-muted">
                —
              </span>
            ) : ordersStatus === "error" || filledOrdersCount === null ? (
              <span
                data-testid="kpi-recent-fills"
                className="text-2xl font-bold font-mono text-text-muted"
              >
                —
              </span>
            ) : (
              <span
                data-testid="kpi-recent-fills"
                className="text-2xl font-bold font-mono text-text-primary tabular-nums tracking-tight"
              >
                {filledOrdersCount}
                <span className="text-xs font-normal text-text-muted ml-1.5">
                  Fills
                </span>
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="caption-4 text-text-muted">
            {!isExchangeConnected
              ? "Awaiting key connection"
              : ordersStatus === "error" || filledOrdersCount === null
              ? "Orders telemetry unavailable"
              : "Cumulative filled orders in trade history"}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
