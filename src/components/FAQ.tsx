'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { CaretDownIcon, QuestionIcon } from '@/components/ui/PhosphorIcons';

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqs = [
    {
      q: 'Do I need to install anything?',
      a: 'No. Tadex runs in your browser. You log in, connect your accounts, set your rules, and it works 24/7 in the cloud.',
    },
    {
      q: 'Is it really free to start?',
      a: 'Yes. The Free plan gives you all core features and up to 12 automated trades per month across free communities. No credit card required.',
    },
    {
      q: 'Which exchanges work with Tadex?',
      a: 'We support major exchanges like Bybit, Binance, and OKX. If your exchange is not listed, you can often integrate it via webhooks.',
    },
    {
      q: 'Is my money safe? What about my API keys?',
      a: 'Your API keys are encrypted and stored securely. We only allow trading actions you configure; withdrawals are not possible via our integration.',
    },
    {
      q: 'I’m new to trading. Is this suitable for beginners?',
      a: 'Yes. If you can follow a signal group and understand basic risk (size, stop loss), you can use Tadex. We handle the automation; you focus on learning and managing risk.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes. You can cancel or change your plan anytime from your dashboard. Your automations run until the end of your current billing period.',
    },
    {
      q: 'Does Tadex give trading advice or signals?',
      a: 'No. Tadex does not tell you what to trade. We automate the execution of signals and rules you choose.',
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
              Frequently Asked Questions
            </h2>
            <p className="title-1 text-content-secondary">
              Everything you need to know about automated execution with Tadex.
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