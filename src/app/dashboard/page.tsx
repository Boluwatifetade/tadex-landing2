"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { NumericValue } from "@/components/ui/NumericValue";
import OperationalStatusBanner, { OperationalMode } from "@/components/dashboard/OperationalStatusBanner";
import PortfolioKpiGrid, { KpiDataState } from "@/components/dashboard/PortfolioKpiGrid";
import ExecutionReadinessChecklist from "@/components/dashboard/ExecutionReadinessChecklist";
import { DEFAULT_COMMUNICATION_THRESHOLD_MS } from "@/lib/exchange-status";
import {
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Loader2,
  LineChart,
} from "lucide-react";

interface UserMeResponse {
  id?: string;
  email?: string;
  role?: string;
  status?: string;
  email_verified?: boolean;
  telegram_linked?: boolean;
  telegram_username?: string | null;
  created_at?: string;
}

interface KeyResponse {
  id: string;
  exchange: string;
  api_key_masked: string;
  is_testnet: boolean;
  status: string; // "active" | "inactive" | "invalid" | "revoked" | "suspended" | "error"
  created_at?: string;
  last_used_at?: string | null;
}

interface SubscriptionOut {
  id: string;
  tier?: string | null;
  status: string;
  is_active: boolean;
  current_period_end?: string | null;
  provider_id?: string | null;
}

interface UserSubscriptionResponse {
  has_active_subscription: boolean;
  subscription?: SubscriptionOut | null;
  notifications: string[];
}

interface PositionOut {
  id: string;
  symbol: string;
  side: string;
  size: number;
  entry_price?: number | null;
  unrealized_pnl?: number | null;
  leverage?: number | null;
  stop_loss?: number | null;
  take_profit?: number | null;
}

interface OrderOut {
  id: string;
  symbol: string;
  side: string;
  status: string;
  size: number;
  price?: number | null;
  timestamp?: string;
}

interface ProviderOut {
  id: string;
  name: string;
  is_verified: boolean;
  win_rate?: number | null;
  total_signals_sent?: number;
  subscriber_count?: number;
}

