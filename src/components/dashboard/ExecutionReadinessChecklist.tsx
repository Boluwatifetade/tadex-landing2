"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ReadinessChecklistItem {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
  href: string;
  actionText: string;
}

export interface ExecutionReadinessChecklistProps {
  emailVerified: boolean;
  userEmail?: string | null;
  exchangeConnected: boolean;
  activeKeyMasked?: string | null;
  activeExchange?: string | null;
  telegramLinked: boolean;
  telegramUsername?: string | null;
  subscriptionActive: boolean;
  subscriptionTier?: string | null;
  isLoading?: boolean;
  className?: string;
}

export default function ExecutionReadinessChecklist({
  emailVerified,
  userEmail,
  exchangeConnected,
  activeKeyMasked,
  activeExchange,
  telegramLinked,
  telegramUsername,
  subscriptionActive,
  subscriptionTier,
  isLoading = false,
  className,
}: ExecutionReadinessChecklistProps) {
  const items: ReadinessChecklistItem[] = [
    {
      id: "email",
      title: "Account Verified",
      subtitle: emailVerified
        ? userEmail || "Email verified"
        : "Verify email to authorize account actions",
      completed: emailVerified,
      href: "/dashboard/settings",
      actionText: emailVerified ? "Verified" : "Verify Email",
    },
    {
      id: "exchange",
      title: "Exchange API Key",
      subtitle:
        exchangeConnected && activeExchange
          ? `Key configured: ${activeExchange.toUpperCase()} (${activeKeyMasked || "****"})`
          : "Connect Bybit trade-only API key",
      completed: exchangeConnected,
      href: "/dashboard/keys",
      actionText: exchangeConnected ? "Manage Key" : "Connect Key",
    },
    {
      id: "telegram",
      title: "Telegram Alerts",
      subtitle: telegramLinked
        ? `@${telegramUsername || "Linked Account"}`
        : "Pair Telegram bot for execution notifications",
      completed: telegramLinked,
      href: "/dashboard/settings",
      actionText: telegramLinked ? "Linked" : "Link Telegram",
    },
    {
      id: "subscription",
      title: "Platform Subscription",
      subtitle: subscriptionActive
        ? `Tier: ${subscriptionTier || "Active"}`
        : "Select plan for automated trading features",
      completed: subscriptionActive,
      href: "/dashboard/billing",
      actionText: subscriptionActive ? "Manage Plan" : "Subscribe",
    },
  ];

  const completedCount = items.filter((i) => i.completed).length;
  const isFullyReady = completedCount === items.length;

  if (isLoading) {
    return (
      <div
        data-testid="readiness-checklist-skeleton"
        className={cn(
          "rounded-2xl border border-surface-elevated bg-surface-primary p-5 sm:p-6 animate-pulse space-y-4",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <div className="h-5 w-48 rounded-md bg-surface-secondary" />
          <div className="h-5 w-28 rounded-full bg-surface-secondary" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-xl border border-surface-elevated bg-surface-secondary/50"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <Card
      data-testid="execution-readiness-checklist"
      className={cn("bg-surface-primary border-surface-elevated shadow-xs", className)}
    >
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-text-primary">
              <ShieldCheck className="h-5 w-5 text-brand-accent shrink-0" />
              <span>Account Setup Checklist</span>
            </CardTitle>
            <CardDescription className="text-text-muted mt-0.5">
              Completion status of foundational account and exchange configuration requirements.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <span
              data-testid="readiness-progress-pill"
              className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border transition-colors",
                isFullyReady
                  ? "bg-status-success/10 text-status-success border-status-success/30"
                  : "bg-surface-secondary text-text-secondary border-surface-elevated"
              )}
            >
              {isFullyReady
                ? "Setup Complete"
                : `${completedCount} of 4 Completed`}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((step, idx) => (
            <div
              key={step.id}
              data-testid={`checklist-step-${step.id}`}
              className={cn(
                "flex flex-col justify-between rounded-xl border p-4 transition-all duration-150",
                step.completed
                  ? "border-status-success/30 bg-status-success/5"
                  : "border-surface-elevated bg-surface-subtle/50 hover:bg-surface-subtle"
              )}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
                    Step {idx + 1}
                  </span>
                  {step.completed ? (
                    <CheckCircle2
                      data-testid={`icon-completed-${step.id}`}
                      className="h-4 w-4 text-status-success"
                    />
                  ) : (
                    <Clock
                      data-testid={`icon-pending-${step.id}`}
                      className="h-4 w-4 text-text-tertiary"
                    />
                  )}
                </div>

                <p className="mt-2.5 text-sm font-semibold text-text-primary">
                  {step.title}
                </p>
                <p className="mt-1 text-xs text-text-muted line-clamp-2 leading-relaxed">
                  {step.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-elevated/60">
                <Link href={step.href}>
                  <Button
                    variant={step.completed ? "ghost" : "outline"}
                    size="sm"
                    className="w-full text-xs h-8"
                  >
                    <span>{step.actionText}</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
