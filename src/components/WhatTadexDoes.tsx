'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  ClockIcon,
  ShieldCheckIcon,
  ChartLineUpIcon,
  CheckCircleIcon,
} from '@/components/ui/PhosphorIcons';

export default function WhatTadexDoes() {
  const cards = [
    {
      icon: ClockIcon,
      title: 'Never Miss a Trade',
      bullets: [
        'Signals arrive while you are asleep, at work, or away.',
        'Tadex reads them instantly and executes based on your rules.',
        'No more late entries or missed opportunities.',
      ],
      badge: '24/7 Execution',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Remove Human Error',
      bullets: [
        'No more wrong size, wrong symbol, or missing stop loss.',
        'Your risk rules are applied on every single trade.',
        'One less thing to worry about when the market moves fast.',
      ],
      badge: 'Risk Guard',
    },
    {
      icon: ChartLineUpIcon,
      title: 'Run Like a Pro Operation',
      bullets: [
        'Follow multiple providers across multiple exchanges.',
        'Set max loss, drawdown limits, and position sizing.',
        'See clear logs of what executed, when, and why.',
      ],
      badge: 'Multi Exchange',
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-surface-primary" id="what-tadex-does">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-[680px] mb-16">
            <h2 className="heading-2 text-content-primary mb-4">
              What You Get With Tadex
            </h2>
            <p className="title-1 text-content-secondary">
              A reliable non custodial execution layer that turns manual signal copying into an automated trading operation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="group relative bg-surface-subtle hover:bg-surface-secondary rounded-2xl p-8 border border-surface-elevated transition-[background-color,transform] duration-500 ease-weighted hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-surface-elevated text-brand-accent flex items-center justify-center">
                        <Icon size={24} />
                      </div>
                      <span className="caption-3 text-content-tertiary bg-surface-primary px-3 py-1 rounded-full border border-surface-elevated">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="title-1 text-content-primary mb-4">
                      {card.title}
                    </h3>

                    <ul className="space-y-3">
                      {card.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-3 text-content-secondary body-6"
                        >
                          <CheckCircleIcon
                            size={18}
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
        </ScrollReveal>
      </div>
    </section>
  );
}
