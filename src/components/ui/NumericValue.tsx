import * as React from "react";
import { cn } from "@/lib/utils";

export type CurrencySymbol = "$" | "₦" | "KSh" | "GH₵" | "";

export interface NumericValueProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  /** Numeric value to format */
  value: number | null | undefined;
  /** Currency symbol prefix (e.g. "$", "₦", "KSh", "GH₵") */
  currency?: CurrencySymbol;
  /** Number of decimal places (defaults to 2) */
  decimals?: number;
  /** If true, prepends "+"/"-" and applies semantic status-success/status-danger colors */
  signed?: boolean;
  /** Optional suffix (e.g. "%", "x", " BTC") */
  suffix?: string;
  /** Fallback text when value is null/undefined/NaN/Infinity */
  fallback?: string;
  /** Visual scale preset */
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses: Record<NonNullable<NumericValueProps["size"]>, string> = {
  sm: "text-xs font-medium",
  md: "text-sm font-semibold",
  lg: "text-xl sm:text-2xl font-semibold tracking-tight",
  xl: "text-2xl sm:text-3xl font-semibold tracking-tight",
};

export const NumericValue = React.forwardRef<
  HTMLSpanElement,
  NumericValueProps
>(
  (
    {
      value,
      currency = "",
      decimals = 2,
      signed = false,
      suffix = "",
      fallback = "—",
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    if (value === null || value === undefined || !Number.isFinite(value)) {
      return (
        <span
          ref={ref}
          className={cn(
            "font-mono tabular-nums text-content-tertiary",
            sizeClasses[size],
            className
          )}
          {...props}
        >
          {fallback}
        </span>
      );
    }

    // Round to display precision first so sub-cent values like -0.0001 or -0 normalize to 0
    const factor = Math.pow(10, decimals);
    const rounded = Math.round(value * factor) / factor;
    const normalized = Object.is(rounded, -0) || Math.abs(rounded) === 0 ? 0 : rounded;

    const isPositive = normalized > 0;
    const isNegative = normalized < 0;
    const absFormatted = Math.abs(normalized).toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

    const signPrefix = signed
      ? isPositive
        ? "+"
        : isNegative
          ? "-"
          : ""
      : isNegative
        ? "-"
        : "";

    const semanticColor = signed
      ? isPositive
        ? "text-status-success"
        : isNegative
          ? "text-status-danger"
          : "text-content-secondary"
      : "text-content-primary";

    return (
      <span
        ref={ref}
        className={cn(
          "font-mono tabular-nums",
          sizeClasses[size],
          semanticColor,
          className
        )}
        {...props}
      >
        {signPrefix}
        {currency}
        {absFormatted}
        {suffix}
      </span>
    );
  }
);

NumericValue.displayName = "NumericValue";
