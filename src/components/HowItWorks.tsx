'use client';

import { UserCheck, Key, Sliders, Zap, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: UserCheck,
      title: 'Create Your Account',
      bullets: [
        'Open Tadex in your browser.',
        'Sign up in under 2 minutes.',
        'No software to install.',
      ],
    },
    {
      number: '02',
      icon: Key,
      title: 'Connect Your Accounts',
      bullets: [
        'Add your exchange API keys (Bybit, Binance, OKX, etc.).',
        'Link your Telegram groups or webhooks.',
        'Everything is encrypted and secure.',
      ],
    },
    {
      number: '03',
      icon: Sliders,
      title: 'Set Your Rules',
      bullets: [
        'Choose which signals to act on.',
        'Define position size, stop loss, and risk limits.',
        'Add filters like “only trade BTC” or “only during London session.”',
      ],
    },
    {
      number: '04',
      icon: Zap,
      title: 'Let Tadex Handle the Rest',
      bullets: [
        'Signals come in → Tadex checks your rules → trades are placed.',
        'Watch live logs of every action.',
        'Adjust or pause anytime from your dashboard.',
      ],
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#004859]/10 text-[#004859] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            Simple 4-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#004859]">
            Set Up in Minutes, Not Days
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            No downloads. No complex code. Just connect, configure, and go.
          </p>
        </div>

        {/* Signal Flow Simulation Diagram */}
        <div className="mb-14 p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white max-w-4xl mx-auto border border-slate-700 shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700 w-full sm:w-auto justify-center">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span>1. Telegram Signal</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#00B894] hidden sm:block" />
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700 w-full sm:w-auto justify-center">
              <span className="w-2 h-2 rounded-full bg-[#00B894]"></span>
              <span>2. Tadex Risk Engine</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#00B894] hidden sm:block" />
            <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700 w-full sm:w-auto justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>3. Bybit API (Trade-Only)</span>
            </div>
            <ArrowRight className="w-4 h-4 text-[#00B894] hidden sm:block" />
            <div className="flex items-center gap-2 bg-emerald-950/80 text-emerald-300 px-3 py-2 rounded-lg border border-emerald-800 w-full sm:w-auto justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="font-bold">4. Order Filled</span>
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
          <Link href="#pricing">
            <Button
              size="lg"
              className="bg-[#00B894] hover:bg-[#00A085] text-slate-950 font-bold px-8 py-6 text-base rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <p className="text-xs text-slate-500 mt-2 font-medium">
            No credit card required
          </p>
        </div>
      </div>
    </section>
  );
}