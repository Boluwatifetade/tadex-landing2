'use client';

import {
  CheckCircleIcon,
  ShieldCheckIcon,
  ClockIcon,
} from '@/components/ui/PhosphorIcons';

export default function ExchangeTrustStrip() {
  return (
    <section
      aria-label="Exchange compatibility and security"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
    >
      <div className="bg-surface-primary border border-surface-elevated rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Column 1: Bybit Integration */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-accentSubtle border border-brand-accent/30 flex items-center justify-center text-brand-accent flex-shrink-0">
            <CheckCircleIcon size={22} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="title-2 text-content-primary">Bybit Integration</h3>
              <span className="caption-3 px-2 py-0.5 rounded bg-brand-accentSubtle text-brand-accent border border-brand-accent/40 font-mono">
                AVAILABLE
              </span>
            </div>
            <p className="body-6 text-content-secondary">
              Bybit API integration tested for USDT Perpetuals and Futures execution.
            </p>
          </div>
        </div>

        {/* Column 2: Binance & OKX Roadmap */}
        <div className="flex items-start gap-4 border-t md:border-t-0 md:border-l border-surface-elevated pt-4 md:pt-0 md:pl-6">
          <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-surface-elevated flex items-center justify-center text-content-tertiary flex-shrink-0">
            <ClockIcon size={22} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="title-2 text-content-primary">Binance & OKX</h3>
              <span className="caption-3 px-2 py-0.5 rounded bg-surface-subtle text-content-tertiary border border-surface-elevated font-mono">
                PLANNED
              </span>
            </div>
            <p className="body-6 text-content-secondary">
              Planned integrations underway for upcoming platform releases.
            </p>
          </div>
        </div>

        {/* Column 3: Security & Non-Custodial Architecture */}
        <div className="flex items-start gap-4 border-t md:border-t-0 md:border-l border-surface-elevated pt-4 md:pt-0 md:pl-6">
          <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-surface-elevated flex items-center justify-center text-brand-accent flex-shrink-0">
            <ShieldCheckIcon size={22} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="title-2 text-content-primary">Non-Custodial Scope</h3>
            </div>
            <p className="body-6 text-content-secondary">
              API credentials are encrypted at rest using Fernet-based symmetric encryption. Tadex requires exchange read and trading permissions, with withdrawal permissions disabled.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
