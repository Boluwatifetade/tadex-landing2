'use client';

import { Users, Radio, Briefcase, CheckCircle2 } from 'lucide-react';

export default function WhoThisIsFor() {
  const userTypes = [
    {
      icon: Users,
      role: 'Signal Followers',
      tagline: 'Effortless automated execution',
      bullets: [
        'You’re in Telegram groups copying trades by hand.',
        'You want automation without learning to code.',
        'You care about entries, risk, and results—not infrastructure.',
      ],
      borderAccent: 'hover:border-emerald-500/40',
      badge: 'Followers',
    },
    {
      icon: Radio,
      role: 'Signal Providers',
      tagline: 'Monetize & automate your community',
      bullets: [
        'You run a VIP group or sell signals.',
        'You want to offer automated execution to your members.',
        'You want less payment chaos and fewer support messages.',
      ],
      borderAccent: 'hover:border-[#004859]/50',
      badge: 'Providers',
    },
    {
      icon: Briefcase,
      role: 'Busy Traders & Prop Traders',
      tagline: 'Discipline & drawdown protection',
      bullets: [
        'You trade around work, family, or other commitments.',
        'You use prop firms and need strict risk controls.',
        'You want clear logs for reviews and payouts.',
      ],
      borderAccent: 'hover:border-teal-500/40',
      badge: 'Prop & Part-Time',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50 border-y border-slate-200" id="who-this-is-for">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#004859]/10 text-[#004859] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            Audience Focus
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#004859]">
            Built for Traders, Not Engineers
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Whether you copy signals, manage a VIP signal channel, or pass prop evaluations while working a full-time job.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {userTypes.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`bg-white rounded-2xl p-8 border border-slate-200 ${item.borderAccent} shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-[#004859]/10 text-[#004859] flex items-center justify-center font-bold">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    {item.role}
                  </h3>
                  <p className="text-xs font-medium text-[#00B894] mb-6">
                    {item.tagline}
                  </p>

                  <ul className="space-y-4">
                    {item.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
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
