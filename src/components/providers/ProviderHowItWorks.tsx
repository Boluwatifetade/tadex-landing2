'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  UserPlusIcon,
  PackageIcon,
  ChatIcon,
  ShareIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@/components/ui/PhosphorIcons';

interface ProviderHowItWorksProps {
  onOpenModal: () => void;
}

export default function ProviderHowItWorks({ onOpenModal }: ProviderHowItWorksProps) {
  const steps = [
    {
      number: '01',
      icon: UserPlusIcon,
      title: 'Create Your Provider Account',
      bullets: [
        'Sign up as a signal provider on Tadex.',
        'Complete a short onboarding form (your niche, typical signals, target market).',
      ],
    },
    {
      number: '02',
      icon: PackageIcon,
      title: 'Create Your Plans',
      bullets: [
        'Define up to 3 plans: Plan name (e.g., “Monthly VIP”).',
        'Set price and currency (e.g., ₦30,000 NGN, $25 USD).',
        'Set duration (30 days, 90 days, etc.).',
        'Mark one plan as your free community if you want a free tier.',
      ],
    },
    {
      number: '03',
      icon: ChatIcon,
      title: 'Connect Your Telegram Channel',
      bullets: [
        'Add your Telegram VIP group or channel.',
        'Tadex verifies the bot’s access and maps the channel to your plan.',
        'You keep posting signals exactly as you do now.',
      ],
    },
    {
      number: '04',
      icon: ShareIcon,
      title: 'Share Your Tadex Link With Members',
      bullets: [
        'Send your members a single Tadex checkout link.',
        'They subscribe, connect their exchange, and set their risk rules.',
        'Tadex handles billing, access, and automated execution from then on.',
      ],
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-surface-primary" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          {/* Section Header */}
          <div className="max-w-[680px] mb-12">
            <h2 className="heading-2 text-content-primary mb-4">
              From Telegram Group to Automated Business in 4 Steps
            </h2>
            <p className="title-1 text-content-secondary">
              No code. No complex setup. Just connect, configure, and grow.
            </p>
          </div>

          {/* Flat Mini Flow: Telegram -> Tadex -> Exchange (Outer rounded-2xl 16px, p-2 8px -> Inner rounded-lg 8px per B3) */}
          <div className="mb-10 sm:mb-12 p-2 rounded-2xl bg-surface-subtle border border-surface-elevated">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono">
              <div className="flex items-center justify-between bg-surface-primary px-3.5 py-3 rounded-lg border border-surface-elevated">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-content-secondary flex-shrink-0" />
                  <span className="caption-4 text-content-primary">
                    1. Telegram VIP Channel
                  </span>
                </div>
                <ArrowRightIcon size={14} className="text-content-tertiary hidden sm:block flex-shrink-0" />
              </div>

              <div className="flex items-center justify-between bg-surface-primary px-3.5 py-3 rounded-lg border border-surface-elevated">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-brand-accent flex-shrink-0" />
                  <span className="caption-4 text-content-primary">
                    2. Tadex Billing & Signal Engine
                  </span>
                </div>
                <ArrowRightIcon size={14} className="text-content-tertiary hidden sm:block flex-shrink-0" />
              </div>

              <div className="flex items-center justify-between bg-brand-accentSubtle px-3.5 py-3 rounded-lg border border-brand-accent/40">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-brand-accent flex-shrink-0" />
                  <span className="caption-3 text-brand-accent">
                    3. Member Exchange Accounts (Bybit/Binance)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="relative bg-surface-subtle hover:bg-surface-secondary rounded-2xl p-5 sm:p-6 border border-surface-elevated transition-[background-color,transform] duration-500 ease-weighted hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="heading-5 text-content-tertiary font-mono">
                        {step.number}
                      </span>
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-surface-secondary border border-surface-elevated text-brand-accent flex items-center justify-center flex-shrink-0">
                        <Icon size={22} />
                      </div>
                    </div>

                    <h3 className="title-2 text-content-primary mb-4">
                      {step.title}
                    </h3>

                    <ul className="space-y-3">
                      {step.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-2.5 body-6 text-content-secondary"
                        >
                          <CheckIcon
                            size={16}
                            className="text-brand-accent flex-shrink-0 mt-0.5"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Under Steps */}
          <div className="flex flex-col items-stretch sm:items-start">
            <button
              type="button"
              onClick={onOpenModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-md px-6 py-3 rounded-xl transition-[background-color,transform] duration-300 ease-weighted hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <span>Become a Provider</span>
              <ArrowRightIcon size={18} />
            </button>
            <p className="caption-4 text-content-tertiary mt-2 text-center sm:text-left">
              Talk to our team
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
