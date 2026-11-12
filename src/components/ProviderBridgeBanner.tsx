'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { BroadcastIcon, ArrowRightIcon } from '@/components/ui/PhosphorIcons';

export default function ProviderBridgeBanner() {
  return (
    <section className="py-12 bg-surface-canvas relative" aria-label="Signal Providers Bridge">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-2xl border border-surface-elevated bg-surface-primary p-8 sm:p-10 lg:p-12 transition-all duration-300 hover:border-surface-subtle">
            {/* Subtle background glow */}
            <div
              className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-brand-accent/5 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-surface-elevated bg-surface-subtle text-brand-accent caption-3">
                  <BroadcastIcon size={16} />
                  <span>FOR SIGNAL PROVIDERS & COMMUNITY LEADERS</span>
                </div>

                <h3 className="heading-3 text-content-primary tracking-tight">
                  Are you a Signal Provider?
                </h3>

                <p className="body-sm text-content-secondary leading-relaxed">
                  Monetize and automate your community with multi-currency subscriber billing (NGN, KES, GHS, USD), automated Telegram access control, and 90% revenue retention. Keep your trade edge while Tadex handles the infrastructure.
                </p>
              </div>

              <div className="flex-shrink-0">
                <Link
                  href="/for-providers"
                  className="inline-flex items-center justify-center gap-2.5 bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-md px-6 py-3.5 rounded-xl transition-[background-color,transform] duration-300 ease-weighted hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent shadow-xs"
                >
                  <span>Explore Tadex For Providers</span>
                  <ArrowRightIcon size={18} />
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
