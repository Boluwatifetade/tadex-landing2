'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  LightningIcon,
  LockIcon,
} from '@/components/ui/PhosphorIcons';

export default function FinalCTA() {
  return (
    <section className="relative bg-surface-canvas text-content-primary py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="bg-surface-primary border border-surface-elevated rounded-2xl p-8 sm:p-12 lg:p-16">
            <div className="max-w-[680px]">
              {/* Headline */}
              <h2 className="heading-2 text-content-primary mb-4">
                Ready to Stop Copying Trades Manually?
              </h2>

              {/* Subheadline */}
              <p className="title-1 text-content-secondary mb-8">
                Automate your signal execution directly on your Bybit account with disciplined risk sizing and zero withdrawal permissions.
              </p>

              {/* Primary CTA Button */}
              <div className="flex flex-col items-start mb-8">
                <Link href="/register">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-lg px-8 py-4 rounded-xl transition-[background-color,transform] duration-300 ease-weighted hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-primary shadow-xs"
                  >
                    <span>Start Free. No Credit Card.</span>
                    <ArrowRightIcon size={20} />
                  </button>
                </Link>
                <span className="caption-4 text-content-tertiary mt-2">
                  Includes 12 automated trades each month on Free · Fast web onboarding
                </span>
              </div>

              <div className="h-px bg-surface-elevated mb-6" />

              {/* Trust Line */}
              <div className="flex flex-wrap items-center gap-6 caption-1 text-content-tertiary">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon size={16} className="text-brand-accent" />
                  <span>Non-custodial (trade-only API)</span>
                </div>
                <div className="flex items-center gap-2">
                  <LockIcon size={16} className="text-brand-accent" />
                  <span>Fernet encrypted credentials</span>
                </div>
                <div className="flex items-center gap-2">
                  <LightningIcon size={16} className="text-brand-accent" />
                  <span>Bybit execution engine</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}