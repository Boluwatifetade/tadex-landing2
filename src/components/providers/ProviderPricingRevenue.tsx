'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  CheckIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  WalletIcon,
} from '@/components/ui/PhosphorIcons';

interface ProviderPricingRevenueProps {
  onOpenModal: () => void;
}

export default function ProviderPricingRevenue({
  onOpenModal,
}: ProviderPricingRevenueProps) {
  const featuresIncluded = [
    'Automated billing and subscription management',
    'Access control (grant/remove VIP access based on payment status)',
    'Automated signal execution for your members',
    'Revenue dashboard and transaction history',
    'Reduced chargeback and dispute risk (centralized records)',
    'Support for multiple currencies and payment methods',
  ];

  return (
    <section className="py-20 lg:py-24 bg-surface-canvas relative" id="pricing-revenue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          {/* Section Header */}
          <div className="max-w-[680px] mb-16">
            <h2 className="heading-2 text-content-primary mb-4">
              Simple, Transparent Revenue Share
            </h2>
            <p className="title-1 text-content-secondary">
              You set your prices. Tadex takes a small platform fee from each subscription.
            </p>
          </div>

          {/* Two-Column Revenue Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-12">
            {/* Left Column: How You Earn & Visual Split */}
            <div className="bg-surface-primary rounded-2xl border border-surface-elevated p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-subtle border border-surface-elevated text-brand-accent flex items-center justify-center">
                    <WalletIcon size={24} />
                  </div>
                  <div>
                    <h3 className="heading-5 text-content-primary">How You Earn</h3>
                    <p className="caption-4 text-content-tertiary">
                      Autonomous billing and settlement
                    </p>
                  </div>
                </div>

                <div className="space-y-4 body-6 text-content-secondary mb-8">
                  <p>
                    You create paid plans and set your own prices (e.g.,{' '}
                    <strong className="font-semibold text-content-primary">
                      ₦30,000/month VIP
                    </strong>
                    ,{' '}
                    <strong className="font-semibold text-content-primary">
                      $25/month VIP
                    </strong>
                    , etc.).
                  </p>
                  <p>
                    Members pay through Tadex checkout. Tadex processes the payment and splits it automatically:
                  </p>
                  <ul className="space-y-2 pl-2">
                    <li className="flex items-center gap-2 body-5 text-content-primary">
                      <span className="w-2 h-2 rounded-full bg-brand-accent" />
                      <span>You: ~90% of the subscription price</span>
                    </li>
                    <li className="flex items-center gap-2 body-5 text-content-secondary">
                      <span className="w-2 h-2 rounded-full bg-content-tertiary" />
                      <span>Tadex: ~10% platform fee</span>
                    </li>
                  </ul>
                  <p className="caption-4 text-content-tertiary pt-1">
                    You receive your share according to the settlement schedule shown in your dashboard.
                  </p>
                </div>

                {/* Concrete Example Visual Box (Nested radius: outer rounded-xl 12px, p-4 16px -> inner rounded-lg 8px) */}
                <div className="rounded-xl bg-surface-subtle p-4 border border-surface-elevated">
                  <div className="caption-3 text-content-tertiary mb-2">
                    Real World Monthly Example
                  </div>
                  <div className="body-4 text-content-primary mb-3">
                    Plan Price:{' '}
                    <span className="text-brand-accent font-mono">
                      ₦30,000 / month
                    </span>
                  </div>

                  <div className="h-px bg-surface-elevated my-3" />

                  <div className="grid grid-cols-2 gap-3 font-mono">
                    <div className="bg-brand-accentSubtle p-3 rounded-lg border border-brand-accent/40">
                      <span className="caption-5 text-content-secondary block">
                        YOU EARN (90%)
                      </span>
                      <span className="title-1 text-brand-accent">₦27,000</span>
                      <span className="caption-5 text-content-tertiary block mt-0.5">
                        per subscriber/mo
                      </span>
                    </div>
                    <div className="bg-surface-primary p-3 rounded-lg border border-surface-elevated">
                      <span className="caption-5 text-content-tertiary block">
                        TADEX FEE (~10%)
                      </span>
                      <span className="title-1 text-content-primary">₦3,000</span>
                      <span className="caption-5 text-content-tertiary block mt-0.5">
                        all inclusive infra
                      </span>
                    </div>
                  </div>

                  <p className="caption-5 text-content-tertiary mt-3">
                    Exact percentage is configurable and shown before you publish your first plan.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: What You Get for That Fee */}
            <div className="bg-surface-primary rounded-2xl border border-surface-elevated p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-surface-subtle border border-surface-elevated text-brand-accent flex items-center justify-center">
                    <ShieldCheckIcon size={24} />
                  </div>
                  <div>
                    <h3 className="heading-5 text-content-primary">
                      What You Get for That Fee
                    </h3>
                    <p className="caption-4 text-content-tertiary">
                      Everything required to operate at scale
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {featuresIncluded.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-accentSubtle border border-brand-accent/40 text-brand-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckIcon size={12} />
                      </div>
                      <span className="body-5 text-content-secondary">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="h-px bg-surface-elevated mb-6" />
                <div className="bg-brand-accentSubtle text-content-primary p-4 rounded-xl caption-4 border border-brand-accent/40">
                  <strong className="font-semibold text-brand-accent">
                    Transparent Guarantee:
                  </strong>{' '}
                  Tadex does not take a cut of your members’ trading PnL. Our fee is only on the subscription price you set.
                </div>
              </div>
            </div>
          </div>

          {/* CTA Under Section */}
          <div className="flex flex-col items-start">
            <button
              type="button"
              onClick={onOpenModal}
              className="inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-md px-6 py-3 rounded-xl transition-[background-color,transform] duration-300 ease-weighted hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <span>Become a Provider</span>
              <ArrowRightIcon size={18} />
            </button>
            <p className="caption-4 text-content-tertiary mt-2">
              Talk to our team
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
