'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  CreditCardIcon,
  SlidersIcon,
  RobotIcon,
  ChartLineUpIcon,
  CheckCircleIcon,
} from '@/components/ui/PhosphorIcons';

export default function ProviderBenefits() {
  const benefits = [
    {
      icon: CreditCardIcon,
      title: 'Automated Billing & Access',
      bullets: [
        'Members subscribe through Tadex, not random transfers.',
        'Payment verified → access granted automatically.',
        'Expired subscriptions → access removed automatically.',
        'No more “Did you receive my payment?” DMs.',
      ],
      badge: 'Zero Admin',
    },
    {
      icon: SlidersIcon,
      title: 'You Set the Price, We Handle the Rest',
      bullets: [
        'Create up to 3 paid plans (e.g., Monthly VIP, Quarterly VIP, Free Community).',
        'Set your own price and currency (NGN, USD, GHS, KES, etc.).',
        'Tadex handles checkout, receipts, and subscription status.',
        'You keep the majority of revenue; Tadex takes a small platform fee (around 10%).',
      ],
      badge: 'Multi Currency',
    },
    {
      icon: RobotIcon,
      title: 'Automated Execution for Your Members',
      bullets: [
        'Your signals are read by Tadex and executed on your members’ exchange accounts.',
        'They get better entries, consistent risk, and clear logs.',
        'Better results → higher retention → you can charge more.',
      ],
      badge: 'Trade Only API',
    },
    {
      icon: ChartLineUpIcon,
      title: 'Clear Revenue & Subscriber Insights',
      bullets: [
        'Dashboard shows monthly revenue, platform fees, active subscribers, and churn.',
        'Track subscriber growth and retention over time.',
        'Optional: see aggregate follower performance metrics (win rate, total PnL).',
        'Use this data to market your service and justify price increases.',
      ],
      badge: 'Growth Data',
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-surface-canvas" id="what-tadex-gives-you">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-[680px] mb-16">
            <h2 className="heading-2 text-content-primary mb-4">
              What You Get as a Tadex Provider
            </h2>
            <p className="title-1 text-content-secondary">
              A ready infrastructure that turns your Telegram signal group into a scalable, automated business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-surface-primary hover:bg-surface-subtle rounded-2xl p-8 border border-surface-elevated transition-[background-color,transform] duration-500 ease-weighted hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-surface-subtle border border-surface-elevated flex items-center justify-center text-brand-accent">
                        <Icon size={24} />
                      </div>
                      <span className="caption-3 text-content-tertiary bg-surface-subtle px-3 py-1 rounded-full border border-surface-elevated">
                        {card.badge}
                      </span>
                    </div>

                    <h3 className="title-1 text-content-primary mb-4">
                      {card.title}
                    </h3>

                    <ul className="space-y-3.5">
                      {card.bullets.map((bullet, bIdx) => (
                        <li
                          key={bIdx}
                          className="flex items-start gap-3 body-6 text-content-secondary"
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
