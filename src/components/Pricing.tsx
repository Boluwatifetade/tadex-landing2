'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  CheckIcon,
  LightningIcon,
  CrownIcon,
  ShieldCheckIcon,
  SparkleIcon,
  LockIcon,
} from '@/components/ui/PhosphorIcons';

interface PricingProps {
  onPlanSelect?: (plan: string) => void;
}

export default function Pricing({ onPlanSelect }: PricingProps) {
  return (
    <section className="py-20 lg:py-24 bg-surface-canvas relative" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          {/* Section Header */}
          <div className="max-w-[680px] mb-16">
            <h2 className="heading-2 text-content-primary mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="title-1 text-content-secondary">
              Pay only for what you use. Zero hidden transaction fees.
            </p>
          </div>

          {/* 2 Trader Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-5xl mx-auto mb-12">
            {/* Card 1: Free Tier */}
            <div className="bg-surface-primary rounded-2xl border border-surface-elevated p-8 flex flex-col justify-between transition-[background-color,transform] duration-500 ease-weighted hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-subtle border border-surface-elevated flex items-center justify-center text-content-secondary">
                    <LightningIcon size={24} />
                  </div>
                  <span className="caption-3 text-content-tertiary bg-surface-subtle px-3 py-1 rounded-full border border-surface-elevated">
                    Free Tier
                  </span>
                </div>

                <h3 className="heading-5 text-content-primary mb-1">Free</h3>
                <p className="caption-4 text-content-tertiary mb-6">
                  Best for: Trying automated execution and small trading setups
                </p>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="heading-3 text-content-primary">₦0</span>
                    <span className="body-5 text-content-tertiary">/ forever</span>
                  </div>
                  <p className="caption-4 text-content-tertiary mt-1">Forever free</p>
                </div>

                <div className="h-px bg-surface-elevated my-6" />

                <div className="mb-8">
                  <p className="caption-3 text-content-primary mb-4">Includes:</p>
                  <ul className="space-y-3 body-6 text-content-secondary">
                    <li className="flex items-start gap-3">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold text-content-primary">
                          12 automated trades
                        </strong>{' '}
                        per month across free communities
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>Connect your Bybit trade-only API key</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>Real-time execution logs & order history</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>Mandatory stop-loss enforcement on signal intake</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>Single Telegram pairing for execution notifications</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <Link href="/register" className="block w-full">
                  <button
                    type="button"
                    onClick={() => onPlanSelect?.('free')}
                    className="w-full bg-surface-secondary hover:bg-surface-elevated text-content-primary border border-surface-elevated py-3 px-4 button-md rounded-xl transition-[background-color,transform] duration-300 ease-weighted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                  >
                    Start Free. No Credit Card.
                  </button>
                </Link>
                <p className="caption-4 text-content-tertiary text-center mt-2">
                  No credit card required
                </p>
                <div className="h-px bg-surface-elevated my-4" />
                <p className="caption-5 text-content-tertiary text-center">
                  Paid VIP groups set their own subscription price with the provider. Tadex does not charge extra fees on signal copy volume.
                </p>
              </div>
            </div>

            {/* Card 2: Tadex Premium (Launch Offer) */}
            <div className="bg-surface-subtle text-content-primary rounded-2xl border border-brand-accent p-8 relative flex flex-col justify-between transition-[background-color,transform] duration-500 ease-weighted hover:-translate-y-1">
              {/* Most Popular Badge */}
              <div className="absolute -top-3 left-6 bg-brand-accent text-content-inverted px-3 py-1 rounded-full caption-3 flex items-center gap-1.5 shadow-xs">
                <SparkleIcon size={14} />
                <span>Most Popular</span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-6 mt-1">
                  <div className="w-12 h-12 rounded-xl bg-brand-accentSubtle border border-brand-accent/40 text-brand-accent flex items-center justify-center">
                    <CrownIcon size={24} />
                  </div>
                  <span className="caption-3 text-brand-accent bg-brand-accentSubtle border border-brand-accent/40 px-3 py-1 rounded-full">
                    Launch Special
                  </span>
                </div>

                <h3 className="heading-5 text-content-primary mb-1">
                  Tadex Premium
                </h3>
                <p className="caption-4 text-content-secondary mb-6">
                  Best for: Active traders following multiple channels with custom risk sizing
                </p>

                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="title-2 text-content-tertiary line-through">
                      ₦10,000
                    </span>
                    <span className="heading-3 text-brand-accent">₦5,000</span>
                    <span className="body-5 text-content-secondary">/ month</span>
                  </div>
                  <p className="caption-3 text-brand-accent mt-1">
                    Launch price: ₦5,000/month (Monthly, cancel anytime)
                  </p>
                </div>

                <div className="h-px bg-surface-elevated my-6" />

                <div className="mb-8">
                  <p className="caption-3 text-content-primary mb-4">
                    Everything in Free, plus:
                  </p>
                  <ul className="space-y-3 body-6 text-content-secondary">
                    <li className="flex items-start gap-2.5">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold text-content-primary">
                          Unlimited automated trades
                        </strong>{' '}
                        for free communities
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>Priority execution queue routing</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold text-content-primary">
                          Portfolio risk controls:
                        </strong>{' '}
                        Max drawdown caps, daily loss thresholds, and custom per-provider margin allocations
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold text-content-primary">
                          Planned launch tools:
                        </strong>{' '}
                        Auto break-even, trailing stop targets, and partial take-profit splits
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>Full audit-grade trade logs and execution slippage reporting</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <Link href="/register" className="block w-full">
                  <button
                    type="button"
                    onClick={() => onPlanSelect?.('premium')}
                    className="w-full bg-brand-accent hover:bg-brand-accentHover text-content-inverted py-3 px-4 button-md rounded-xl transition-[background-color,transform] duration-300 ease-weighted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent shadow-xs"
                  >
                    Start Free. No Credit Card.
                  </button>
                </Link>
                <p className="caption-4 text-brand-accent text-center mt-2">
                  Select your preferred plan inside your dashboard after registration
                </p>
                <div className="h-px bg-surface-elevated my-4" />
                <p className="caption-5 text-content-tertiary text-center">
                  If you join a paid VIP signal group, you pay the provider directly. Premium is for advanced automation and risk controls.
                </p>
              </div>
            </div>
          </div>

          {/* Truthful Security & Infrastructure Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 caption-2 text-content-tertiary mb-12 max-w-4xl mx-auto text-center">
            <div className="flex items-center gap-2">
              <LockIcon size={16} className="text-brand-accent" />
              <span>Fernet symmetric encryption at rest for API credentials</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheckIcon size={16} className="text-brand-accent" />
              <span>Trade-only API permissions required (withdrawals rejected)</span>
            </div>
          </div>

          {/* Explainer Block: How Tadex Pricing Works */}
          <div className="bg-surface-primary rounded-2xl p-8 border border-surface-elevated max-w-4xl mx-auto">
            <h3 className="title-1 text-content-primary mb-4">
              How Tadex Pricing Works
            </h3>
            <div className="space-y-4 body-6 text-content-secondary">
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-accent mt-2 flex-shrink-0" />
                <p>
                  <strong className="font-semibold text-content-primary">
                    Free communities:
                  </strong>{' '}
                  Free tier includes 12 automated trades/month across all free channels. Upgrade to Tadex Premium for unlimited automation and portfolio-wide risk limits.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-accent mt-2 flex-shrink-0" />
                <p>
                  <strong className="font-semibold text-content-primary">
                    Paid VIP communities:
                  </strong>{' '}
                  You pay the provider subscription price directly (set by them). Tadex collects a ~10% platform fee from the provider, not from you. Your signal trades execute automatically with zero volume surcharge.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-accent mt-2 flex-shrink-0" />
                <p>
                  <strong className="font-semibold text-content-primary">
                    Tadex Premium:
                  </strong>{' '}
                  One monthly fee of ₦5,000 (launch price) for portfolio-wide automated risk controls, trailing stops, and deep execution analytics across all your providers.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
