'use client';

import { Button } from '@/components/ui/button';
import { Check, Zap, Crown, Radio, Shield, Sparkles } from 'lucide-react';

interface PricingProps {
  onPlanSelect: (plan: string) => void;
}

export default function Pricing({ onPlanSelect }: PricingProps) {
  return (
    <section className="py-20 lg:py-32 bg-slate-50 relative" id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#004859]/10 text-[#004859] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            Fair & Transparent
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#004859]">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Pay only for what you use. No hidden fees.
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {/* Card 1: Free */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  Free Tier
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                Free
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Best for: Trying Tadex and small setups
              </p>

              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-[#004859]">₦0</span>
                  <span className="text-sm text-slate-500 font-medium">/ forever</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Forever free</p>
              </div>

              <div className="mb-8">
                <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
                  Includes:
                </p>
                <ul className="space-y-3.5 text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span>Connect your exchange and Telegram</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span>Follow free signal communities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span><strong>12 automated trades</strong> per month across all free communities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span>Live execution logs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span>Basic risk controls</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <Button
                onClick={() => onPlanSelect('free')}
                className="w-full bg-[#004859] hover:bg-[#00323B] text-white py-6 text-base font-bold rounded-xl transition-all duration-200"
              >
                Start Free
              </Button>
              <p className="text-[11px] text-slate-500 text-center mt-2">
                No credit card required
              </p>
              <p className="text-[11px] text-slate-400 text-center mt-4 border-t border-slate-100 pt-3 leading-relaxed">
                Paid VIP groups set their own subscription price with the provider. Tadex does not charge extra for access.
              </p>
            </div>
          </div>

          {/* Card 2: Tadex Premium (Most Popular) */}
          <div className="bg-slate-900 text-white rounded-2xl border-2 border-[#00B894] p-8 shadow-2xl relative flex flex-col justify-between transform lg:-translate-y-2">
            {/* Most Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00B894] text-slate-950 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Most Popular
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 mt-1">
                <div className="w-12 h-12 rounded-xl bg-[#00B894]/20 text-[#00B894] flex items-center justify-center">
                  <Crown className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded-full">
                  Launch Special
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-1">
                Tadex Premium
              </h3>
              <p className="text-xs text-slate-300 mb-6">
                Best for: Serious traders following multiple providers or running multi-exchange setups
              </p>

              <div className="mb-6 pb-6 border-b border-slate-800">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg text-slate-400 line-through font-medium">₦10,000</span>
                  <span className="text-4xl font-extrabold text-[#00B894]">₦5,000</span>
                  <span className="text-sm text-slate-300 font-medium">/ month</span>
                </div>
                <p className="text-xs text-[#00B894] mt-1 font-semibold">
                  Launch price: ₦5,000/month (Monthly, cancel anytime)
                </p>
              </div>

              <div className="mb-8">
                <p className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
                  Everything in Free, plus:
                </p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span><strong>Unlimited automated trades</strong> for free communities</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span>Follow unlimited providers</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span>Connect multiple exchanges (Bybit, Binance, OKX, prop firms, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span><strong>Advanced risk controls:</strong> Portfolio drawdown limits, daily/weekly loss caps, per-provider sizing</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span><strong>Trade management tools:</strong> Auto break-even, trailing stops, partial closes</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span><strong>Advanced analytics:</strong> Per-provider PnL, execution quality (slippage, fill rate), correlation insights</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span>Audit-grade logs for prop firms and reporting</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <Button
                onClick={() => onPlanSelect('premium')}
                className="w-full bg-[#00B894] hover:bg-[#00A085] text-slate-950 font-black py-6 text-base rounded-xl shadow-lg transition-all duration-200"
              >
                Get Premium
              </Button>
              <p className="text-[11px] text-[#00B894] text-center mt-2 font-medium">
                Launch price: ₦5,000/month
              </p>
              <p className="text-[11px] text-slate-400 text-center mt-4 border-t border-slate-800 pt-3 leading-relaxed">
                If you join a paid VIP signal group, you pay the provider’s subscription price directly. Tadex Premium is for advanced automation and risk tools, not signal access.
              </p>
            </div>
          </div>

          {/* Card 3: For Signal Providers */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Radio className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                  For Providers
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-1">
                For Signal Providers
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Best for: Traders running Telegram signal groups or selling strategies
              </p>

              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="text-xl font-bold text-[#004859]">
                  Turn Your Signals Into a Business
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Keep majority of revenue • Tadex ~10% platform fee
                </p>
              </div>

              <div className="mb-8">
                <p className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-4">
                  Provider Features:
                </p>
                <ul className="space-y-3.5 text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span>Create up to 3 paid plans (e.g., Monthly VIP, Quarterly VIP, Free Community)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span>Set your own price and currency (NGN, USD, GHS, KES, etc.)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span><strong>Tadex handles:</strong> Subscriber billing, access control, automated execution, and payment reconciliation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span>You keep the majority of revenue; Tadex takes a small platform fee (around 10%)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#00B894] flex-shrink-0 mt-0.5" />
                    <span><strong>Dashboards for:</strong> Revenue, subscriber count, retention, churn, and optional follower performance</span>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <Button
                onClick={() => onPlanSelect('provider')}
                className="w-full bg-[#004859] hover:bg-[#00323B] text-white py-6 text-base font-bold rounded-xl transition-all duration-200"
              >
                Become a Provider
              </Button>
              <p className="text-[11px] text-slate-500 text-center mt-2">
                Talk to our team
              </p>
              <p className="text-[11px] text-slate-400 text-center mt-4 border-t border-slate-100 pt-3 leading-relaxed">
                Exact platform fee and settlement details are shown before you publish your first plan.
              </p>
            </div>
          </div>
        </div>

        {/* Small line under pricing */}
        <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-500 mb-12">
          <Shield className="w-4 h-4 text-[#00B894]" />
          <span>All plans include secure API handling and 99.9% uptime.</span>
        </div>

        {/* Explainer Block: How Tadex Pricing Works */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 max-w-4xl mx-auto shadow-sm">
          <h3 className="text-lg sm:text-xl font-bold text-[#004859] mb-4">
            How Tadex Pricing Works
          </h3>
          <div className="space-y-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#00B894] mt-2 flex-shrink-0"></span>
              <p>
                <strong>Free communities:</strong> Free tier includes 12 automated trades/month across all free channels. Upgrade to Tadex Premium for unlimited automation and advanced risk controls.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#00B894] mt-2 flex-shrink-0"></span>
              <p>
                <strong>Paid VIP communities:</strong> You pay the provider’s subscription price directly (set by them). Tadex takes a small platform fee (~10%) from the provider, not from you. Your trades execute automatically with no extra charge from Tadex.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-2 h-2 rounded-full bg-[#00B894] mt-2 flex-shrink-0"></span>
              <p>
                <strong>Tadex Premium:</strong> One monthly fee of ₦5,000 (launch price) for portfolio-wide automated risk controls, trailing stops, multiple connected exchanges, and deep execution analytics across all your providers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}