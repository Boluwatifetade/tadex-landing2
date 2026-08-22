"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { AdminUserDetail360Out } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import AdminBanUserModal from "./AdminBanUserModal";
import AdminUnbanUserModal from "./AdminUnbanUserModal";
import AdminForceLogoutModal from "./AdminForceLogoutModal";
import AdminForceVerifyModal from "./AdminForceVerifyModal";
import {
  Users,
  ChevronLeft,
  ShieldCheck,
  ShieldAlert,
  Shield,
  KeyRound,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Radio,
  CreditCard,
  ScrollText,
  AlertTriangle,
  Mail,
  Phone,
  RefreshCw,
  LogOut,
  Sparkles,
  ExternalLink,
  Lock,
  Loader2,
} from "lucide-react";

interface AdminUserDetailViewProps {
  userId: string;
}

export default function AdminUserDetailView({ userId }: AdminUserDetailViewProps) {
  const [user, setUser] = useState<AdminUserDetail360Out | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Modal states
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isUnbanModalOpen, setIsUnbanModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isForceVerifyModalOpen, setIsForceVerifyModalOpen] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);

  const fetchUserDetails = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const data = await apiClient<AdminUserDetail360Out>(`/admin/users/${userId}`);
      setUser(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load user profile.";
      setErrorMsg(msg);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amountCents?: number | null, amountMinor?: number | null, currency: string = "USD") => {
    const rawVal = amountMinor ?? amountCents;
    if (rawVal === undefined || rawVal === null) return "-";
    const val = rawVal / 100;
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currency.toUpperCase(),
      }).format(val);
    } catch {
      return `${currency.toUpperCase()} ${val.toFixed(2)}`;
    }
  };

  const handleResendVerification = async () => {
    if (!user || user.email_verified) return;
    setIsResendingEmail(true);
    setActionSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await apiClient<{ message: string }>(`/admin/users/${userId}/resend-verification`, {
        method: "POST",
      });
      setActionSuccessMsg(res.message || "Verification email dispatched successfully.");
      fetchUserDetails();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to resend verification email.";
      setErrorMsg(msg);
    } finally {
      setIsResendingEmail(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "suspended":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "banned":
        return "bg-destructive/10 text-destructive border-destructive/20 font-bold";
      case "deleted":
        return "bg-muted text-muted-foreground border-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-6 w-36 bg-muted rounded-md"></div>
        <div className="h-36 bg-muted rounded-xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 bg-muted rounded-xl"></div>
          <div className="h-64 bg-muted rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (errorMsg && !user) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to User Directory</span>
        </Link>
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center space-y-3">
          <AlertTriangle className="mx-auto h-8 w-8 text-destructive" />
          <h2 className="text-base font-bold text-foreground">User Profile Not Available</h2>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">{errorMsg}</p>
          <Button variant="outline" size="sm" onClick={fetchUserDetails} className="text-xs">
            Retry Loading
          </Button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const isBanned = user.status.toLowerCase() === "banned";

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Return Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to User Directory</span>
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchUserDetails}
          className="text-xs flex items-center gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh Profile</span>
        </Button>
      </div>

      {/* Action Notification Banner */}
      {actionSuccessMsg && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* User 360° Header Profile Card */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: User Identity Details */}
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground font-black text-2xl shadow-xs">
                {user.email ? user.email.charAt(0).toUpperCase() : "U"}
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-bold text-foreground">
                    {user.email || <span className="italic text-muted-foreground">No Email Address</span>}
                  </h2>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider border ${getStatusBadge(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>

                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary capitalize">
                    {user.role}
                  </span>

                  {user.is_beta_tester && (
                    <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-500 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Beta Tester</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-mono">
                  <span>UUID: <strong className="text-foreground">{user.id}</strong></span>
                  {user.registration_source && (
                    <span>Source: <strong className="text-foreground">{user.registration_source}</strong></span>
                  )}
                  <span>Joined: <strong className="text-foreground">{formatDate(user.created_at)}</strong></span>
                </div>
              </div>
            </div>

            {/* Right: Quick Admin Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-border">
              {/* Force Verify Email */}
              {!user.email_verified && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResendVerification}
                    disabled={isResendingEmail}
                    className="text-xs flex items-center gap-1.5"
                  >
                    {isResendingEmail ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Mail className="h-3.5 w-3.5 text-primary" />
                    )}
                    <span>Resend Verification</span>
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsForceVerifyModalOpen(true)}
                    className="text-xs flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Force Verify Email</span>
                  </Button>
                </>
              )}

              {/* Administrative Force Logout */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsLogoutModalOpen(true)}
                className="text-xs flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Admin Logout-All</span>
              </Button>

              {/* Ban / Unban Gating */}
              {isBanned ? (
                <Button
                  size="sm"
                  onClick={() => setIsUnbanModalOpen(true)}
                  className="text-xs flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Unban User</span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setIsBanModalOpen(true)}
                  className="text-xs flex items-center gap-1.5 font-semibold"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>Ban User</span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 360° Detail Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Identity & Authentication Status */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold">Identity & Authentication</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] text-muted-foreground block">Email Address</span>
                <span className="font-semibold text-foreground">
                  {user.email || "-"}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Email Verified</span>
                <div className="mt-0.5">
                  {user.email_verified ? (
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Verified</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Unverified</span>
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground block">Telegram Username</span>
                {user.username || user.telegram_id ? (
                  <span className="font-mono text-primary flex items-center gap-1 mt-0.5">
                    <Send className="h-3 w-3" />
                    <span>{user.username ? `@${user.username}` : "-"}</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Telegram User ID</span>
                <span className="font-mono text-foreground font-semibold">
                  {user.telegram_id || "-"}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground block">Phone Number</span>
                <span className="font-medium text-foreground">{user.phone || "-"}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Terms Accepted</span>
                <span className="font-medium text-foreground">
                  {user.terms_accepted ? `Yes (${formatDate(user.terms_accepted_at)})` : "No"}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-muted-foreground block">Last Seen</span>
                <span className="font-medium text-foreground">{formatDate(user.last_seen)}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground block">Profile Updated</span>
                <span className="font-medium text-foreground">{formatDate(user.updated_at)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Connected Exchange Accounts (Masked Keys Only) */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold">Connected Exchange Keys</CardTitle>
              </div>
              <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-mono font-medium">
                {user.connected_exchanges.length} Connected
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            {user.connected_exchanges.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center italic">
                No exchange API credentials connected to this account.
              </p>
            ) : (
              <div className="space-y-2.5">
                {user.connected_exchanges.map((acc) => (
                  <div
                    key={acc.id}
                    className="rounded-lg border border-border bg-muted/20 p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-foreground">
                        <span className="uppercase text-[11px] px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                          {acc.exchange}
                        </span>
                        <span>{acc.account_name || "Primary Account"}</span>
                      </div>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          acc.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {acc.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-muted-foreground pt-1">
                      <div>
                        <span>Type: </span>
                        <strong className="text-foreground capitalize">{acc.account_type}</strong>
                      </div>
                      <div>
                        <span>Mode: </span>
                        <strong className="text-foreground capitalize">{acc.trading_mode}</strong>
                      </div>
                      <div>
                        <span>Masked Key: </span>
                        <span className="font-mono text-foreground font-semibold">
                          {acc.api_key_masked}
                        </span>
                      </div>
                    </div>

                    {acc.last_validated_at && (
                      <p className="text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                        Validated: {formatDate(acc.last_validated_at)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="rounded-lg border border-border/50 bg-muted/10 p-2.5 text-[11px] text-muted-foreground flex items-center gap-2">
              <Lock className="h-3.5 w-3.5 shrink-0 text-primary" />
              <span>
                Non-Custodial Security: Raw API secrets are strictly never readable by administrative portals.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Subscriptions */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold">Signal Subscriptions</CardTitle>
              </div>
              <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-mono font-medium">
                {user.subscriptions.length} Total
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            {user.subscriptions.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center italic">
                No active or historical signal subscriptions.
              </p>
            ) : (
              <div className="space-y-2.5">
                {user.subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="rounded-lg border border-border bg-muted/20 p-3 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">
                        {sub.plan_name || "Standard Signal Plan"}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          sub.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
                      <div>
                        <span>Provider: </span>
                        <strong className="text-foreground">
                          {sub.provider_name || sub.provider_id || "-"}
                        </strong>
                      </div>
                      <div>
                        <span>Tier: </span>
                        <strong className="text-foreground capitalize">{sub.tier || "Standard"}</strong>
                      </div>
                      <div>
                        <span>Started: </span>
                        <span>{formatDate(sub.started_at)}</span>
                      </div>
                      <div>
                        <span>Period End: </span>
                        <span>{formatDate(sub.current_period_end || sub.expires_at)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 4: Signal Provider Profile */}
        <Card className="border-border bg-card shadow-xs">
          <CardHeader className="pb-3 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-bold">Signal Provider Profile</CardTitle>
              </div>
              {user.provider_profile && (
                <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-semibold uppercase">
                  Registered Provider
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-4 text-xs">
            {!user.provider_profile ? (
              <p className="text-muted-foreground py-4 text-center italic">
                User is not registered as a signal provider.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-foreground">
                      {user.provider_profile.name}
                    </h4>
                    <p className="text-[11px] text-muted-foreground font-mono">
                      ID: {user.provider_profile.id}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${getStatusBadge(
                      user.provider_profile.status
                    )}`}
                  >
                    {user.provider_profile.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3 rounded-lg bg-muted/20 border border-border text-[11px]">
                  <div>
                    <span className="text-muted-foreground block">Verified Tier</span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                      {user.provider_profile.verification_level}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Subscribers</span>
                    <span className="font-semibold text-foreground">
                      {user.provider_profile.subscriber_count}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Signals Sent</span>
                    <span className="font-semibold text-foreground">
                      {user.provider_profile.total_signals_sent}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/admin/providers`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                  >
                    <span>View in Provider Governance</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section 5: Payment History */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold">Billing & Payment Transactions</CardTitle>
            </div>
            <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-mono font-medium">
              {user.payment_history.length} Records
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 text-xs">
          {user.payment_history.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center italic">
              No recorded payment transactions for this user.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-border text-muted-foreground font-semibold">
                  <tr>
                    <th className="pb-2">Transaction ID</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Method</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Provider</th>
                    <th className="pb-2 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {user.payment_history.map((tx) => (
                    <tr key={tx.id} className="hover:bg-muted/20">
                      <td className="py-2.5 font-mono text-[11px]">
                        {tx.id.substring(0, 10)}...
                      </td>
                      <td className="py-2.5 font-bold text-foreground">
                        {formatCurrency(tx.amount_cents, tx.amount_minor, tx.currency || "USD")}
                      </td>
                      <td className="py-2.5 capitalize">{tx.payment_method || "Card"}</td>
                      <td className="py-2.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            tx.status.toLowerCase().includes("succ") || tx.status.toLowerCase().includes("comp")
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : tx.status.toLowerCase().includes("pend")
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-muted-foreground">{tx.provider || "Flutterwave"}</td>
                      <td className="py-2.5 text-right text-muted-foreground">
                        {formatDate(tx.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section 6: Recent Audit Logs */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm font-bold">Administrative Audit History</CardTitle>
            </div>
            <span className="rounded-full bg-muted/60 px-2 py-0.5 text-[11px] font-mono font-medium">
              {user.recent_audit_logs.length} Events
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 text-xs">
          {user.recent_audit_logs.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center italic">
              No audit logs recorded for this user account.
            </p>
          ) : (
            <div className="space-y-3">
              {user.recent_audit_logs.map((log) => (
                <div
                  key={log.id}
                  className="rounded-lg border border-border bg-muted/20 p-3 space-y-1.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-foreground uppercase text-[11px] bg-primary/10 text-primary px-2 py-0.5 rounded-md">
                        {log.action_type}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Target: {log.target_entity_type} ({log.target_entity_id?.substring(0, 8)}...)
                      </span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDate(log.created_at)}
                    </span>
                  </div>

                  {log.reason && (
                    <p className="text-xs text-foreground bg-background/80 p-2 rounded-md border border-border">
                      <strong className="text-muted-foreground">Reason: </strong>
                      {log.reason}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-mono">
                    <span>Admin ID: {log.admin_user_id || "System"}</span>
                    {log.ip_address && <span>IP: {log.ip_address}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Modals */}
      {isBanModalOpen && (
        <AdminBanUserModal
          userId={user.id}
          userEmail={user.email}
          onSuccess={() => {
            setIsBanModalOpen(false);
            setActionSuccessMsg(`User ${user.email || user.id} has been banned.`);
            fetchUserDetails();
          }}
          onCancel={() => setIsBanModalOpen(false)}
        />
      )}

      {isUnbanModalOpen && (
        <AdminUnbanUserModal
          userId={user.id}
          userEmail={user.email}
          onSuccess={() => {
            setIsUnbanModalOpen(false);
            setActionSuccessMsg(`User ${user.email || user.id} has been unbanned.`);
            fetchUserDetails();
          }}
          onCancel={() => setIsUnbanModalOpen(false)}
        />
      )}

      {isLogoutModalOpen && (
        <AdminForceLogoutModal
          userId={user.id}
          userEmail={user.email}
          onSuccess={() => {
            setIsLogoutModalOpen(false);
            setActionSuccessMsg(`All active sessions revoked for ${user.email || user.id}.`);
            fetchUserDetails();
          }}
          onCancel={() => setIsLogoutModalOpen(false)}
        />
      )}

      {isForceVerifyModalOpen && (
        <AdminForceVerifyModal
          userId={user.id}
          userEmail={user.email}
          onSuccess={() => {
            setIsForceVerifyModalOpen(false);
            setActionSuccessMsg(`Email force-verified for ${user.email || user.id}.`);
            fetchUserDetails();
          }}
          onCancel={() => setIsForceVerifyModalOpen(false)}
        />
      )}
    </div>
  );
}
