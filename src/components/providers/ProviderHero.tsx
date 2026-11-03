'use client';

import {
  ArrowRightIcon,
  BroadcastIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  PulseIcon,
} from '@/components/ui/PhosphorIcons';

interface ProviderHeroProps {
  onOpenModal: () => void;
}

export default function ProviderHero({ onOpenModal }: ProviderHeroProps) {
  return (
    <section className="relative bg-surface-canvas text-content-primary overflow-hidden pt-28 pb-20 lg:pt-32 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 text-left">
            {/* H1 Headline: Capped at 680px with left-to-right #FFFFFF -> #9B9B9B text gradient per B5 */}
            <h1 className="heading-1 hero-heading-gradient max-w-[680px] mb-6">
              Turn Your Signal Group Into a Real Business
            </h1>

            {/* Subheadline: Capped at 680px per B5 */}
            <p className="title-1 text-content-secondary max-w-[680px] mb-8">
              Tadex handles billing, access control, and automated execution for your members. You focus on trading, not chasing payments or removing expired users.
            </p>

            {/* Primary CTA Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 mb-4">
              <div className="flex flex-col items-center sm:items-start">
                <button
                  type="button"
                  onClick={onOpenModal}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-md px-6 py-3 rounded-xl transition-[background-color,transform] duration-300 ease-weighted hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
                >
                  <span>Become a Provider</span>
                  <ArrowRightIcon size={18} />
                </button>
                <span className="caption-3 text-brand-accent mt-2">
                  Talk to our team
                </span>
              </div>
            </div>

            {/* Secondary line */}
            <p className="caption-4 text-content-tertiary mb-6">
              Launch support • Revenue dashboard • Automated subscriber management
            </p>

            {/* Trust line */}
            <div className="pt-2 caption-1 text-content-tertiary flex items-center gap-2">
              <ShieldCheckIcon size={16} className="text-brand-accent flex-shrink-0" />
              <span>Used by signal providers across Nigeria, Kenya, Ghana, and beyond</span>
            </div>
          </div>

          {/* Right Column: Flat-Surface Provider Dashboard Mock (Nested radius formula: outer rounded-2xl 16px, p-2 8px -> inner rounded-lg 8px) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="rounded-2xl border border-surface-elevated bg-surface-primary p-2">
                {/* Dashboard Frame Header */}
                <div className="flex items-center justify-between px-3 py-2.5 bg-surface-subtle rounded-lg mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center text-content-primary button-xsm">
                      T
                    </div>
                    <div>
                      <div className="caption-3 text-content-primary flex items-center gap-2">
                        <span>Provider Portal</span>
                        <span className="caption-4 bg-brand-accentSubtle text-brand-accent border border-brand-accent/40 px-1.5 py-0.5 rounded font-mono">
                          LIVE
                        </span>
                      </div>
                      <div className="caption-5 text-content-tertiary">@AlphaSignals VIP</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 caption-4 text-brand-accent bg-brand-accentSubtle border border-brand-accent/30 px-2.5 py-1 rounded-full">
                    <PulseIcon size={14} />
                    <span>Bot Sync Active</span>
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-2 space-y-3">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-surface-subtle p-4 border border-surface-elevated">
                      <span className="caption-4 text-content-tertiary block mb-1">
                        Active Plans
                      </span>
                      <span className="heading-4 text-content-primary font-mono">
                        3
                      </span>
                      <span className="caption-5 text-brand-accent block mt-1">
                        Free, Monthly, Quarterly
                      </span>
                    </div>

                    <div className="rounded-xl bg-surface-subtle p-4 border border-surface-elevated">
                      <span className="caption-4 text-content-tertiary block mb-1">
                        Monthly Revenue
                      </span>
                      <span className="heading-4 text-brand-accent font-mono">
                        ₦1,250,000
                      </span>
                      <span className="caption-5 text-content-secondary block mt-1">
                        +18.4% this month
                      </span>
                    </div>
                  </div>

                  {/* Connected Channel Card */}
                  <div className="rounded-xl bg-surface-subtle p-4 border border-surface-elevated flex items-center justify-between">
                    <div>
                      <span className="caption-4 text-content-tertiary block">
                        Connected Channel
                      </span>
                      <span className="body-4 text-content-primary">
                        @AlphaSignals VIP
                      </span>
                      <span className="caption-5 text-content-secondary block mt-0.5">
                        84 Active Subscribers
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-surface-secondary border border-surface-elevated text-brand-accent flex items-center justify-center">
                      <BroadcastIcon size={20} />
                    </div>
                  </div>

                  {/* Live Activity Feed Item */}
                  <div className="rounded-xl bg-brand-accentSubtle p-4 border border-brand-accent/40 space-y-1.5">
                    <div className="flex items-center justify-between caption-3 text-brand-accent">
                      <span className="flex items-center gap-1.5">
                        <CheckCircleIcon size={16} />
                        <span>New Automated Subscriber</span>
                      </span>
                      <span className="caption-5 text-content-secondary">2m ago</span>
                    </div>
                    <p className="caption-5 text-content-secondary">
                      @crypto_trader subscribed to{' '}
                      <strong className="font-semibold text-content-primary">
                        Monthly VIP (₦30,000)
                      </strong>
                      . Payment verified, Telegram VIP access granted, Bybit execution linked.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
