'use client';

import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  UserCheckIcon,
  KeyIcon,
  SlidersIcon,
  LightningIcon,
  ArrowRightIcon,
  CheckIcon,
} from '@/components/ui/PhosphorIcons';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: UserCheckIcon,
      title: 'Create Your Account',
      bullets: [
        'Open Tadex in your browser.',
        'Sign up in under 2 minutes.',
        'No software to install.',
      ],
    },
    {
      number: '02',
      icon: KeyIcon,
      title: 'Connect Your Accounts',
      bullets: [
        'Add your exchange API keys (Bybit, Binance, OKX, etc.).',
        'Link your Telegram groups or webhooks.',
        'Everything is encrypted and secure.',
      ],
    },
    {
      number: '03',
      icon: SlidersIcon,
      title: 'Set Your Rules',
      bullets: [
        'Choose which signals to act on.',
        'Define position size, stop loss, and risk limits.',
        'Add filters like only trade BTC or only during London session.',
      ],
    },
    {
      number: '04',
      icon: LightningIcon,
      title: 'Let Tadex Handle the Rest',
      bullets: [
        'Signals come in, Tadex checks your rules, and trades are placed.',
        'Watch live logs of every action.',
        'Adjust or pause anytime from your dashboard.',
      ],
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-surface-canvas" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          {/* Section Header */}
          <div className="max-w-[680px] mb-12">
            <h2 className="heading-2 text-content-primary mb-4">
              Set Up in Minutes, Not Days
            </h2>
            <p className="title-1 text-content-secondary">
              No downloads. No complex code. Just connect, configure, and go.
            </p>
          </div>

          {/* Flat Signal Flow Simulation Bar (Outer rounded-2xl 16px, p-2 8px -> Inner rounded-lg 8px per B3) */}
          <div className="mb-12 p-2 rounded-2xl bg-surface-primary border border-surface-elevated">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 font-mono">
              <div className="flex items-center justify-between bg-surface-subtle px-4 py-3 rounded-lg border border-surface-elevated">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-content-secondary" />
                  <span className="caption-4 text-content-primary">1. Telegram Signal</span>
                </div>
                <ArrowRightIcon size={14} className="text-content-tertiary hidden sm:block" />
              </div>

              <div className="flex items-center justify-between bg-surface-subtle px-4 py-3 rounded-lg border border-surface-elevated">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-accent" />
                  <span className="caption-4 text-content-primary">2. Tadex Risk Engine</span>
                </div>
                <ArrowRightIcon size={14} className="text-content-tertiary hidden sm:block" />
              </div>

              <div className="flex items-center justify-between bg-surface-subtle px-4 py-3 rounded-lg border border-surface-elevated">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-accent" />
                  <span className="caption-4 text-content-primary">3. Bybit API Trade Only</span>
                </div>
                <ArrowRightIcon size={14} className="text-content-tertiary hidden sm:block" />
              </div>

              <div className="flex items-center justify-between bg-brand-accentSubtle px-4 py-3 rounded-lg border border-brand-accent/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-accent" />
                  <span className="caption-3 text-brand-accent">4. Order Filled</span>
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
                  className="relative bg-surface-primary hover:bg-surface-subtle rounded-2xl p-6 border border-surface-elevated transition-[background-color,transform] duration-500 ease-weighted hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <span className="heading-5 text-content-tertiary font-mono">
                        {step.number}
                      </span>
                      <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-surface-elevated text-brand-accent flex items-center justify-center">
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
          <div className="flex flex-col items-start">
            <Link href="#pricing">
              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-md px-6 py-3 rounded-xl transition-[background-color,transform] duration-300 ease-weighted hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
              >
                <span>Start Free</span>
                <ArrowRightIcon size={18} />
              </button>
            </Link>
            <p className="caption-4 text-content-tertiary mt-2">
              No credit card required
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}