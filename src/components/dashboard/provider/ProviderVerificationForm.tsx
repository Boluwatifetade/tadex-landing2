"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { VerificationRequestResponse } from "@/types/provider";
import {
  Loader2,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  Info,
  X,
} from "lucide-react";

const MARKETS_OPTIONS = ["Crypto Futures", "Crypto Spot", "Forex", "Indices", "Commodities"];
const EXCHANGES_OPTIONS = ["Bybit", "Binance", "OKX", "Bitget", "KuCoin", "MetaTrader 4/5"];

const historicalSignalSchema = z.object({
  symbol: z.string().min(1, "Pair/Symbol required (e.g. BTCUSDT)"),
  entry: z.string().min(1, "Entry price required"),
  stop_loss: z.string().min(1, "Stop loss required"),
  take_profit: z.string().min(1, "Take profit target required"),
  datetime: z.string().min(1, "Date/time issued required"),
  result: z.string().optional(),
  original_message_link: z.string().optional(),
});

const verificationSchema = z.object({
  // Section 1: Identity
  full_name: z.string().min(1, "Full legal or operator name is required"),
  telegram_username: z.string().min(1, "Telegram handle is required (e.g. @username)"),
  telegram_channel_link: z.string().min(1, "Telegram channel link is required"),
  email: z.string().email("Valid official contact email required"),
  country_region: z.string().min(1, "Country / Operating region required"),
  display_name: z.string().min(1, "Public brand display name required"),
  service_description: z.string().min(1, "Service description and strategy details required"),

  // Section 2: Signal Operation
  approx_subscriber_count: z
    .number({ message: "Subscriber count must be a number" })
    .min(0, "Subscriber count cannot be negative"),
  time_providing_signals: z.string().min(1, "Duration providing signals required (e.g. 1 year)"),
  markets_traded: z.array(z.string()).min(1, "Select at least one market"),
  exchanges_supported: z.array(z.string()).min(1, "Select at least one supported exchange"),
  manual_or_automated: z.string().min(1, "Select signal generation model"),
  typical_signal_frequency: z.string().min(1, "Typical signal frequency required (e.g. 2-4 signals/day)"),

  // Section 3: Trading Evidence (Optional)
  exchange_name: z.string().optional(),
  exchange_uid: z.string().optional(),
  trading_profile_link: z.string().optional(),
  performance_report_link: z.string().optional(),
  third_party_performance_link: z.string().optional(),

  // Section 4: Historical Signals (3-10)
  historical_signals: z
    .array(historicalSignalSchema)
    .min(3, "At least 3 historical signal samples are required for verification")
    .max(10, "Maximum of 10 historical signal samples allowed"),

  // Section 5: Declarations (All 5 Required)
  owns_channel: z.boolean().refine((v) => v === true, {
    message: "You must confirm you own and operate the channel",
  }),
  info_accurate: z.boolean().refine((v) => v === true, {
    message: "You must confirm all submitted information is accurate",
  }),
  understands_no_guarantee: z.boolean().refine((v) => v === true, {
    message: "You must acknowledge verification does not guarantee returns",
  }),
  agrees_to_rules: z.boolean().refine((v) => v === true, {
    message: "You must agree to platform provider rules and code of conduct",
  }),
  no_fabricated_results: z.boolean().refine((v) => v === true, {
    message: "You must declare that no historical results are fabricated",
  }),
});

type VerificationFormValues = z.infer<typeof verificationSchema>;

interface ProviderVerificationFormProps {
  initialDisplayName?: string;
  initialEmail?: string;
  onSuccess: (res: VerificationRequestResponse) => void;
  onCancel?: () => void;
}

