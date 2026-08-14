"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ProviderApplicationOut } from "@/types/provider";
import { Loader2, AlertTriangle, ShieldCheck, CheckCircle2, ArrowRight } from "lucide-react";

const TRADING_FOCUS_OPTIONS = [
  "Crypto Futures",
  "Crypto Spot",
  "Forex",
  "Swing Trading",
  "Scalping",
  "DeFi / Yield",
];

const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1-3 years",
  "3+ years",
  "Professional / Fund Manager",
];

const REFERRAL_OPTIONS = [
  "Telegram",
  "Twitter / X",
  "YouTube",
  "Friend / Trader Referral",
  "Web Search",
  "Other",
];

const applySchema = z.object({
  display_name: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name must be 100 characters or fewer"),
  contact_email: z.string().email("Please enter a valid email address"),
  bio: z.string().max(500, "Bio must be 500 characters or fewer").optional(),
  experience_level: z.string().min(1, "Please select your trading experience level"),
  trading_focus: z.array(z.string()).min(1, "Select at least one trading focus area"),
  referral_source: z.string().min(1, "Please select how you heard about Tadex"),
  terms_accepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the Provider Terms of Service to apply",
  }),
});

type ApplyFormValues = z.infer<typeof applySchema>;

interface ProviderApplyFormProps {
  initialEmail?: string;
  onSuccess: (application: ProviderApplicationOut) => void;
  onCancel?: () => void;
}

export default function ProviderApplyForm({
  initialEmail = "",
  onSuccess,
  onCancel,
}: ProviderApplyFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [is409Conflict, setIs409Conflict] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      display_name: "",
      contact_email: initialEmail,
      bio: "",
      experience_level: "1-3 years",
      trading_focus: ["Crypto Futures"],
      referral_source: "Telegram",
      terms_accepted: false,
    },
  });

  const selectedFocus = watch("trading_focus") || [];

  const toggleFocus = (option: string) => {
    if (selectedFocus.includes(option)) {
      setValue(
        "trading_focus",
        selectedFocus.filter((item) => item !== option),
        { shouldValidate: true }
      );
    } else {
      setValue("trading_focus", [...selectedFocus, option], {
        shouldValidate: true,
      });
    }
  };

  const onSubmit = async (values: ApplyFormValues) => {
    setSubmitting(true);
    setServerError(null);
    setIs409Conflict(false);

    try {
      const res = await apiClient<ProviderApplicationOut>("/provider/apply", {
        method: "POST",
        body: JSON.stringify({
          display_name: values.display_name.trim(),
          contact_email: values.contact_email.trim(),
          bio: values.bio?.trim() || null,
          experience_level: values.experience_level,
          trading_focus: values.trading_focus,
          referral_source: values.referral_source,
          terms_accepted: true,
        }),
      });

      onSuccess(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit provider application";
      setServerError(msg);

      if (
        msg.toLowerCase().includes("already registered") ||
        msg.toLowerCase().includes("already has a provider application") ||
        msg.toLowerCase().includes("conflict")
      ) {
        setIs409Conflict(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-border bg-card shadow-sm max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Apply as a Signal Provider</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Monetize your trading expertise and distribute automated signals to retail traders.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {is409Conflict ? (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 text-amber-600 dark:text-amber-400 space-y-2"
          >
            <div className="flex items-center gap-2 font-semibold">
              <AlertTriangle className="h-5 w-5 shrink-0" />
              <span>Application or Provider Profile Already Exists</span>
            </div>
            <p className="text-sm">
              {serverError ||
                "You already have an active provider profile or an application under administrative review."}
            </p>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="text-xs"
              >
                Refresh Portal Status
              </Button>
            </div>
          </div>
        ) : serverError ? (
          <div
            role="alert"
            className="mb-6 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive"
          >
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        ) : null}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Provider / Brand Display Name <span className="text-destructive">*</span>
            </label>
            <Input
              placeholder="e.g. Apex Crypto Alpha"
              {...register("display_name")}
              disabled={submitting}
              className={errors.display_name ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.display_name && (
              <p className="mt-1 text-xs text-destructive">{errors.display_name.message}</p>
            )}
          </div>

          {/* Contact Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Contact Email <span className="text-destructive">*</span>
            </label>
            <Input
              type="email"
              placeholder="provider@example.com"
              {...register("contact_email")}
              disabled={submitting}
              className={errors.contact_email ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.contact_email && (
              <p className="mt-1 text-xs text-destructive">{errors.contact_email.message}</p>
            )}
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Trading Experience <span className="text-destructive">*</span>
            </label>
            <select
              {...register("experience_level")}
              disabled={submitting}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {EXPERIENCE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.experience_level && (
              <p className="mt-1 text-xs text-destructive">{errors.experience_level.message}</p>
            )}
          </div>

          {/* Trading Focus (Chips) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Trading Focus / Markets <span className="text-destructive">*</span>
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {TRADING_FOCUS_OPTIONS.map((opt) => {
                const isSelected = selectedFocus.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleFocus(opt)}
                    disabled={submitting}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted text-muted-foreground border-border hover:bg-muted/80"
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="inline h-3 w-3 mr-1" />}
                    {opt}
                  </button>
                );
              })}
            </div>
            {errors.trading_focus && (
              <p className="mt-1.5 text-xs text-destructive">{errors.trading_focus.message}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Strategy & Background Bio <span className="text-muted-foreground text-xs">(Optional)</span>
            </label>
            <textarea
              rows={3}
              placeholder="Tell subscribers about your trading methodology, risk management rules, and track record."
              {...register("bio")}
              disabled={submitting}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
            {errors.bio && <p className="mt-1 text-xs text-destructive">{errors.bio.message}</p>}
          </div>

          {/* Referral Source */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              How did you hear about Tadex? <span className="text-destructive">*</span>
            </label>
            <select
              {...register("referral_source")}
              disabled={submitting}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {REFERRAL_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            {errors.referral_source && (
              <p className="mt-1 text-xs text-destructive">{errors.referral_source.message}</p>
            )}
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="pt-2 border-t border-border">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...register("terms_accepted")}
                disabled={submitting}
                className="h-4 w-4 mt-0.5 rounded border-input text-primary focus:ring-primary"
              />
              <span className="text-xs text-muted-foreground leading-relaxed">
                I agree to the{" "}
                <span className="text-foreground font-medium underline">
                  Tadex Signal Provider Terms of Service (v1)
                </span>
                . I understand that provider accounts are non-custodial and signals must adhere to platform risk standards.
              </span>
            </label>
            {errors.terms_accepted && (
              <p className="mt-1 text-xs text-destructive">{errors.terms_accepted.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <span>Submit Application</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
