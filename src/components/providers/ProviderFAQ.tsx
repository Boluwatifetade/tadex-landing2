'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { CaretDownIcon, QuestionIcon } from '@/components/ui/PhosphorIcons';

export default function ProviderFAQ() {
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqs = [
    {
      q: 'Do I need to stop using Telegram?',
      a: 'No. You keep posting signals in your Telegram channel exactly as you do now. Tadex reads your signals and routes them to your members’ accounts automatically.',
    },
    {
      q: 'How do I get paid?',
      a: 'Members pay through Tadex checkout. The payment is split automatically: your share goes to your connected payout account, and Tadex retains its platform fee. You see all transactions in your revenue dashboard.',
    },
    {
      q: 'Can I set my own prices?',
      a: 'Yes. You define up to 3 active plans with your own prices, currencies, and durations. Tadex does not force a global price.',
    },
    {
      q: 'What if I already have members paying me directly?',
      a: 'You can mark existing members as “external subscribers” in Tadex (no platform fee on those). Over time, you can migrate them to Tadex subscriptions at renewal for cleaner management.',
    },
    {
      q: 'What happens if a member’s payment fails or expires?',
      a: 'Tadex automatically removes their VIP access when their subscription expires or fails. You don’t have to manually track or remove them.',
    },
    {
      q: 'Can I offer both free and paid communities?',
      a: 'Yes. You can have a free Telegram group (free plan) and one or more paid VIP groups (paid plans). Each channel is mapped to a specific plan in Tadex.',
    },
    {
      q: 'Is there a minimum number of members to become a provider?',
      a: 'No. You can start with a small group and scale. Tadex works the same whether you have 10 members or 1,000.',
    },
    {
      q: 'Can I change my prices later?',
      a: 'Yes. You can update plan prices or create new plans at any time. Existing subscribers usually keep their current plan terms until renewal (details shown in your dashboard).',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <section className="py-20 lg:py-24 bg-surface-primary" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          {/* Section Header */}
          <div className="max-w-[680px] mb-12">
            <h2 className="heading-2 text-content-primary mb-4">
              Frequently Asked Questions (Providers)
            </h2>
            <p className="title-1 text-content-secondary">
              Everything you need to know about monetizing and automating your signal business on Tadex.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((item, index) => {
              const isOpen = openItems.includes(index);

              return (
                <div
                  key={index}
                  className="bg-surface-subtle border border-surface-elevated rounded-2xl transition-colors duration-300 ease-weighted"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 rounded-2xl transition-colors duration-300 ease-weighted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-lg bg-surface-secondary border border-surface-elevated text-brand-accent flex items-center justify-center flex-shrink-0">
                        <QuestionIcon size={18} />
                      </div>
                      <span className="title-2 text-content-primary">
                        {item.q}
                      </span>
                    </div>

                    <CaretDownIcon
                      size={20}
                      className={`text-content-tertiary transition-transform duration-500 ease-weighted flex-shrink-0 ${
                        isOpen ? 'rotate-180 text-brand-accent' : 'rotate-0'
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-0 pl-16 transition-opacity duration-300 ease-weighted opacity-100">
                      <p className="body-3 text-content-secondary">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