export default function ProviderVerificationForm({
  initialDisplayName = "",
  initialEmail = "",
  onSuccess,
  onCancel,
}: ProviderVerificationFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      full_name: "",
      telegram_username: "",
      telegram_channel_link: "",
      email: initialEmail,
      country_region: "",
      display_name: initialDisplayName,
      service_description: "",
      approx_subscriber_count: 0,
      time_providing_signals: "1 year",
      markets_traded: ["Crypto Futures"],
      exchanges_supported: ["Bybit"],
      manual_or_automated: "manual",
      typical_signal_frequency: "2-3 signals per day",
      exchange_name: "",
      exchange_uid: "",
      trading_profile_link: "",
      performance_report_link: "",
      third_party_performance_link: "",
      historical_signals: [
        {
          symbol: "BTCUSDT",
          entry: "64500",
          stop_loss: "63200",
          take_profit: "67000",
          datetime: "2026-08-01 14:00 UTC",
          result: "TP hit (+3.8%)",
          original_message_link: "",
        },
        {
          symbol: "ETHUSDT",
          entry: "3450",
          stop_loss: "3380",
          take_profit: "3600",
          datetime: "2026-08-05 09:30 UTC",
          result: "TP hit (+4.3%)",
          original_message_link: "",
        },
        {
          symbol: "SOLUSDT",
          entry: "185",
          stop_loss: "178",
          take_profit: "200",
          datetime: "2026-08-10 16:15 UTC",
          result: "TP hit (+8.1%)",
          original_message_link: "",
        },
      ],
      owns_channel: false,
      info_accurate: false,
      understands_no_guarantee: false,
      agrees_to_rules: false,
      no_fabricated_results: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "historical_signals",
  });

  const selectedMarkets = watch("markets_traded") || [];
  const selectedExchanges = watch("exchanges_supported") || [];

  const toggleMarket = (opt: string) => {
    if (selectedMarkets.includes(opt)) {
      setValue(
        "markets_traded",
        selectedMarkets.filter((m) => m !== opt),
        { shouldValidate: true }
      );
    } else {
      setValue("markets_traded", [...selectedMarkets, opt], { shouldValidate: true });
    }
  };

  const toggleExchange = (opt: string) => {
    if (selectedExchanges.includes(opt)) {
      setValue(
        "exchanges_supported",
        selectedExchanges.filter((e) => e !== opt),
        { shouldValidate: true }
      );
    } else {
      setValue("exchanges_supported", [...selectedExchanges, opt], { shouldValidate: true });
    }
  };

  const onSubmit = async (values: VerificationFormValues) => {
    setSubmitting(true);
    setServerError(null);

    const payload = {
      identity: {
        full_name: values.full_name.trim(),
        telegram_username: values.telegram_username.trim(),
        telegram_channel_link: values.telegram_channel_link.trim(),
        email: values.email.trim(),
        country_region: values.country_region.trim(),
        display_name: values.display_name.trim(),
        service_description: values.service_description.trim(),
      },
      signal_operation: {
        telegram_channel_link: values.telegram_channel_link.trim(),
        approx_subscriber_count: Math.max(0, values.approx_subscriber_count),
        time_providing_signals: values.time_providing_signals.trim(),
        markets_traded: values.markets_traded,
        exchanges_supported: values.exchanges_supported,
        manual_or_automated: values.manual_or_automated,
        typical_signal_frequency: values.typical_signal_frequency.trim(),
      },
      trading_evidence: {
        exchange_name: values.exchange_name?.trim() || undefined,
        exchange_uid: values.exchange_uid?.trim() || undefined,
        trading_profile_link: values.trading_profile_link?.trim() || undefined,
        performance_report_link: values.performance_report_link?.trim() || undefined,
        third_party_performance_link: values.third_party_performance_link?.trim() || undefined,
      },
      historical_signals: values.historical_signals.map((s) => ({
        symbol: s.symbol.trim(),
        entry: s.entry.trim(),
        stop_loss: s.stop_loss.trim(),
        take_profit: s.take_profit.trim(),
        datetime: s.datetime.trim(),
        result: s.result?.trim() || undefined,
        original_message_link: s.original_message_link?.trim() || undefined,
      })),
      declarations: {
        owns_channel: values.owns_channel,
        info_accurate: values.info_accurate,
        understands_no_guarantee: values.understands_no_guarantee,
        agrees_to_rules: values.agrees_to_rules,
        no_fabricated_results: values.no_fabricated_results,
      },
    };

    try {
      const res = await apiClient<VerificationRequestResponse>("/provider/request-verification", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      onSuccess(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit verification request";
      setServerError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border-border bg-card shadow-sm max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Request Provider Verification</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Earn the verified badge, unlock higher visibility in the catalog, and build subscriber trust.
              </CardDescription>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {serverError && (
          <div
            role="alert"
            className="mb-6 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive"
          >
            <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* SECTION 1: OPERATOR IDENTITY */}
          <div className="space-y-4">
            <div className="border-b border-border pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Section 1: Operator Identity
              </h3>
              <p className="text-xs text-muted-foreground">
                Provide your operator identification and channel contact details.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Full Legal / Operator Name <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. John Doe"
                  {...register("full_name")}
                  disabled={submitting}
                  className={errors.full_name ? "border-destructive" : ""}
                />
                {errors.full_name && (
                  <p className="mt-1 text-xs text-destructive">{errors.full_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Telegram Username <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. @alpha_trader"
                  {...register("telegram_username")}
                  disabled={submitting}
                  className={errors.telegram_username ? "border-destructive" : ""}
                />
                {errors.telegram_username && (
                  <p className="mt-1 text-xs text-destructive">{errors.telegram_username.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Telegram Channel / Group Link <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. https://t.me/alphatradingchannel"
                  {...register("telegram_channel_link")}
                  disabled={submitting}
                  className={errors.telegram_channel_link ? "border-destructive" : ""}
                />
                {errors.telegram_channel_link && (
                  <p className="mt-1 text-xs text-destructive">{errors.telegram_channel_link.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Official Email <span className="text-destructive">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="provider@example.com"
                  {...register("email")}
                  disabled={submitting}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Country / Operating Region <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. Nigeria, Kenya, Ghana, Global"
                  {...register("country_region")}
                  disabled={submitting}
                  className={errors.country_region ? "border-destructive" : ""}
                />
                {errors.country_region && (
                  <p className="mt-1 text-xs text-destructive">{errors.country_region.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Public Brand Display Name <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. Apex Alpha Trading"
                  {...register("display_name")}
                  disabled={submitting}
                  className={errors.display_name ? "border-destructive" : ""}
                />
                {errors.display_name && (
                  <p className="mt-1 text-xs text-destructive">{errors.display_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Trading Service & Strategy Overview <span className="text-destructive">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Explain your methodology (e.g. Price action, ICT, swing vs scalping, strict 1:2 R:R)."
                {...register("service_description")}
                disabled={submitting}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              {errors.service_description && (
                <p className="mt-1 text-xs text-destructive">{errors.service_description.message}</p>
              )}
            </div>
          </div>

          {/* SECTION 2: SIGNAL OPERATION */}
          <div className="space-y-4">
            <div className="border-b border-border pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Section 2: Signal Operation
              </h3>
              <p className="text-xs text-muted-foreground">
                Operational details of how you publish and execute signals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Approx. Subscriber Count <span className="text-destructive">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 1500"
                  {...register("approx_subscriber_count", { valueAsNumber: true })}
                  disabled={submitting}
                  className={errors.approx_subscriber_count ? "border-destructive" : ""}
                />
                {errors.approx_subscriber_count && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.approx_subscriber_count.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Time Providing Signals <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. 2 years, 6 months"
                  {...register("time_providing_signals")}
                  disabled={submitting}
                  className={errors.time_providing_signals ? "border-destructive" : ""}
                />
                {errors.time_providing_signals && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.time_providing_signals.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Signal Generation Model <span className="text-destructive">*</span>
                </label>
                <select
                  {...register("manual_or_automated")}
                  disabled={submitting}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="manual">Manual (Discretionary Trader)</option>
                  <option value="automated">Automated (Algorithmic / Bot)</option>
                  <option value="hybrid">Hybrid (Algo-assisted Manual Entry)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Typical Signal Frequency <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="e.g. 1-3 signals per day"
                  {...register("typical_signal_frequency")}
                  disabled={submitting}
                  className={errors.typical_signal_frequency ? "border-destructive" : ""}
                />
                {errors.typical_signal_frequency && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.typical_signal_frequency.message}
                  </p>
                )}
              </div>
            </div>

            {/* Markets Traded */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Markets Traded <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {MARKETS_OPTIONS.map((opt) => {
                  const isSelected = selectedMarkets.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleMarket(opt)}
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
              {errors.markets_traded && (
                <p className="mt-1 text-xs text-destructive">{errors.markets_traded.message}</p>
              )}
            </div>

            {/* Exchanges Supported */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Exchanges Supported <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {EXCHANGES_OPTIONS.map((opt) => {
                  const isSelected = selectedExchanges.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleExchange(opt)}
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
              {errors.exchanges_supported && (
                <p className="mt-1 text-xs text-destructive">{errors.exchanges_supported.message}</p>
              )}
            </div>
          </div>

          {/* SECTION 3: TRADING EVIDENCE (OPTIONAL) */}
          <div className="space-y-4">
            <div className="border-b border-border pb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Section 3: Trading Evidence
                </h3>
                <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                  Optional
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                External links to your exchange leaderboard, copy trading profile, or Myfxbook statement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Exchange Name
                </label>
                <Input
                  placeholder="e.g. Bybit"
                  {...register("exchange_name")}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Exchange UID
                </label>
                <Input
                  placeholder="e.g. 19283746"
                  {...register("exchange_uid")}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Copy Trading / Profile Link
                </label>
                <Input
                  placeholder="e.g. https://www.bybit.com/copyTrade/..."
                  {...register("trading_profile_link")}
                  disabled={submitting}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Third-Party Performance Link (Myfxbook/TradingView)
                </label>
                <Input
                  placeholder="e.g. https://www.myfxbook.com/members/..."
                  {...register("third_party_performance_link")}
                  disabled={submitting}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: HISTORICAL SIGNALS (REPEATABLE, 3-10) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                  Section 4: Historical Signal Records
                </h3>
                <p className="text-xs text-muted-foreground">
                  Provide between 3 to 10 verifiable past signals issued in your channel (Current:{" "}
                  {fields.length}/10).
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    symbol: "",
                    entry: "",
                    stop_loss: "",
                    take_profit: "",
                    datetime: "",
                    result: "",
                    original_message_link: "",
                  })
                }
                disabled={submitting || fields.length >= 10}
                className="text-xs"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add Signal Sample
              </Button>
            </div>

            {errors.historical_signals && (
              <p className="text-xs text-destructive font-medium">
                {errors.historical_signals.message ||
                  (errors.historical_signals.root && errors.historical_signals.root.message)}
              </p>
            )}

            <div className="space-y-3">
              {fields.map((field, idx) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-border bg-muted/20 p-3.5 space-y-3 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground">Signal #{idx + 1}</span>
                    {fields.length > 3 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(idx)}
                        disabled={submitting}
                        className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-muted-foreground mb-0.5">
                        Symbol/Pair *
                      </label>
                      <Input
                        placeholder="BTCUSDT"
                        {...register(`historical_signals.${idx}.symbol` as const)}
                        disabled={submitting}
                        className="h-8 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-muted-foreground mb-0.5">
                        Entry Price *
                      </label>
                      <Input
                        placeholder="65000"
                        {...register(`historical_signals.${idx}.entry` as const)}
                        disabled={submitting}
                        className="h-8 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-muted-foreground mb-0.5">
                        Stop Loss *
                      </label>
                      <Input
                        placeholder="64000"
                        {...register(`historical_signals.${idx}.stop_loss` as const)}
                        disabled={submitting}
                        className="h-8 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-muted-foreground mb-0.5">
                        Take Profit *
                      </label>
                      <Input
                        placeholder="68000"
                        {...register(`historical_signals.${idx}.take_profit` as const)}
                        disabled={submitting}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-muted-foreground mb-0.5">
                        Date & Time Issued *
                      </label>
                      <Input
                        placeholder="2026-08-01 12:00 UTC"
                        {...register(`historical_signals.${idx}.datetime` as const)}
                        disabled={submitting}
                        className="h-8 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-muted-foreground mb-0.5">
                        Trade Outcome / Result
                      </label>
                      <Input
                        placeholder="TP hit (+4.5%)"
                        {...register(`historical_signals.${idx}.result` as const)}
                        disabled={submitting}
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: DECLARATIONS (ALL 5 MANDATORY) */}
          <div className="space-y-3 border-t border-border pt-4">
            <div className="border-b border-border pb-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
                Section 5: Affirmations & Declarations
              </h3>
              <p className="text-xs text-muted-foreground">
                All declarations must be explicitly checked and affirmed before submitting your request.
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("owns_channel")}
                  disabled={submitting}
                  className="h-4 w-4 mt-0.5 rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-xs text-foreground leading-relaxed">
                  1. I confirm I own and control the signal channel and brand represented in this application.
                </span>
              </label>
              {errors.owns_channel && (
                <p className="text-xs text-destructive pl-6">{errors.owns_channel.message}</p>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("info_accurate")}
                  disabled={submitting}
                  className="h-4 w-4 mt-0.5 rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-xs text-foreground leading-relaxed">
                  2. I confirm all submitted operational details, links, and data are accurate and verifiable.
                </span>
              </label>
              {errors.info_accurate && (
                <p className="text-xs text-destructive pl-6">{errors.info_accurate.message}</p>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("understands_no_guarantee")}
                  disabled={submitting}
                  className="h-4 w-4 mt-0.5 rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-xs text-foreground leading-relaxed">
                  3. I understand that platform verification does not guarantee subscriber trading returns or eliminate market risks.
                </span>
              </label>
              {errors.understands_no_guarantee && (
                <p className="text-xs text-destructive pl-6">
                  {errors.understands_no_guarantee.message}
                </p>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("agrees_to_rules")}
                  disabled={submitting}
                  className="h-4 w-4 mt-0.5 rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-xs text-foreground leading-relaxed">
                  4. I agree to the platform provider code of conduct, non-custodial execution standards, and moderation guidelines.
                </span>
              </label>
              {errors.agrees_to_rules && (
                <p className="text-xs text-destructive pl-6">{errors.agrees_to_rules.message}</p>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("no_fabricated_results")}
                  disabled={submitting}
                  className="h-4 w-4 mt-0.5 rounded border-input text-primary focus:ring-primary"
                />
                <span className="text-xs text-foreground leading-relaxed">
                  5. I declare that no historical results, win rates, or signal samples in this request are fabricated.
                </span>
              </label>
              {errors.no_fabricated_results && (
                <p className="text-xs text-destructive pl-6">
                  {errors.no_fabricated_results.message}
                </p>
              )}
            </div>
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
                  <span>Submitting Evidence...</span>
                </>
              ) : (
                <>
                  <span>Submit Verification Request</span>
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
