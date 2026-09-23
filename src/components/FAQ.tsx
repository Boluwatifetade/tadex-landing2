'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
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
      a: 'We support major exchanges like Bybit, Binance, and OKX. If your exchange isn’t listed, you can often integrate it via webhooks.',
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

  return (
    <section className="py-20 lg:py-28 bg-white border-t border-slate-200" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#004859]/10 text-[#004859] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            Answers & Clarity
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#004859]">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-600">
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