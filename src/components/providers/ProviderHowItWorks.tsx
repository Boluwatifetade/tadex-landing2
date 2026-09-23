'use client';

import { UserPlus, PackagePlus, MessageSquare, Share2, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProviderHowItWorksProps {
  onOpenModal: () => void;
}

export default function ProviderHowItWorks({ onOpenModal }: ProviderHowItWorksProps) {
  const steps = [
    {
      number: '01',
      icon: UserPlus,
      title: 'Create Your Provider Account',
      bullets: [
        'Sign up as a signal provider on Tadex.',
        'Complete a short onboarding form (your niche, typical signals, target market).',
      ],
    },
    {
      number: '02',
      icon: PackagePlus,
      title: 'Create Your Plans',
      bullets: [
        'Define up to 3 plans: Plan name (e.g., “Monthly VIP”).',
        'Set price and currency (e.g., ₦30,000 NGN, $25 USD).',
        'Set duration (30 days, 90 days, etc.).',
        'Mark one plan as your free community if you want a free tier.',
      ],
    },
    {
      number: '03',
      icon: MessageSquare,
      title: 'Connect Your Telegram Channel',
      bullets: [
        'Add your Telegram VIP group or channel.',
        'Tadex verifies the bot’s access and maps the channel to your plan.',
        'You keep posting signals exactly as you do now.',
      ],
    },
    {
      number: '04',
      icon: Share2,
      title: 'Share Your Tadex Link With Members',
      bullets: [
        'Send your members a single Tadex checkout link.',
        'They subscribe, connect their exchange, and set their risk rules.',
        'Tadex handles billing, access, and automated execution from then on.',
      ],
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#004859]/10 text-[#004859] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            Easy Onboarding
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#004859]">
            From Telegram Group to Automated Business in 4 Steps
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            No code. No complex setup. Just connect, configure, and grow.
          </p>
        </div>

        {/* Mini Flow: Telegram -> Tadex -> Exchange */}
        <div className="mb-14 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white max-w-4xl mx-auto border border-slate-700 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2.5 rounded-lg border border-slate-700 w-full sm:w-auto justify-center">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>1. Telegram VIP Channel</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#00B894] hidden sm:block" />
            <div className="flex items-center gap-2 bg-slate-800/80 px-3.5 py-2.5 rounded-lg border border-slate-700 w-full sm:w-auto justify-center">
              <span className="w-2 h-2 rounded-full bg-[#00B894]"></span>
              <span>2. Tadex Billing & Signal Engine</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#00B894] hidden sm:block" />
            <div className="flex items-center gap-2 bg-emerald-950/80 text-emerald-300 px-3.5 py-2.5 rounded-lg border border-emerald-800 w-full sm:w-auto justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold">3. Member Exchange Accounts (Bybit/Binance)</span>
            </div>
          </div>
        </div>

        {/* 4 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative bg-slate-50 hover:bg-white rounded-2xl p-6 lg:p-7 border border-slate-200 hover:border-[#004859]/30 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-black text-[#004859]/30 font-mono">
                      {step.number}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-[#004859]/10 text-[#004859] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    {step.title}
                  </h3>

                  <ul className="space-y-3">
                    {step.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Under Steps */}
        <div className="text-center">
          <Button
            size="lg"
            onClick={onOpenModal}
            className="bg-[#00B894] hover:bg-[#00A085] text-slate-950 font-bold px-8 py-6 text-base rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            Become a Provider
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Talk to our team
          </p>
        </div>
      </div>
    </section>
  );
}
