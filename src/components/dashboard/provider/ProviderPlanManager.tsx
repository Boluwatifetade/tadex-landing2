"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ProviderPlanOut } from "@/types/provider";
import ProviderPlanModal from "./ProviderPlanModal";
import {
  CreditCard,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Archive,
  PauseCircle,
  HelpCircle,
} from "lucide-react";

interface ProviderPlanManagerProps {
  providerId: string;
  isSuspended?: boolean;
}

export default function ProviderPlanManager({
  providerId,
  isSuspended = false,
}: ProviderPlanManagerProps) {
  const [plans, setPlans] = useState<ProviderPlanOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ProviderPlanOut | null>(null);

  // Deactivation Confirmation State
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await apiClient<ProviderPlanOut[]>("/provider/plans");
      setPlans(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load provider plans";
      setFetchError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const activePlansCount = plans.filter(
    (p) => p.is_active && String(p.status).toLowerCase() !== "archived"
  ).length;

  const isAtActiveLimit = activePlansCount >= 3;

  const handlePlanSaved = (savedPlan: ProviderPlanOut) => {
    setPlans((prev) => {
      const exists = prev.some((p) => p.id === savedPlan.id);
      if (exists) {
        return prev.map((p) => (p.id === savedPlan.id ? savedPlan : p));
      }
      return [savedPlan, ...prev];
    });
  };

  const handleDeactivate = async () => {
    if (!deactivatingId) return;
    setIsDeactivating(true);
    setDeactivateError(null);

    try {
      await apiClient(`/provider/plans/${deactivatingId}`, {
        method: "DELETE",
      });

      setPlans((prev) =>
        prev.map((p) =>
          p.id === deactivatingId
            ? { ...p, status: "archived", is_active: false }
            : p
        )
      );
      setDeactivatingId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to deactivate plan";
      setDeactivateError(msg);
    } finally {
      setIsDeactivating(false);
    }
  };

  const formatPrice = (cents: number, currency: string) => {
    const amount = (cents / 100).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
    return `${currency.toUpperCase()} ${amount}`;
  };

  const getStatusBadge = (plan: ProviderPlanOut) => {
    const st = (plan.status || (plan.is_active ? "active" : "archived")).toLowerCase();
    switch (st) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            Active
          </span>
        );
      case "paused":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <PauseCircle className="h-3 w-3" />
            Paused
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
            <Clock className="h-3 w-3" />
            Draft
          </span>
        );
      case "archived":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-semibold text-destructive">
            <Archive className="h-3 w-3" />
            Archived
          </span>
        );
    }
  };

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <CreditCard className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-bold">Subscription Plans</CardTitle>
              <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                Active: {activePlansCount}/3
              </span>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-1">
              Manage custom pricing tiers for your automated signals. You can have up to 3 concurrently active tiers.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPlans}
              disabled={isLoading}
              className="text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <div className="relative group">
              <Button
                size="sm"
                onClick={() => {
                  setEditingPlan(null);
                  setIsModalOpen(true);
                }}
                disabled={isLoading || isSuspended || isAtActiveLimit}
                className="text-xs flex items-center gap-1.5"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create Plan</span>
              </Button>

              {/* Tooltip on why Create Plan is disabled */}
              {isAtActiveLimit && !isSuspended && (
                <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block z-20 w-64 p-2 rounded-lg border border-border bg-popover text-popover-foreground text-xs shadow-md">
                  Active plan limit reached (3/3). Archive or pause an existing plan before creating a new one.
                </div>
              )}
              {isSuspended && (
                <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block z-20 w-64 p-2 rounded-lg border border-border bg-popover text-popover-foreground text-xs shadow-md">
                  Plan creation is disabled while your provider profile is suspended.
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Limit reached alert banner */}
        {isAtActiveLimit && !isSuspended && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                <strong>3 Active Plans Limit Reached:</strong> You have 3 active plans visible in the public catalog.
              </span>
            </div>
          </div>
        )}

        {/* Fetch Error */}
        {fetchError && (
          <div
            role="alert"
            className="mb-4 flex items-center justify-between rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{fetchError}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={fetchPlans} className="text-xs h-7">
              Retry
            </Button>
          </div>
        )}

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground space-y-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <p className="text-xs">Loading subscription plans...</p>
          </div>
        ) : plans.length === 0 ? (
          /* Empty State */
          <div className="rounded-lg border border-dashed border-border p-8 text-center space-y-3">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No subscription plans created</p>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-0.5">
                Create your first subscription tier so subscribers can connect exchange keys and auto-execute your signals.
              </p>
            </div>
            {!isSuspended && (
              <Button
                size="sm"
                onClick={() => {
                  setEditingPlan(null);
                  setIsModalOpen(true);
                }}
                className="text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Create First Plan
              </Button>
            )}
          </div>
        ) : (
          /* Plans List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isArchived = String(plan.status).toLowerCase() === "archived";

              return (
                <div
                  key={plan.id}
                  className={`rounded-xl border p-4 space-y-3 transition-all ${
                    isArchived
                      ? "border-border/60 bg-muted/30 opacity-70"
                      : "border-border bg-card hover:border-primary/40 shadow-xs"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-foreground line-clamp-1">
                        {plan.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {plan.max_duration_days} Days Cycle
                      </p>
                    </div>
                    {getStatusBadge(plan)}
                  </div>

                  {/* Pricing */}
                  <div className="pt-1">
                    <span className="text-lg font-black text-foreground">
                      {formatPrice(plan.monthly_price_cents, plan.currency)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">/ month</span>
                  </div>

                  {/* Description */}
                  {plan.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2rem]">
                      {plan.description}
                    </p>
                  )}

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-border/80">
                    <span className="text-[10px] text-muted-foreground uppercase font-mono">
                      {plan.currency}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {!isArchived && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingPlan(plan);
                              setIsModalOpen(true);
                            }}
                            disabled={isSuspended}
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <Edit2 className="h-3 w-3 mr-1" />
                            Edit
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeactivatingId(plan.id)}
                            disabled={isSuspended}
                            className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Deactivate
                          </Button>
                        </>
                      )}
                      {isArchived && (
                        <span className="text-[11px] text-muted-foreground italic">
                          Archived (Locked)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      {/* Plan Modal (Create & Edit) */}
      <ProviderPlanModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPlan(null);
        }}
        onSuccess={handlePlanSaved}
        existingPlans={plans}
        planToEdit={editingPlan}
        activeCount={activePlansCount}
      />

      {/* Confirm Before Deactivate Modal */}
      {deactivatingId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-150"
        >
          <div className="relative w-full max-w-md rounded-xl border border-destructive/30 bg-card p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Deactivate Subscription Plan?</h3>
                <p className="text-xs text-muted-foreground">Action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Deactivating will archive this plan and hide it from the public catalog. Existing active subscribers will keep their automated execution access until their current billing period ends.
            </p>

            {deactivateError && (
              <div className="p-2.5 rounded-md bg-destructive/10 border border-destructive/20 text-xs text-destructive">
                {deactivateError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setDeactivatingId(null);
                  setDeactivateError(null);
                }}
                disabled={isDeactivating}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeactivate}
                disabled={isDeactivating}
                className="flex items-center gap-1.5"
              >
                {isDeactivating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Archiving...</span>
                  </>
                ) : (
                  <span>Confirm Deactivation</span>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