export default function DashboardOverviewPage() {
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [keys, setKeys] = useState<KeyResponse[]>([]);
  const [subData, setSubData] = useState<UserSubscriptionResponse | null>(null);
  const [positions, setPositions] = useState<PositionOut[]>([]);
  const [orders, setOrders] = useState<OrderOut[]>([]);
  const [providers, setProviders] = useState<ProviderOut[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isMaintenance, setIsMaintenance] = useState(false);

  // Explicit query states to prevent silent conversion of errors into zero
  const [positionsState, setPositionsState] = useState<KpiDataState>("loading");
  const [ordersState, setOrdersState] = useState<KpiDataState>("loading");

  const fetchDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMsg(null);
    setIsMaintenance(false);

    try {
      const [userRes, keysRes, subRes, posRes, ordRes, provRes] =
        await Promise.allSettled([
          apiClient<UserMeResponse>("/me"),
          apiClient<KeyResponse[]>("/keys"),
          apiClient<UserSubscriptionResponse>("/billing/subscription"),
          apiClient<PositionOut[]>("/trading/positions"),
          apiClient<OrderOut[]>("/trading/orders"),
          apiClient<ProviderOut[]>("/providers"),
        ]);

      // Process User
      if (userRes.status === "fulfilled" && userRes.value) {
        setUser(userRes.value);
      }

      // Process Keys
      if (keysRes.status === "fulfilled" && Array.isArray(keysRes.value)) {
        setKeys(keysRes.value);
      } else {
        setKeys([]);
      }

      // Process Subscription
      if (subRes.status === "fulfilled" && subRes.value) {
        setSubData(subRes.value);
      }

      // Process Positions - distinguish empty from error.
      // A rejected request or a non-array (malformed) payload is an error, never an empty list.
      if (posRes.status === "fulfilled" && Array.isArray(posRes.value)) {
        setPositions(posRes.value);
        setPositionsState(posRes.value.length === 0 ? "empty" : "success");
      } else {
        setPositions([]);
        setPositionsState("error");
      }

      // Process Orders - distinguish empty from error (same rule as positions).
      if (ordRes.status === "fulfilled" && Array.isArray(ordRes.value)) {
        setOrders(ordRes.value);
        setOrdersState(ordRes.value.length === 0 ? "empty" : "success");
      } else {
        setOrders([]);
        setOrdersState("error");
      }

      // Process Providers
      if (provRes.status === "fulfilled" && Array.isArray(provRes.value)) {
        setProviders(provRes.value);
      }

      // Check for authoritative maintenance signal.
      // Must explicitly identify a maintenance state; a generic 503 or network failure is not maintenance.
      const allSettledResults = [userRes, keysRes, subRes, posRes, ordRes, provRes];
      const maintenanceDetected = allSettledResults.some((r) => {
        if (r.status !== "rejected") return false;
        const reason = r.reason as { status?: number; statusCode?: number; message?: string; detail?: string } | undefined;
        const detailStr = String(reason?.detail || reason?.message || "").toLowerCase();
        const statusCode = reason?.status || reason?.statusCode;
        return (
          statusCode === 503 &&
          detailStr.includes("maintenance")
        );
      });

      if (maintenanceDetected) {
        setIsMaintenance(true);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load dashboard data";
      setErrorMsg(msg);
      // Only set maintenance if the error explicitly declares maintenance
      if (msg.toLowerCase().includes("maintenance") && msg.includes("503")) {
        setIsMaintenance(true);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Derive active exchange key
  const activeKey = useMemo(() => {
    return keys.find((k) => k.status === "active") || null;
  }, [keys]);

  const isExchangeConnected = !!activeKey;

  // Authoritative operational mode derivation.
  // This reflects exchange communication health ONLY (active key + last_used_at recency).
  // Positions-feed health is an independent signal (positionsState) surfaced separately,
  // so a failed positions query never demotes verified exchange communication.
  const operationalMode: OperationalMode = useMemo(() => {
    if (isMaintenance) {
      return "maintenance";
    }

    if (!isExchangeConnected || !activeKey) {
      return "disconnected";
    }

    // Check communication recency: last_used_at must exist and be <= 15m old
    const lastUsedTime = activeKey.last_used_at
      ? new Date(activeKey.last_used_at).getTime()
      : null;
    const isCommunicationRecent =
      lastUsedTime !== null &&
      !isNaN(lastUsedTime) &&
      Date.now() - lastUsedTime <= DEFAULT_COMMUNICATION_THRESHOLD_MS;

    if (!isCommunicationRecent) {
      return "degraded";
    }

    return "optimal";
  }, [isMaintenance, isExchangeConnected, activeKey]);

  // Positions count - strictly null when errored or not connected
  const positionsCount = useMemo(() => {
    if (!isExchangeConnected) return null;
    if (positionsState === "error") return null;
    if (positionsState === "empty") return 0;
    return positions.length;
  }, [isExchangeConnected, positionsState, positions]);

  // Aggregate PnL with non-finite and malformed value validation
  const { netUnrealizedPnl, pnlState } = useMemo(() => {
    if (!isExchangeConnected) {
      return { netUnrealizedPnl: null, pnlState: "empty" as KpiDataState };
    }
    if (positionsState === "loading") {
      return { netUnrealizedPnl: null, pnlState: "loading" as KpiDataState };
    }
    if (positionsState === "error") {
      // Do not convert failed data into zero!
      return { netUnrealizedPnl: null, pnlState: "error" as KpiDataState };
    }
    if (positionsState === "empty" || positions.length === 0) {
      // Zero positions genuinely means 0 floating risk
      return { netUnrealizedPnl: 0, pnlState: "empty" as KpiDataState };
    }

    let hasMalformedValue = false;
    let sum = 0;
    for (const p of positions) {
      const val = p.unrealized_pnl;
      if (typeof val === "number" && Number.isFinite(val)) {
        sum += val;
      } else {
        hasMalformedValue = true;
      }
    }

    if (hasMalformedValue) {
      // Malformed value must not silently produce misleading total
      return { netUnrealizedPnl: null, pnlState: "error" as KpiDataState };
    }

    return { netUnrealizedPnl: sum, pnlState: "success" as KpiDataState };
  }, [isExchangeConnected, positionsState, positions]);

  // Filled orders count
  const filledOrdersCount = useMemo(() => {
    if (!isExchangeConnected || ordersState === "error") return null;
    if (ordersState === "empty" || orders.length === 0) return 0;
    const filled = orders.filter((o) => o.status?.toLowerCase() === "filled");
    return filled.length;
  }, [isExchangeConnected, ordersState, orders]);

  // Active provider
  const activeProvider = useMemo(() => {
    if (!subData?.subscription?.provider_id) return null;
    return (
      providers.find((p) => p.id === subData.subscription?.provider_id)?.name ||
      null
    );
  }, [subData, providers]);

  if (isLoading) {
    return (
      <div
        data-testid="dashboard-loading-state"
        className="flex flex-col items-center justify-center py-28 space-y-4 text-text-muted"
      >
        <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        <p className="body-sm font-medium text-text-secondary">
          Synchronizing operational status & trading telemetry...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="dashboard-overview-page">
      {/* Overview Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="h2 text-text-primary tracking-tight">
            Overview & Readiness
          </h1>
          <p className="body-sm text-text-muted mt-1">
            Non-custodial trading automation and account connectivity status.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchDashboardData(true)}
          disabled={isRefreshing}
          className="gap-2 self-start sm:self-auto"
          data-testid="dashboard-refresh-btn"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span>Refresh Status</span>
        </Button>
      </div>

      {/* Global Error Banner */}
      {errorMsg && (
        <div
          data-testid="dashboard-error-banner"
          className="rounded-2xl border border-status-danger/30 bg-status-danger/10 p-4 text-sm text-status-danger flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDashboardData()}
          >
            Retry
          </Button>
        </div>
      )}

      {/* Subscription Notifications Banner (if any) */}
      {subData?.notifications && subData.notifications.length > 0 && (
        <div className="space-y-2" data-testid="subscription-notifications">
          {subData.notifications.map((notif, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-status-warning/30 bg-status-warning/10 p-4 text-sm text-status-warning flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{notif}</span>
            </div>
          ))}
        </div>
      )}

      {/* 1. Operational Status Banner */}
      <OperationalStatusBanner
        mode={operationalMode}
        exchangeName={activeKey?.exchange}
        networkName={activeKey?.is_testnet ? "Testnet" : "Mainnet"}
        providerName={activeProvider}
        subscriptionTier={subData?.subscription?.tier}
        positionsFeedStatus={positionsState}
        onRefresh={() => fetchDashboardData(true)}
      />

      {/* 2. Portfolio KPI Grid */}
      <PortfolioKpiGrid
        positionsCount={positionsCount}
        positionsStatus={positionsState}
        netUnrealizedPnl={netUnrealizedPnl}
        pnlStatus={pnlState}
        filledOrdersCount={filledOrdersCount}
        ordersStatus={ordersState}
        isExchangeConnected={isExchangeConnected}
      />

      {/* 3. Account Setup Checklist (4 Authoritative Prerequisites) */}
      <ExecutionReadinessChecklist
        emailVerified={!!user?.email_verified}
        userEmail={user?.email}
        exchangeConnected={isExchangeConnected}
        activeKeyMasked={activeKey?.api_key_masked}
        activeExchange={activeKey?.exchange}
        telegramLinked={!!user?.telegram_linked}
        telegramUsername={user?.telegram_username}
        subscriptionActive={!!subData?.has_active_subscription}
        subscriptionTier={subData?.subscription?.tier}
      />

      {/* 4. Active Positions Table */}
      <Card className="bg-surface-primary border-surface-elevated shadow-xs overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-text-primary flex items-center gap-2">
                <LineChart className="h-4 w-4 text-brand-accent" />
                <span>Active Exchange Positions</span>
              </CardTitle>
              <CardDescription className="text-text-muted mt-0.5">
                Live positions synchronized with your connected Bybit account.
              </CardDescription>
            </div>
            <Link href="/dashboard/trading">
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <span>View All in Trading</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {positionsState === "error" ? (
            <div
              data-testid="positions-error-state"
              className="rounded-xl border border-status-warning/30 bg-status-warning/5 p-8 text-center text-text-muted space-y-1"
            >
              <p className="font-semibold text-text-primary text-sm">
                Positions feed unavailable
              </p>
              <p className="text-xs text-text-muted">
                Unable to retrieve open positions from exchange at this time.
              </p>
            </div>
          ) : positions.length === 0 ? (
            <div
              data-testid="positions-empty-state"
              className="rounded-xl border border-dashed border-surface-elevated p-8 text-center text-text-muted space-y-1 bg-surface-canvas/50"
            >
              <p className="font-semibold text-text-primary text-sm">
                No active positions
              </p>
              <p className="text-xs text-text-muted">
                Positions opened by signal automations will appear here and in
                Live Trading.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                data-testid="positions-table"
                className="w-full text-left text-sm"
              >
                <thead>
                  <tr className="border-b border-surface-elevated text-xs font-medium text-text-muted">
                    <th className="pb-3 pl-2">Symbol</th>
                    <th className="pb-3">Side</th>
                    <th className="pb-3">Size</th>
                    <th className="pb-3">Entry Price</th>
                    <th className="pb-3">Unrealized PnL</th>
                    <th className="pb-3 pr-2">Leverage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-elevated/60">
                  {positions.slice(0, 5).map((pos) => {
                    const isLong =
                      pos.side.toUpperCase() === "BUY" ||
                      pos.side.toUpperCase() === "LONG";
                    const pnl = pos.unrealized_pnl ?? 0;
                    return (
                      <tr
                        key={pos.id}
                        className="text-xs hover:bg-surface-secondary/40 transition-colors"
                      >
                        <td className="py-3 pl-2 font-semibold font-mono text-text-primary">
                          {pos.symbol}
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded-md px-2 py-0.5 font-bold font-mono text-[11px] ${
                              isLong
                                ? "bg-status-success/10 text-status-success border border-status-success/20"
                                : "bg-status-danger/10 text-status-danger border border-status-danger/20"
                            }`}
                          >
                            {isLong ? "LONG" : "SHORT"}
                          </span>
                        </td>
                        <td className="py-3 font-mono text-text-primary tabular-nums">
                          {pos.size}
                        </td>
                        <td className="py-3 font-mono text-text-secondary tabular-nums">
                          <NumericValue
                            value={pos.entry_price ?? 0}
                            currency="$"
                            size="sm"
                          />
                        </td>
                        <td className="py-3 font-mono tabular-nums">
                          <NumericValue
                            value={pnl}
                            currency="$"
                            signed={true}
                            size="sm"
                          />
                        </td>
                        <td className="py-3 pr-2 font-mono text-text-muted tabular-nums">
                          {pos.leverage ? `${pos.leverage}x` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 5. Signal Providers Spotlight */}
      {providers.length > 0 && (
        <Card className="bg-surface-primary border-surface-elevated shadow-xs overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-text-primary">
                  Signal Providers
                </CardTitle>
                <CardDescription className="text-text-muted mt-0.5">
                  Verified algorithmic and human crypto signal providers on
                  Tadex.
                </CardDescription>
              </div>
              <Link href="/dashboard/providers">
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  <span>Browse All Providers</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {providers.slice(0, 3).map((prov) => (
                <div
                  key={prov.id}
                  className="rounded-xl border border-surface-elevated bg-surface-secondary/40 p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-primary text-sm">
                      {prov.name}
                    </span>
                    {prov.is_verified && (
                      <span className="inline-flex items-center rounded-full bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 text-[11px] font-medium text-brand-accent">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-text-muted">
                    <div>
                      <p className="caption-4 text-text-tertiary">Win Rate</p>
                      <p className="font-bold text-text-primary font-mono tabular-nums">
                        {prov.win_rate !== undefined && prov.win_rate !== null
                          ? `${(prov.win_rate * 100).toFixed(1)}%`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="caption-4 text-text-tertiary">Signals Sent</p>
                      <p className="font-bold text-text-primary font-mono tabular-nums">
                        {prov.total_signals_sent ?? 0}
                      </p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-surface-elevated">
                    <Link href={`/dashboard/providers/${prov.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                      >
                        View Strategy
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
