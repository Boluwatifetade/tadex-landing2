"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProviderPlanOut } from "@/types/provider";
import { Loader2, AlertTriangle, X, CheckCircle2 } from "lucide-react";

const ALLOWED_DURATIONS = [
  { value: 30, label: "30 Days (1 Month)" },
  { value: 90, label: "90 Days (3 Months)" },
  { value: 180, label: "180 Days (6 Months)" },
  { value: 365, label: "365 Days (1 Year)" },
];

const CURRENCY_OPTIONS = ["NGN", "USDT", "USD"];

const planSchema = z.object({
  name: z
    .string()
    .min(1, "Plan name is required")
    .max(100, "Plan name must be 100 characters or fewer"),
  description: z.string().max(500, "Description must be 500 characters or fewer").optional(),
  monthly_price: z
    .number({ message: "Price must be a valid number" })
    .min(0, "Price cannot be negative"),
  currency: z.string().min(1, "Please select a currency"),
  max_duration_days: z.number().refine((val) => [30, 90, 180, 365].includes(val), {
    message: "Duration must be 30, 90, 180, or 365 days",
  }),
  status: z.enum(["active", "draft", "paused", "archived"]),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface ProviderPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (plan: ProviderPlanOut) => void;
  existingPlans: ProviderPlanOut[];
  planToEdit?: ProviderPlanOut | null;
  activeCount: number;
}

export default function ProviderPlanModal({
  isOpen,
  onClose,
  onSuccess,
  existingPlans,
  planToEdit = null,
  activeCount,
}: ProviderPlanModalProps) {
  const isEditing = Boolean(planToEdit);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      name: "",
      description: "",
      monthly_price: 0,
      currency: "NGN",
      max_duration_days: 30,
      status: "active",
    },
  });

  useEffect(() => {
    if (planToEdit) {
      reset({
        name: planToEdit.name,
        description: planToEdit.description || "",
        monthly_price: planToEdit.monthly_price_cents / 100,
        currency: planToEdit.currency || "NGN",
        max_duration_days: planToEdit.max_duration_days || 30,
        status: (planToEdit.status as any) || (planToEdit.is_active ? "active" : "paused"),
      });
    } else {
      reset({
        name: "",
        description: "",
        monthly_price: 0,
        currency: "NGN",
        max_duration_days: 30,
        status: activeCount >= 3 ? "draft" : "active",
      });
    }
    setServerError(null);
  }, [planToEdit, isOpen, reset, activeCount]);

  if (!isOpen) return null;

  const currentName = watch("name") || "";
  const currentStatus = watch("status");

  // Proactive duplicate name check against other plans
  const isDuplicateName = existingPlans.some((p) => {
    if (isEditing && p.id === planToEdit?.id) return false;
    return p.name.trim().toLowerCase() === currentName.trim().toLowerCase();
  });

  // Active plans limit check: If toggling to active and active count >= 3
  const isActivatingOverLimit =
    currentStatus === "active" &&
    (!isEditing || !planToEdit?.is_active) &&
    activeCount >= 3;

  const onSubmit = async (values: PlanFormValues) => {
    if (isDuplicateName) {
      setServerError("A plan with this name already exists. Please choose a unique name.");
      return;
    }

    if (isActivatingOverLimit) {
      setServerError("You have reached the limit of 3 active plans. Save as draft or pause another plan.");
      return;
    }

    setSubmitting(true);
    setServerError(null);

    const priceCents = Math.round(values.monthly_price * 100);
    const isPlanActive = values.status === "active";

    try {
      let result: ProviderPlanOut;
      if (isEditing && planToEdit) {
        result = await apiClient<ProviderPlanOut>(`/provider/plans/${planToEdit.id}`, {
          method: "PUT",
          body: JSON.stringify({
            name: values.name.trim(),
            description: values.description?.trim() || null,
            monthly_price_cents: priceCents,
            currency: values.currency,
            max_duration_days: values.max_duration_days,
            status: values.status,
            is_active: isPlanActive,
          }),
        });
      } else {
        result = await apiClient<ProviderPlanOut>("/provider/plans", {
          method: "POST",
          body: JSON.stringify({
            name: values.name.trim(),
            description: values.description?.trim() || null,
            monthly_price_cents: priceCents,
            currency: values.currency,
            max_duration_days: values.max_duration_days,
            status: values.status,
            is_active: isPlanActive,
          }),
        });
      }

      onSuccess(result);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save plan";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0 duration-150"
    >
      <div className="relative w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {isEditing ? "Edit Subscription Plan" : "Create New Subscription Plan"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEditing
                ? "Update pricing, duration, or description for your signal plan."
                : "Define a subscription tier for your signals."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Active limit warning inside modal */}
        {isActivatingOverLimit && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-600 dark:text-amber-400"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              Active plan limit reached (3/3). You can save this plan as <strong>Draft</strong> or <strong>Paused</strong>.
            </span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Plan Name */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Plan Name <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g. VIP Futures Signals"
              {...register("name")}
              disabled={submitting}
              className={errors.name || isDuplicateName ? "border-destructive" : ""}
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
            {isDuplicateName && (
              <p className="mt-1 text-xs text-amber-500 font-medium">
                ⚠️ A plan with this name already exists.
              </p>
            )}
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1">
                Monthly Price <span className="text-destructive">*</span>
              </label>
              <Input
                type="number"
                step="any"
                placeholder="e.g. 5000"
                {...register("monthly_price", { valueAsNumber: true })}
                disabled={submitting}
                className={errors.monthly_price ? "border-destructive" : ""}
              />
              {errors.monthly_price && (
                <p className="mt-1 text-xs text-destructive">{errors.monthly_price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Currency <span className="text-destructive">*</span>
              </label>
              <select
                {...register("currency")}
                disabled={submitting}
                className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration Cycle */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Duration Cycle <span className="text-destructive">*</span>
            </label>
            <select
              {...register("max_duration_days", { valueAsNumber: true })}
              disabled={submitting}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {ALLOWED_DURATIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            {errors.max_duration_days && (
              <p className="mt-1 text-xs text-destructive">{errors.max_duration_days.message}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Initial Status <span className="text-destructive">*</span>
            </label>
            <select
              {...register("status")}
              disabled={submitting}
              className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="active" disabled={isActivatingOverLimit}>
                Active (Publicly subscribable) {isActivatingOverLimit ? "- Cap Reached" : ""}
              </option>
              <option value="draft">Draft (Hidden from catalog)</option>
              <option value="paused">Paused (Temporarily closed)</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Plan Description <span className="text-muted-foreground text-xs">(Optional)</span>
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Daily scalping calls, 85% target win rate, 1-on-1 risk management."
              {...register("description")}
              disabled={submitting}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting || isDuplicateName || isActivatingOverLimit}
              className="flex items-center gap-1.5"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{isEditing ? "Save Changes" : "Create Plan"}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
