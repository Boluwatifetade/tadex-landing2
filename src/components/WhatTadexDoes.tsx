'use client';

import { Clock, ShieldCheck, TrendingUp, CheckCircle } from 'lucide-react';

export default function WhatTadexDoes() {
  const cards = [
    {
      icon: Clock,
      title: 'Never Miss a Trade',
      bullets: [
        'Signals arrive while you’re asleep, at work, or away.',
        'Tadex reads them instantly and executes based on your rules.',
        'No more late entries or “I saw it too late” moments.',
      ],
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
      badge: '24/7 Execution',
    },
    {
      icon: ShieldCheck,
      title: 'Remove Human Error',
      bullets: [
        'No more wrong size, wrong symbol, or missing stop loss.',
        'Your risk rules are applied on every single trade.',
        'One less thing to worry about when the market moves fast.',
      ],
      iconBg: 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400',
      badge: 'Risk Guard',
    },
    {
      icon: TrendingUp,
      title: 'Run Like a Pro Operation',
      bullets: [
        'Follow multiple providers across multiple exchanges.',
        'Set max loss, drawdown limits, and position sizing.',
        'See clear logs of what executed, when, and why.',
      ],
      iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400',
      badge: 'Multi-Exchange',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white" id="what-tadex-does">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#004859]/10 text-[#004859] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            Core Benefits
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#004859]">
            What You Get With Tadex
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A reliable, non-custodial execution layer that turns manual signal copying into an automated, systematic trading operation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="group relative bg-slate-50 hover:bg-white rounded-2xl p-8 border border-slate-200 hover:border-[#004859]/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.iconBg} shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-5 group-hover:text-[#004859] transition-colors">
                    {card.title}
                  </h3>

                  <ul className="space-y-3.5">
                    {card.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                        <CheckCircle className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
