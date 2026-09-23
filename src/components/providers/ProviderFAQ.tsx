'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

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

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#004859]/10 text-[#004859] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            Provider Clarity
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#004859]">
            Frequently Asked Questions (Providers)
          </h2>
          <p className="mt-4 text-lg text-slate-600">
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
                className="bg-slate-50 border border-slate-200 rounded-2xl shadow-sm hover:border-[#004859]/30 transition-all duration-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 transition-colors duration-200 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-lg bg-[#004859]/10 text-[#004859] flex items-center justify-center flex-shrink-0">
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-base sm:text-lg text-slate-900">
                      {item.q}
                    </span>
                  </div>

                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'transform rotate-180 text-[#00B894]' : ''
                    }`}
                  />
                </button>

                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  } overflow-hidden`}
                >
                  <div className="px-6 pb-6 pt-0 pl-16">
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
