"use client";

import { useEffect, useState, useCallback } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ErrorBoundary from "@/components/ErrorBoundary";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProviderApplyForm from "@/components/dashboard/provider/ProviderApplyForm";
import ProviderDashboard from "@/components/dashboard/provider/ProviderDashboard";
import { apiClient } from "@/lib/api-client";
import { ProviderMeResponse, ProviderApplicationOut } from "@/types/provider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Radio,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  CreditCard,
  KeyRound,
  ArrowRight,
  XCircle,
} from "lucide-react";

interface UserMeResponse {
  id?: string;
  email?: string;
  status?: string;
}

function ProviderPortalContent() {
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [portalData, setPortalData] = useState<ProviderMeResponse | null>(null);
  const [is404Unregistered, setIs404Unregistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);

  const fetchPortalState = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    setIs404Unregistered(false);

    try {
      const userRes = await apiClient<UserMeResponse>("/me");
      setUser(userRes || {});
    } catch {
      /* non-blocking session fetch */
    }

    try {
      const data = await apiClient<ProviderMeResponse>("/provider/me");
      setPortalData(data);
      setShowApplyForm(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load provider profile";
      if (
        msg.toLowerCase().includes("no signal provider profile") ||
        msg.toLowerCase().includes("not found") ||
        msg.toLowerCase().includes("404")
      ) {
        setIs404Unregistered(true);
        setPortalData(null);
      } else {
        setFetchError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortalState();
  }, [fetchPortalState]);

  const handleApplicationSuccess = (app: ProviderApplicationOut) => {
    setPortalData({
      role: "applicant",
      application: app,
    });
    setIs404Unregistered(false);
    setShowApplyForm(false);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader userEmail={user?.email} userStatus={user?.status} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <Radio className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Provider Portal</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your signal provider profile, subscription tiers, verification, and automated trading operations.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchPortalState}
            disabled={isLoading}
            className="text-xs self-start sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Loading provider profile status...</p>
          </div>
        ) : fetchError ? (
          /* Error State */
          <div
            role="alert"
            className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-destructive space-y-3"
          >
            <div className="flex items-center gap-2 font-bold">
              <AlertTriangle className="h-5 w-5" />
              <span>Failed to load provider profile</span>
            </div>
            <p className="text-xs text-muted-foreground">{fetchError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPortalState}
              className="text-xs"
            >
              Try Again
            </Button>
          </div>
        ) : portalData?.role === "provider" && portalData.provider ? (
          /* 1. Full Provider Dashboard */
          <ProviderDashboard
            provider={portalData.provider}
            onRefresh={fetchPortalState}
          />
        ) : portalData?.role === "applicant" && portalData.application?.status === "pending" ? (
          /* 2. Applicant: Pending Review */
          <Card className="border-border bg-card shadow-sm max-w-2xl mx-auto">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mb-3">
                <Clock className="h-6 w-6" />
              </div>
              <CardTitle className="text-xl font-bold">Provider Application Under Review</CardTitle>
              <CardDescription className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                Your application to become a verified signal provider is currently queued for administrative compliance review.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              <div className="rounded-xl border border-border/80 bg-muted/20 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs">
                  <span className="text-muted-foreground">Application ID:</span>
                  <span className="font-mono text-foreground">{portalData.application.id}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs">
                  <span className="text-muted-foreground">Provider Brand:</span>
                  <span className="font-semibold text-foreground">
                    {portalData.application.display_name}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs">
                  <span className="text-muted-foreground">Contact Email:</span>
                  <span className="text-foreground">{portalData.application.contact_email}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs">
                  <span className="text-muted-foreground">Experience Level:</span>
                  <span className="text-foreground">{portalData.application.experience_level}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-border/60 text-xs">
                  <span className="text-muted-foreground">Submitted At:</span>
                  <span className="text-foreground">
                    {formatDate(portalData.application.submitted_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 font-semibold text-amber-600 dark:text-amber-400">
                    Pending Review
                  </span>
                </div>
              </div>

              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground space-y-1.5">
                <p className="font-semibold text-foreground">What happens next?</p>
                <p className="leading-relaxed">
                  Our compliance team reviews trading background, channel ownership, and risk controls. Review turnaround typically takes between <strong>24–48 hours</strong>. Once approved, your provider dashboard and plan creation capabilities will unlock automatically.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : portalData?.role === "applicant" && portalData.application?.status === "rejected" ? (
          /* 3. Applicant: Rejected / Needs Update */
          showApplyForm ? (
            <ProviderApplyForm
              initialEmail={user?.email || portalData.application.contact_email}
              onSuccess={handleApplicationSuccess}
              onCancel={() => setShowApplyForm(false)}
            />
          ) : (
            <Card className="border-border bg-card shadow-sm max-w-2xl mx-auto">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
                  <XCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl font-bold">Application Status: Not Approved</CardTitle>
                <CardDescription className="text-xs text-muted-foreground max-w-md mx-auto mt-1">
                  Your previous provider application was reviewed and not approved by platform administration.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 pt-4">
                {/* Rejection Reason */}
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 space-y-2">
                  <span className="text-xs font-semibold text-destructive uppercase tracking-wider">
                    Reason for Non-Approval:
                  </span>
                  <p className="text-sm text-foreground font-medium">
                    {portalData.application.rejection_reason ||
                      "Application did not meet minimum verifiable track record or risk management standards."}
                  </p>
                  {portalData.application.reviewed_at && (
                    <p className="text-[11px] text-muted-foreground pt-1 border-t border-destructive/10">
                      Reviewed on: {formatDate(portalData.application.reviewed_at)}
                    </p>
                  )}
                </div>

                {/* Guidance & Re-apply CTA */}
                <div className="rounded-lg border border-border bg-muted/20 p-4 space-y-3 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground">Can I re-apply?</p>
                  <p className="leading-relaxed">
                    Yes! You can update your trading focus, bio, or contact information and submit a new application for re-evaluation.
                  </p>
                  <Button
                    onClick={() => setShowApplyForm(true)}
                    className="w-full sm:w-auto text-xs flex items-center justify-center gap-1.5 mt-2"
                  >
                    <span>Update & Re-apply</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        ) : (
          /* 4. 404 Unregistered (Landing / Apply Hero) */
          showApplyForm ? (
            <ProviderApplyForm
              initialEmail={user?.email || ""}
              onSuccess={handleApplicationSuccess}
              onCancel={() => setShowApplyForm(false)}
            />
          ) : (
            <div className="space-y-8 max-w-4xl mx-auto">
              {/* Hero Banner */}
              <div className="rounded-2xl border border-border bg-linear-to-b from-card via-card to-muted/30 p-8 sm:p-12 text-center space-y-6 shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
                  <Radio className="h-8 w-8" />
                </div>

                <div className="space-y-2 max-w-xl mx-auto">
                  <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
                    Become a Tadex Signal Provider
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Broadcast trading signals and let subscribers auto-execute trades via secure, trade-only Bybit exchange API keys. Earn subscription revenue settled in local currency (NGN) or USDT.
                  </p>
                </div>

                <div className="pt-2">
                  <Button
                    size="lg"
                    onClick={() => setShowApplyForm(true)}
                    className="px-8 font-semibold flex items-center gap-2 mx-auto"
                  >
                    <span>Apply to Become a Signal Provider</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Value Proposition Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">100% Non-Custodial</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You never touch subscriber funds. Trades execute directly on subscribers&apos; own Bybit accounts via trade-only API keys.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Multi-Currency Billing</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Create custom monthly subscription tiers priced in NGN (Flutterwave) or USDT (TRC-20 crypto settlement).
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-xs">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Verified Trader Badge</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Submit track record evidence to unlock verified status and rank at the top of the retail trader marketplace.
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}

export default function ProviderPortalPage() {
  return (
    <ProtectedRoute>
      <ErrorBoundary>
        <ProviderPortalContent />
      </ErrorBoundary>
    </ProtectedRoute>
  );
}
