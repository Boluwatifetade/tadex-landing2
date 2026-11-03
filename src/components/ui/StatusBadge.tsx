import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 caption-4 transition-colors",
  {
    variants: {
      variant: {
        fresh:
          "bg-status-success/10 text-status-success border-status-success/30",
        success:
          "bg-status-success/10 text-status-success border-status-success/30",
        syncing:
          "bg-brand-accentSubtle text-brand-accent border-brand-accent/30",
        brand:
          "bg-brand-accentSubtle text-brand-accent border-brand-accent/30",
        stale:
          "bg-status-warning/10 text-status-warning border-status-warning/30",
        degraded:
          "bg-status-warning/10 text-status-warning border-status-warning/30",
        warning:
          "bg-status-warning/10 text-status-warning border-status-warning/30",
        danger:
          "bg-status-danger/10 text-status-danger border-status-danger/30",
        error:
          "bg-status-danger/10 text-status-danger border-status-danger/30",
        disconnected:
          "bg-surface-secondary text-content-tertiary border-surface-elevated",
        neutral:
          "bg-surface-secondary text-content-secondary border-surface-elevated",
      },
      size: {
        sm: "px-2 py-0.5 caption-5",
        default: "px-2.5 py-0.5 caption-4",
        lg: "px-3 py-1 caption-3",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "default",
    },
  }
);

const dotVariants: Record<
  NonNullable<VariantProps<typeof statusBadgeVariants>["variant"]>,
  string
> = {
  fresh: "bg-status-success",
  success: "bg-status-success",
  syncing: "bg-brand-accent animate-pulse",
  brand: "bg-brand-accent",
  stale: "bg-status-warning",
  degraded: "bg-status-warning",
  warning: "bg-status-warning",
  danger: "bg-status-danger",
  error: "bg-status-danger",
  disconnected: "bg-content-muted",
  neutral: "bg-content-tertiary",
};

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  showDot?: boolean;
  pulse?: boolean;
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  (
    {
      className,
      variant = "neutral",
      size = "default",
      showDot = true,
      pulse = false,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedVariant = variant ?? "neutral";
    return (
      <span
        ref={ref}
        data-status={resolvedVariant}
        className={cn(statusBadgeVariants({ variant, size }), className)}
        {...props}
      >
        {showDot && (
          <span
            aria-hidden="true"
            className={cn(
              "h-1.5 w-1.5 rounded-full shrink-0",
              dotVariants[resolvedVariant],
              pulse && "animate-pulse"
            )}
          />
        )}
        <span>{children}</span>
      </span>
    );
  }
);

StatusBadge.displayName = "StatusBadge";

export { statusBadgeVariants };
