'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  UsersIcon,
  BroadcastIcon,
  BriefcaseIcon,
  CheckCircleIcon,
} from '@/components/ui/PhosphorIcons';

export default function WhoThisIsFor() {
  const userTypes = [
    {
      icon: UsersIcon,
      role: 'Signal Followers',
      tagline: 'Hands free automated execution',
      bullets: [
        'You are in Telegram groups copying trades by hand.',
        'You want automation without learning to code.',
        'You care about entries, risk, and results rather than infrastructure.',
      ],
      badge: 'Followers',
    },
    {
      icon: BroadcastIcon,
      role: 'Signal Providers',
      tagline: 'Monetize and automate your community',
      bullets: [
        'You run a VIP group or sell signals.',
        'You want to offer automated execution to your members.',
        'You want less payment chaos and fewer support messages.',
      ],
      badge: 'Providers',
    },
    {
      icon: BriefcaseIcon,
      role: 'Busy & Multi-Account Traders',
      tagline: 'Discipline and drawdown protection',
      bullets: [
        'You trade around work, family, or other commitments.',
        'You manage multiple exchange accounts and need strict risk controls.',
        'You want clear logs of every entry, stop loss, and fill.',
      ],
      badge: 'Active & Part Time',
    },
  ];

  return (
    <section className="py-20 lg:py-24 bg-surface-primary" id="who-this-is-for">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="max-w-[680px] mb-16">
            <h2 className="heading-2 text-content-primary mb-4">
              Built for Traders, Not Engineers
            </h2>
            <p className="title-1 text-content-secondary">
              Whether you copy Telegram signals, manage a VIP signal community, or automate your own strategies while working a full time job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {userTypes.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-surface-subtle hover:bg-surface-secondary rounded-2xl p-8 border border-surface-elevated transition-[background-color,transform] duration-500 ease-weighted hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-surface-elevated text-brand-accent flex items-center justify-center">
                        <Icon size={24} />
                      </div>
                      <span className="caption-3 text-content-tertiary bg-surface-primary px-3 py-1 rounded-full border border-surface-elevated">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="title-1 text-content-primary mb-1">
                      {item.role}
                    </h3>
                    <p className="caption-3 text-brand-accent mb-6">
                      {item.tagline}
                    </p>

                    <ul className="space-y-4">
                      {item.bullets.map((bullet, bIdx) => (
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
