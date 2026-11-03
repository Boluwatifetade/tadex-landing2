'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  WalletIcon,
  WarningTriangleIcon,
  ClockIcon,
  XCircleIcon,
} from '@/components/ui/PhosphorIcons';

export default function ProviderProblem() {
  const problems = [
    {
      icon: WalletIcon,
      title: 'Payment & Access Chaos',
      bullets: [
        'Members pay via bank transfer, crypto, or random links.',
        'You spend hours cross checking names, amounts, and dates.',
        'Expired users stay in the group because you forget to remove them.',
      ],
      badge: 'Admin Fatigue',
    },
    {
      icon: WarningTriangleIcon,
      title: 'Leaked Links & Free Riders',
      bullets: [
        'Invite links get shared outside your paying members.',
        'People who never paid sit in your VIP and consume your signals.',
        'You have no clean way to verify who actually subscribed.',
      ],
      badge: 'Revenue Leakage',
    },
    {
      icon: ClockIcon,
      title: 'No Automation, No Scale',
      bullets: [
        'Members execute your signals manually (late entries, wrong size).',
        'You get constant DMs: “How do I join?”, “Did my payment go through?”, “Remove me, I’m done.”',
        'Growing past 50 to 100 members feels impossible without hiring help.',
      ],
      badge: 'Growth Ceiling',
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-surface-primary" id="the-problem">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-[680px] mb-16">
            <h2 className="heading-2 text-content-primary mb-4">
              Running a VIP Group Manually Is a Full-Time Job
            </h2>
            <p className="title-1 text-content-secondary">
              If you’re managing payments, access, and support by hand, you’re leaving money and time on the table.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problems.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-surface-subtle hover:bg-surface-secondary rounded-2xl p-8 border border-surface-elevated transition-[background-color,transform] duration-500 ease-weighted hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-surface-elevated flex items-center justify-center text-status-warning">
                        <Icon size={24} />
                      </div>
                      <span className="caption-3 text-content-tertiary bg-surface-primary px-3 py-1 rounded-full border border-surface-elevated">
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
                          <XCircleIcon
                            size={18}
                            className="text-status-danger flex-shrink-0 mt-0.5"
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
