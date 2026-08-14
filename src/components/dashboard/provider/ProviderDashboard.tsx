"use client";

import { useState } from "react";
import { ProviderDetailOut } from "@/types/provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import ProviderPlanManager from "./ProviderPlanManager";
import ProviderVerificationCard from "./ProviderVerificationCard";
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  TrendingUp,
  Radio,
  Calendar,
  AlertTriangle,
  Award,
} from "lucide-react";

interface ProviderDashboardProps {
  provider: ProviderDetailOut;
  onRefresh: () => void;
}

export default function ProviderDashboard({ provider, onRefresh }: ProviderDashboardProps) {
  const isSuspended = provider.status === "suspended";
  const isVerified = Boolean(provider.is_verified);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Suspended Provider Warning Banner */}
      {isSuspended && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-destructive space-y-1 shadow-xs"
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>Signal Provider Profile Suspended</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed pl-7">
            Your signal provider operations are currently suspended by platform administration. Plan creation, editing, deactivation, and verification requests are disabled while suspended. Please reach out to support if you believe this is an error.
          </p>
        </div>
      )}

      {/* Provider Header Card */}
      <Card className="border-border bg-card shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Brand Identity */}
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black text-2xl shadow-xs">
                {provider.name.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-xl font-bold text-foreground">{provider.name}</h2>
                  {isVerified ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verified ({provider.verification_level || "basic"})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      <Award className="h-3.5 w-3.5" />
                      {provider.verification_level || "Unverified"}
                    </span>
                  )}

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      isSuspended
                        ? "bg-destructive/10 text-destructive"
                        : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    }`}
                  >
                    {provider.status}
                  </span>
                </div>

                {provider.description && (
                  <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
                    {provider.description}
                  </p>
                )}

                {provider.email && (
                  <p className="text-xs text-muted-foreground">
                    Contact: <span className="text-foreground">{provider.email}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Right: Join Date */}
            <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-border text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Provider since
              </span>
              <span className="font-semibold text-foreground mt-0.5">
                {formatDate(provider.created_at)}
              </span>
            </div>
          </div>

          {/* Metrics Overview Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-border">
            <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                <Users className="h-4 w-4 text-primary" />
                <span>Active Subscribers</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {provider.subscriber_count.toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                <Radio className="h-4 w-4 text-primary" />
                <span>Signals Sent</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {provider.total_signals_sent.toLocaleString()}
              </p>
            </div>

            <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span>Win Rate</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">
                {provider.win_rate !== null && provider.win_rate !== undefined
                  ? `${provider.win_rate}%`
                  : "N/A"}
              </p>
            </div>

            <div className="rounded-lg border border-border/80 bg-muted/20 p-3.5">
              <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span>Verification Tier</span>
              </div>
              <p className="text-sm font-bold text-foreground mt-2 capitalize">
                {provider.verification_level || "Standard"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Card */}
      <ProviderVerificationCard
        provider={provider}
        onVerificationSubmitted={onRefresh}
      />

      {/* Plans Management */}
      <ProviderPlanManager
        providerId={provider.id}
        isSuspended={isSuspended}
      />
    </div>
  );
}
