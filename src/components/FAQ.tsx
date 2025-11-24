'use client';
import { useState } from 'react';
import { ChevronDown, Shield, HelpCircle, Smartphone, Clock, DollarSign, Settings, Mail, Calendar } from 'lucide-react';

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default
  const [activeCategory, setActiveCategory] = useState('All');

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const categories = ['All', 'General', 'Technical', 'Security', 'Billing'];
  
  const faqs = [
    {
      icon: Smartphone,
      q: 'Do I need to download an app?',
      a: 'No! Tadex works entirely inside Telegram. If you have Telegram installed, you already have Tadex. Just search for @TradeSwiftNowBot to start.',
      category: 'General'
    },
    {
      icon: DollarSign,
      q: 'Is it free to use?',
      a: 'Yes, Tadex is completely free during our Public Beta period. You can automate trades on Bybit Mainnet or Testnet without any subscription fees.',
      category: 'Billing'
    },
    {
      icon: Shield,
      q: 'How secure are my API keys?',
      a: 'Extremely secure. We encrypt your keys using AES-256 (military-grade encryption) before storing them in an isolated database. We never ask for withdrawal permissions—only trade permissions.',
      category: 'Security'
    },
    {
      icon: Settings,
      q: 'Does it work with Binance or OKX?',
      a: 'Currently, we support Bybit (Unified Trading Accounts) for the best speed and reliability. Binance, OKX, and others are on our roadmap for Q2 2026.',
      category: 'Technical'
    },
    {
      icon: Clock,
      q: 'What happens if I lose internet connection?',
      a: 'Tadex runs on the cloud, not your phone. Once you send a signal or activate automation, the bot manages the trade 24/7, even if your phone is off.',
      category: 'Technical'
    },
    {
      icon: HelpCircle,
      q: 'What is Tadex?',
      a: 'Tadex is an automated crypto trading platform that connects directly to your exchange and executes trades instantly based on signals from verified providers. It eliminates emotional trading and ensures you never miss profitable opportunities.',
      category: 'General'
    },
    {
      icon: Settings,
      q: 'How fast are trade executions?',
      a: 'Tadex executes trades in milliseconds - 3.2x faster than manual trading. Our infrastructure is optimized for high-frequency trading with 99.9% uptime and direct API connections to exchanges.',
      category: 'Technical'
    },
    {
      icon: DollarSign,
      q: 'Can I cancel anytime?',
      a: 'Yes, you can cancel your subscription at any time directly from your dashboard. There are no cancellation fees, and you\'ll retain access to your account until the end of your billing period.',
      category: 'Billing'
    }
  ];

  const filteredFaqs = activeCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-white relative" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#004859]/10 text-[#004859] px-4 py-2 rounded-full text-sm font-medium mb-4">
            Got Questions?
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#004859]">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to know about Tadex automated trading
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[#004859] text-white shadow-lg'
                  : 'bg-white text-slate-600 hover:bg-[#004859]/10 hover:text-[#004859] border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {filteredFaqs.map((item, index) => {
            const IconComponent = item.icon;
            const isOpen = openItems.includes(index);
            
            return (
              <div
                key={index}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left flex items-center gap-4 hover:bg-slate-50 transition-colors duration-200 group-hover:border-[#004859]/30"
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 bg-[#004859]/10 rounded-xl flex items-center justify-center group-hover:bg-[#00B894]/20 transition-colors duration-300">
                    <IconComponent className="w-5 h-5 text-[#004859] group-hover:text-[#00B894] transition-colors duration-300" />
                  </div>

                  {/* Question */}
                  <div className="flex-1 text-left">
                    <h3 className="font-semibold text-lg text-[#004859] mb-1 group-hover:text-[#006B7C] transition-colors duration-300">
                      {item.q}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Toggle Icon */}
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-400 transition-all duration-300 ${
                      isOpen ? 'transform rotate-180 text-[#00B894]' : 'group-hover:text-[#004859]'
                    }`} 
                  />
                </button>

                {/* Answer */}
                <div className={`transition-all duration-300 ease-in-out ${
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}>
                  <div className="px-6 pb-6 pt-0">
                    <div className="pl-14">
                      <p className="text-slate-600 leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center bg-gradient-to-r from-[#004859] to-[#006B7C] rounded-2xl p-8 lg:p-12 text-white shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Still Have Questions?
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Our support team is here to help you get started with automated trading
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-[#00B894] hover:bg-[#00A085] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Support
            </button>
            <button className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}