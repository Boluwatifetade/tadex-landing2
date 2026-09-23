'use client';

import { Wallet, AlertTriangle, Clock, XCircle } from 'lucide-react';

export default function ProviderProblem() {
  const problems = [
    {
      icon: Wallet,
      title: 'Payment & Access Chaos',
      bullets: [
        'Members pay via bank transfer, crypto, or random links.',
        'You spend hours cross-checking names, amounts, and dates.',
        'Expired users stay in the group because you forget to remove them.',
      ],
      badge: 'Admin Fatigue',
      iconBg: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400',
    },
    {
      icon: AlertTriangle,
      title: 'Leaked Links & Free Riders',
      bullets: [
        'Invite links get shared outside your paying members.',
        'People who never paid sit in your VIP and consume your signals.',
        'You have no clean way to verify who actually subscribed.',
      ],
      badge: 'Revenue Leakage',
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
    },
    {
      icon: Clock,
      title: 'No Automation, No Scale',
      bullets: [
        'Members execute your signals manually (late entries, wrong size).',
        'You get constant DMs: “How do I join?”, “Did my payment go through?”, “Remove me, I’m done.”',
        'Growing past 50–100 members feels impossible without hiring help.',
      ],
      badge: 'Growth Ceiling',
      iconBg: 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white" id="the-problem">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            Why Manual Doesn’t Scale
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#004859]">
            Running a VIP Group Manually Is a Full-Time Job
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            If you’re managing payments, access, and support by hand, you’re leaving money and time on the table.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {problems.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-slate-50 hover:bg-white rounded-2xl p-8 border border-slate-200 hover:border-red-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.iconBg} shadow-sm`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-5">
                    {card.title}
                  </h3>

                  <ul className="space-y-3.5">
                    {card.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
                        <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
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
