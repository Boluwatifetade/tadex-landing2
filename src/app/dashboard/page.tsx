"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import {
  KeyRound,
  CreditCard,
  LineChart,
  Users,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Loader2,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

interface UserMeResponse {
  id?: string;
  email?: string;
  status?: string;
  email_verified?: boolean;
  telegram_linked?: boolean;
  telegram_username?: string | null;
}

interface KeyResponse {
  id: string;
  exchange: string;
  api_key_masked: string;
  is_testnet: boolean;
  status: string;
  created_at?: string;
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
  const [providers, setProviders] = useState<ProviderOut[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    else setIsRefreshing(true);
    setErrorMsg(null);

    try {
      const [userRes, keysRes, subRes, posRes, provRes] = await Promise.allSettled([
        apiClient<UserMeResponse>("/me"),
        apiClient<KeyResponse[]>("/keys"),
        apiClient<UserSubscriptionResponse>("/billing/subscription"),
        apiClient<PositionOut[]>("/trading/positions"),
        apiClient<ProviderOut[]>("/providers"),
      ]);

      if (userRes.status === "fulfilled" && userRes.value) {
        setUser(userRes.value);
      }
      if (keysRes.status === "fulfilled" && Array.isArray(keysRes.value)) {
        setKeys(keysRes.value);
      }
      if (subRes.status === "fulfilled" && subRes.value) {
        setSubData(subRes.value);
      }
      if (posRes.status === "fulfilled" && Array.isArray(posRes.value)) {
        setPositions(posRes.value);
      }
      if (provRes.status === "fulfilled" && Array.isArray(provRes.value)) {
        setProviders(provRes.value);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load dashboard data";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Compute Onboarding / Execution Readiness Checklist
  const isEmailVerified = !!user?.email_verified;
  const activeKey = keys.find((k) => k.status === "active");
  const isExchangeConnected = keys.length > 0 && keys.some((k) => k.status === "active");
  const isTelegramLinked = !!user?.telegram_linked;
  const isSubscriptionActive = !!subData?.has_active_subscription;
  const isProviderSelected = !!subData?.subscription?.provider_id;

  const checklistItems = [
    {
      title: "Email Verified",
      subtitle: user?.email ? user.email : "Verify email for trading security",
      completed: isEmailVerified,
      href: "/dashboard/settings",
      actionText: isEmailVerified ? "Verified" : "Verify Email",
    },
    {
      title: "Exchange API Key",
      subtitle: isExchangeConnected && activeKey ? `${activeKey.exchange.toUpperCase()} (${activeKey.api_key_masked})` : "Connect Bybit trade-only API key",
      completed: isExchangeConnected,
      href: "/dashboard/keys",
      actionText: isExchangeConnected ? "Manage Key" : "Connect Key",
    },
    {
      title: "Telegram Alerts & Bot",
      subtitle: isTelegramLinked ? `@${user?.telegram_username || "Linked"}` : "Link Telegram account for signal notifications",
      completed: isTelegramLinked,
      href: "/dashboard/settings",
      actionText: isTelegramLinked ? "Linked" : "Link Telegram",
    },
    {
      title: "Active Platform Subscription",
      subtitle: isSubscriptionActive ? `Tier: ${subData?.subscription?.tier || "Active"}` : "Select plan for automated execution",
      completed: isSubscriptionActive,
      href: "/dashboard/billing",
      actionText: isSubscriptionActive ? "Manage Plan" : "Subscribe",
    },
    {
      title: "Signal Provider",
      subtitle: isProviderSelected ? "Active Provider Configured" : "Choose a verified signal provider",
      completed: isProviderSelected,
      href: "/dashboard/providers",
      actionText: isProviderSelected ? "Change Provider" : "Browse Providers",
    },
  ];

  const completedSteps = checklistItems.filter((i) => i.completed).length;
  const isFullyReady = completedSteps === checklistItems.length;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium">Loading system status & accounts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Overview & Readiness</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Non-custodial trading automation and account connectivity status.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchDashboardData(true)}
          disabled={isRefreshing}
          className="gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh Status
        </Button>
      </div>

      {errorMsg && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <span>{errorMsg}</span>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchDashboardData()}>Retry</Button>
        </div>
      )}

      {/* Subscription Notifications Banner (if any) */}
      {subData?.notifications && subData.notifications.length > 0 && (
        <div className="space-y-2">
          {subData.notifications.map((notif, idx) => (
            <div key={idx} className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-500 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{notif}</span>
            </div>
          ))}
        </div>
      )}

      {/* 5-Step Execution Readiness Wizard */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Execution Readiness Checklist
              </CardTitle>
              <CardDescription>
                All 5 requirements must be completed before automated signals can execute on your exchange account.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isFullyReady ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-primary/10 text-primary border border-primary/20"
              }`}>
                {isFullyReady ? "Ready for Execution" : `${completedSteps} of 5 Completed`}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {checklistItems.map((step, idx) => (
              <div
                key={idx}
                className={`flex flex-col justify-between rounded-lg border p-3.5 transition-colors ${
                  step.completed
                    ? "border-emerald-500/30 bg-emerald-500/5"
                    : "border-border bg-muted/20"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground">Step {idx + 1}</span>
                    {step.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground">{step.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{step.subtitle}</p>
                </div>
                <div className="mt-4 pt-2 border-t border-border/50">
                  <Link href={step.href}>
                    <Button
                      variant={step.completed ? "ghost" : "outline"}
                      size="sm"
                      className="w-full text-xs h-7"
                    >
                      {step.actionText}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Metrics / System State Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Exchange Key Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">Exchange Connection</CardDescription>
              <KeyRound className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold">
              {isExchangeConnected && activeKey ? activeKey.exchange.toUpperCase() : "Not Connected"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 text-xs text-muted-foreground">
            {isExchangeConnected && activeKey ? (
              <div className="space-y-1">
                <p>Key: <span className="font-mono text-foreground">{activeKey.api_key_masked}</span></p>
                <p className="text-emerald-500 font-medium">Trade-Only (Non-Custodial)</p>
              </div>
            ) : (
              <p>Connect Bybit API key with trade-only permissions.</p>
            )}
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/dashboard/keys" className="w-full">
              <Button variant="outline" size="sm" className="w-full text-xs">
                {isExchangeConnected ? "Manage Keys" : "Connect Key"}
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Subscription Tier Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">Platform Subscription</CardDescription>
              <CreditCard className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold capitalize">
              {subData?.subscription?.tier || "Free"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 text-xs text-muted-foreground">
            <div className="space-y-1">
              <p>Status: <span className="font-medium text-foreground capitalize">{subData?.subscription?.status || "Inactive"}</span></p>
              <p>
                {subData?.subscription?.current_period_end
                  ? `Renews: ${new Date(subData.subscription.current_period_end).toLocaleDateString()}`
                  : "No active auto-renewal"}
              </p>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/dashboard/billing" className="w-full">
              <Button variant="outline" size="sm" className="w-full text-xs">
                {isSubscriptionActive ? "Manage Billing" : "Upgrade Plan"}
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Open Positions Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">Open Positions</CardDescription>
              <LineChart className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold">
              {positions.length} Active
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 text-xs text-muted-foreground">
            <p>
              {positions.length > 0
                ? "Live positions being managed on exchange."
                : "No open positions currently active."}
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/dashboard/trading" className="w-full">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Live Execution
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Telegram Integration Card */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">Telegram Bot</CardDescription>
              <Send className="h-4 w-4 text-primary" />
            </div>
            <CardTitle className="text-xl font-bold">
              {isTelegramLinked ? "Connected" : "Unlinked"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3 text-xs text-muted-foreground">
            <p>
              {isTelegramLinked
                ? `@${user?.telegram_username || "Linked Account"}`
                : "Link Telegram for live execution alerts."}
            </p>
          </CardContent>
          <CardFooter className="pt-0">
            <Link href="/dashboard/settings" className="w-full">
              <Button variant="outline" size="sm" className="w-full text-xs">
                {isTelegramLinked ? "Settings" : "Link Telegram"}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      {/* Active Positions Summary */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold">Active Exchange Positions</CardTitle>
              <CardDescription>Live positions synchronized with your connected Bybit account.</CardDescription>
            </div>
            <Link href="/dashboard/trading">
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                View All in Trading
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">No active positions</p>
              <p className="text-xs">Positions opened by signal automations will appear here and in Live Trading.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th className="pb-3 font-medium">Symbol</th>
                    <th className="pb-3 font-medium">Side</th>
                    <th className="pb-3 font-medium">Size</th>
                    <th className="pb-3 font-medium">Entry Price</th>
                    <th className="pb-3 font-medium">Unrealized PnL</th>
                    <th className="pb-3 font-medium">Leverage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {positions.slice(0, 5).map((pos) => {
                    const isLong = pos.side.toUpperCase() === "BUY" || pos.side.toUpperCase() === "LONG";
                    const pnl = pos.unrealized_pnl ?? 0;
                    return (
                      <tr key={pos.id} className="text-xs">
                        <td className="py-3 font-semibold text-foreground">{pos.symbol}</td>
                        <td className="py-3">
                          <span className={`inline-flex rounded px-1.5 py-0.5 font-bold ${
                            isLong ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"
                          }`}>
                            {isLong ? "LONG" : "SHORT"}
                          </span>
                        </td>
                        <td className="py-3 font-mono">{pos.size}</td>
                        <td className="py-3 font-mono">${pos.entry_price?.toLocaleString() ?? "-"}</td>
                        <td className={`py-3 font-mono font-bold ${
                          pnl > 0 ? "text-emerald-500" : pnl < 0 ? "text-destructive" : "text-muted-foreground"
                        }`}>
                          {pnl > 0 ? `+$${pnl.toFixed(2)}` : pnl < 0 ? `-$${Math.abs(pnl).toFixed(2)}` : "$0.00"}
                        </td>
                        <td className="py-3 font-mono">{pos.leverage ? `${pos.leverage}x` : "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signal Providers Spotlight */}
      {providers.length > 0 && (
        <Card className="border-border bg-card shadow-xs">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Signal Providers</CardTitle>
                <CardDescription>Verified algorithmic and human crypto signal providers on Tadex.</CardDescription>
              </div>
              <Link href="/dashboard/providers">
                <Button variant="outline" size="sm" className="text-xs gap-1.5">
                  Browse All Providers
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {providers.slice(0, 3).map((prov) => (
                <div key={prov.id} className="rounded-lg border border-border bg-muted/10 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground text-sm">{prov.name}</span>
                    {prov.is_verified && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>
                      <p>Win Rate</p>
                      <p className="font-bold text-foreground">
                        {prov.win_rate !== undefined && prov.win_rate !== null
                          ? `${(prov.win_rate * 100).toFixed(1)}%`
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p>Signals Sent</p>
                      <p className="font-bold text-foreground">{prov.total_signals_sent ?? 0}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border/60">
                    <Link href={`/dashboard/providers/${prov.id}`}>
                      <Button variant="outline" size="sm" className="w-full text-xs">
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
