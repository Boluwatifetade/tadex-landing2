'use client';

import { CreditCard, Sliders, Bot, LineChart, CheckCircle2 } from 'lucide-react';

export default function ProviderBenefits() {
  const benefits = [
    {
      icon: CreditCard,
      title: 'Automated Billing & Access',
      bullets: [
        'Members subscribe through Tadex, not random transfers.',
        'Payment verified → access granted automatically.',
        'Expired subscriptions → access removed automatically.',
        'No more “Did you receive my payment?” DMs.',
      ],
      badge: 'Zero Admin',
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
    },
    {
      icon: Sliders,
      title: 'You Set the Price, We Handle the Rest',
      bullets: [
        'Create up to 3 paid plans (e.g., Monthly VIP, Quarterly VIP, Free Community).',
        'Set your own price and currency (NGN, USD, GHS, KES, etc.).',
        'Tadex handles checkout, receipts, and subscription status.',
        'You keep the majority of revenue; Tadex takes a small platform fee (around 10%).',
      ],
      badge: 'Multi-Currency',
      iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400',
    },
    {
      icon: Bot,
      title: 'Automated Execution for Your Members',
      bullets: [
        'Your signals are read by Tadex and executed on your members’ exchange accounts.',
        'They get better entries, consistent risk, and clear logs.',
        'Better results → higher retention → you can charge more.',
      ],
      badge: 'Trade-Only API',
      iconBg: 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400',
    },
    {
      icon: LineChart,
      title: 'Clear Revenue & Subscriber Insights',
      bullets: [
        'Dashboard shows monthly revenue, platform fees, active subscribers, and churn.',
        'Track subscriber growth and retention over time.',
        'Optional: see aggregate follower performance metrics (win rate, total PnL).',
        'Use this data to market your service and justify price increases.',
      ],
      badge: 'Growth Data',
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50 border-y border-slate-200" id="what-tadex-gives-you">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#004859]/10 text-[#004859] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            Platform Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#004859]">
            What You Get as a Tadex Provider
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            A turn-key infrastructure that transforms your Telegram signal group into a scalable, automated business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-[#004859]/30 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${card.iconBg} shadow-sm`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-5">
                    {card.title}
                  </h3>

                  <ul className="space-y-3.5">
                    {card.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-3 text-slate-600 text-sm leading-relaxed">
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
