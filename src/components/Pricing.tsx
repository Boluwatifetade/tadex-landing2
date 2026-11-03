'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  CheckIcon,
  LightningIcon,
  CrownIcon,
  BroadcastIcon,
  ShieldCheckIcon,
  SparkleIcon,
} from '@/components/ui/PhosphorIcons';

interface PricingProps {
  onPlanSelect: (plan: string) => void;
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
              Pay only for what you use. No hidden fees.
            </p>
          </div>

          {/* 3 Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-12">
            {/* Card 1: Free */}
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
                  Best for: Trying Tadex and small setups
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
                      <span>Connect your exchange and Telegram</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>Follow free signal communities</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold text-content-primary">
                          12 automated trades
                        </strong>{' '}
                        per month across all free communities
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>Live execution logs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>Basic risk controls</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onPlanSelect('free')}
                  className="w-full bg-surface-secondary hover:bg-surface-elevated text-content-primary border border-surface-elevated py-3 px-4 button-md rounded-xl transition-[background-color,transform] duration-300 ease-weighted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                >
                  Start Free
                </button>
                <p className="caption-4 text-content-tertiary text-center mt-2">
                  No credit card required
                </p>
                <div className="h-px bg-surface-elevated my-4" />
                <p className="caption-5 text-content-tertiary text-center">
                  Paid VIP groups set their own subscription price with the provider. Tadex does not charge extra for access.
                </p>
              </div>
            </div>

            {/* Card 2: Tadex Premium (Most Popular) */}
            <div className="bg-surface-subtle text-content-primary rounded-2xl border border-brand-accent p-8 relative flex flex-col justify-between transition-[background-color,transform] duration-500 ease-weighted hover:-translate-y-1">
              {/* Most Popular Badge */}
              <div className="absolute -top-3 left-6 bg-brand-accent text-content-inverted px-3 py-1 rounded-full caption-3 flex items-center gap-1.5">
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
                  Best for: Serious traders following multiple providers or running multi exchange setups
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
                      <span>Follow unlimited providers</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>
                        Connect multiple exchanges (Bybit, Binance, OKX)
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold text-content-primary">
                          Advanced risk controls:
                        </strong>{' '}
                        Portfolio drawdown limits, daily and weekly loss caps, per provider sizing
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold text-content-primary">
                          Trade management tools:
                        </strong>{' '}
                        Auto break even, trailing stops, partial closes
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold text-content-primary">
                          Advanced analytics:
                        </strong>{' '}
                        Per provider PnL, execution quality (slippage, fill rate), correlation insights
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>Audit grade logs for trade reviews and performance tracking</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onPlanSelect('premium')}
                  className="w-full bg-brand-accent hover:bg-brand-accentHover text-content-inverted py-3 px-4 button-md rounded-xl transition-[background-color,transform] duration-300 ease-weighted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                >
                  Get Premium
                </button>
                <p className="caption-4 text-brand-accent text-center mt-2">
                  Launch price: ₦5,000/month
                </p>
                <div className="h-px bg-surface-elevated my-4" />
                <p className="caption-5 text-content-tertiary text-center">
                  If you join a paid VIP signal group, you pay the provider subscription price directly. Tadex Premium is for advanced automation and risk tools, not signal access.
                </p>
              </div>
            </div>

            {/* Card 3: For Signal Providers */}
            <div className="bg-surface-primary rounded-2xl border border-surface-elevated p-8 flex flex-col justify-between transition-[background-color,transform] duration-500 ease-weighted hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-subtle border border-surface-elevated text-brand-accent flex items-center justify-center">
                    <BroadcastIcon size={24} />
                  </div>
                  <span className="caption-3 text-content-tertiary bg-surface-subtle px-3 py-1 rounded-full border border-surface-elevated">
                    For Providers
                  </span>
                </div>

                <h3 className="heading-5 text-content-primary mb-1">
                  For Signal Providers
                </h3>
                <p className="caption-4 text-content-tertiary mb-6">
                  Best for: Traders running Telegram signal groups or selling strategies
                </p>

                <div>
                  <div className="title-1 text-content-primary">
                    Turn Your Signals Into a Business
                  </div>
                  <p className="caption-4 text-content-tertiary mt-1">
                    Keep majority of revenue · Tadex ~10% platform fee
                  </p>
                </div>

                <div className="h-px bg-surface-elevated my-6" />

                <div className="mb-8">
                  <p className="caption-3 text-content-primary mb-4">
                    Provider Features:
                  </p>
                  <ul className="space-y-3 body-6 text-content-secondary">
                    <li className="flex items-start gap-3">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>
                        Create up to 3 paid plans (e.g., Monthly VIP, Quarterly VIP, Free Community)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>
                        Set your own price and currency (NGN, USD, GHS, KES, etc.)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold text-content-primary">
                          Tadex handles:
                        </strong>{' '}
                        Subscriber billing, access control, automated execution, and payment reconciliation
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>
                        You keep the majority of revenue; Tadex takes a small platform fee (around 10%)
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckIcon size={16} className="text-brand-accent flex-shrink-0 mt-0.5" />
                      <span>
                        <strong className="font-semibold text-content-primary">
                          Dashboards for:
                        </strong>{' '}
                        Revenue, subscriber count, retention, churn, and optional follower performance
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <Link href="/for-providers" className="block w-full">
                  <button
                    type="button"
                    onClick={() => onPlanSelect('provider')}
                    className="w-full bg-surface-secondary hover:bg-surface-elevated text-content-primary border border-surface-elevated py-3 px-4 button-md rounded-xl transition-[background-color,transform] duration-300 ease-weighted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                  >
                    Become a Provider
                  </button>
                </Link>
                <p className="caption-4 text-content-tertiary text-center mt-2">
                  Talk to our team
                </p>
                <div className="h-px bg-surface-elevated my-4" />
                <p className="caption-5 text-content-tertiary text-center">
                  Exact platform fee and settlement details are shown before you publish your first plan.
                </p>
              </div>
            </div>
          </div>

          {/* Small line under pricing */}
          <div className="flex items-center gap-2 caption-1 text-content-tertiary mb-12">
            <ShieldCheckIcon size={18} className="text-brand-accent" />
            <span>All plans include secure API handling and 99.9% uptime.</span>
          </div>

          {/* Explainer Block: How Tadex Pricing Works */}
          <div className="bg-surface-primary rounded-2xl p-8 border border-surface-elevated max-w-4xl">
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
                  Free tier includes 12 automated trades/month across all free channels. Upgrade to Tadex Premium for unlimited automation and advanced risk controls.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-accent mt-2 flex-shrink-0" />
                <p>
                  <strong className="font-semibold text-content-primary">
                    Paid VIP communities:
                  </strong>{' '}
                  You pay the provider subscription price directly (set by them). Tadex takes a small platform fee (~10%) from the provider, not from you. Your trades execute automatically with no extra charge from Tadex.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-brand-accent mt-2 flex-shrink-0" />
                <p>
                  <strong className="font-semibold text-content-primary">
                    Tadex Premium:
                  </strong>{' '}
                  One monthly fee of ₦5,000 (launch price) for portfolio wide automated risk controls, trailing stops, multiple connected exchanges, and deep execution analytics across all your providers.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}