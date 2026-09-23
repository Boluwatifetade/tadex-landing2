'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Radio, TrendingUp, Users, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';

interface ProviderHeroProps {
  onOpenModal: () => void;
}

export default function ProviderHero({ onOpenModal }: ProviderHeroProps) {
  return (
    <section className="relative bg-slate-950 text-white overflow-hidden py-16 sm:py-24 lg:py-32 border-b border-slate-800">
      {/* Subtle Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Ambient Gradient Highlights */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#004859]/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00B894]/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 text-left">
            {/* Live Indicator Chip */}
            <div className="inline-flex items-center gap-2 bg-[#00B894]/15 border border-[#00B894]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#00B894] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00B894] animate-pulse"></span>
              Built for Telegram Signal Communities
            </div>

            {/* H1 Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
              Turn Your Signal Group Into a Real Business
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Tadex handles billing, access control, and automated execution for your members. You focus on trading—not chasing payments or removing expired users.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-3">
              <div className="flex flex-col items-center sm:items-start">
                <Button
                  size="lg"
                  onClick={onOpenModal}
                  className="w-full sm:w-auto bg-[#00B894] hover:bg-[#00A085] text-slate-950 font-black px-8 py-6 text-base rounded-xl shadow-lg shadow-[#00B894]/20 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Become a Provider
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <span className="text-xs text-[#00B894] mt-2 font-medium">
                  Talk to our team
                </span>
              </div>
            </div>

            {/* Secondary line */}
            <p className="text-xs text-slate-400 mb-6">
              Launch support • Revenue dashboard • Automated subscriber management
            </p>

            {/* Trust line */}
            <div className="pt-2 text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00B894]" />
              <span>Used by signal providers across Nigeria, Kenya, Ghana, and beyond</span>
            </div>
          </div>

          {/* Right Column: Provider Dashboard Mock */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md overflow-hidden">
                {/* Dashboard Frame Header */}
                <div className="flex items-center justify-between px-5 py-4 bg-slate-950/90 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#004859] flex items-center justify-center text-white font-bold text-xs">
                      T
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Provider Portal</span>
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-mono">LIVE</span>
                      </div>
                      <div className="text-[11px] text-slate-400">@AlphaSignals VIP</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#00B894] font-medium bg-[#00B894]/10 px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00B894] animate-pulse"></span>
                    Bot Sync Active
                  </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 space-y-5">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="rounded-xl bg-slate-950/70 p-4 border border-slate-800">
                      <span className="text-slate-400 text-xs block mb-1">Active Plans</span>
                      <span className="text-2xl font-black text-white font-mono">3</span>
                      <span className="text-[10px] text-emerald-400 block mt-1">Free, Monthly, Quarterly</span>
                    </div>

                    <div className="rounded-xl bg-slate-950/70 p-4 border border-slate-800">
                      <span className="text-slate-400 text-xs block mb-1">Monthly Revenue</span>
                      <span className="text-2xl font-black text-[#00B894] font-mono">₦1,250,000</span>
                      <span className="text-[10px] text-slate-400 block mt-1">+18.4% this month</span>
                    </div>
                  </div>

                  {/* Connected Channel Card */}
                  <div className="rounded-xl bg-slate-950/70 p-4 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-xs block">Connected Channel</span>
                      <span className="font-bold text-white text-sm">@AlphaSignals VIP</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">84 Active Subscribers</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                      <Radio className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Live Activity Feed Item */}
                  <div className="rounded-xl bg-emerald-950/20 p-3.5 border border-emerald-800/40 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-emerald-400 font-semibold">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> New Automated Subscriber
                      </span>
                      <span className="text-[10px] text-slate-400">2m ago</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      @crypto_trader subscribed to <strong>Monthly VIP (₦30,000)</strong>. Payment verified, Telegram VIP access granted, Bybit execution linked.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
