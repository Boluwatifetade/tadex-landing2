'use client';

import { Button } from '@/components/ui/button';
import { Check, ArrowRight, ShieldCheck, DollarSign, Wallet } from 'lucide-react';

interface ProviderPricingRevenueProps {
  onOpenModal: () => void;
}

export default function ProviderPricingRevenue({ onOpenModal }: ProviderPricingRevenueProps) {
  const featuresIncluded = [
    'Automated billing and subscription management',
    'Access control (grant/remove VIP access based on payment status)',
    'Automated signal execution for your members',
    'Revenue dashboard and transaction history',
    'Reduced chargeback and dispute risk (centralized records)',
    'Support for multiple currencies and payment methods',
  ];

  return (
    <section className="py-20 lg:py-32 bg-slate-50 relative" id="pricing-revenue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-[#004859]/10 text-[#004859] px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            Fair Revenue Share
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#004859]">
            Simple, Transparent Revenue Share
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            You set your prices. Tadex takes a small platform fee from each subscription.
          </p>
        </div>

        {/* Two-Column Revenue Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-12">
          {/* Left Column: How You Earn & Visual Split */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">How You Earn</h3>
                  <p className="text-xs text-slate-500">Autonomous billing & settlement</p>
                </div>
              </div>

              <div className="space-y-3.5 text-sm text-slate-600 leading-relaxed mb-8">
                <p>
                  You create paid plans and set your own prices (e.g., <strong>₦30,000/month VIP</strong>, <strong>$25/month VIP</strong>, etc.).
                </p>
                <p>
                  Members pay through Tadex checkout. Tadex processes the payment and splits it automatically:
                </p>
                <ul className="space-y-2 pl-2">
                  <li className="flex items-center gap-2 font-medium text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-[#00B894]"></span>
                    <span>You: ~90% of the subscription price</span>
                  </li>
                  <li className="flex items-center gap-2 font-medium text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-[#004859]"></span>
                    <span>Tadex: ~10% platform fee</span>
                  </li>
                </ul>
                <p className="text-xs text-slate-500 pt-1">
                  You receive your share according to the settlement schedule shown in your dashboard.
                </p>
              </div>

              {/* Concrete Example Visual Box */}
              <div className="rounded-xl bg-slate-900 text-white p-5 border border-slate-800">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Real-World Monthly Example
                </div>
                <div className="text-sm font-bold text-white mb-3">
                  Plan Price: <span className="text-[#00B894] font-mono text-base">₦30,000 / month</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
                  <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-900/40">
                    <span className="text-slate-400 block text-[10px]">YOU EARN (90%)</span>
                    <span className="text-lg font-black text-[#00B894]">₦27,000</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">per subscriber/mo</span>
                  </div>
                  <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">TADEX FEE (~10%)</span>
                    <span className="text-lg font-black text-slate-300">₦3,000</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">all-inclusive infra</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 mt-3 italic">
                  Exact percentage is configurable and shown before you publish your first plan.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: What You Get for That Fee */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#004859]/10 text-[#004859] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">What You Get for That Fee</h3>
                  <p className="text-xs text-slate-500">Everything required to operate at scale</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {featuresIncluded.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#00B894]/20 text-[#00B894] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm text-slate-700 leading-relaxed font-medium">
                      {feat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 p-4 rounded-xl text-xs leading-relaxed border border-emerald-200 dark:border-emerald-800">
                <strong>Transparent Guarantee:</strong> Tadex does not take a cut of your members’ trading PnL. Our fee is only on the subscription price you set.
              </div>
            </div>
          </div>
        </div>

        {/* CTA Under Section */}
        <div className="text-center max-w-sm mx-auto">
          <Button
            size="lg"
            onClick={onOpenModal}
            className="w-full bg-[#00B894] hover:bg-[#00A085] text-slate-950 font-black py-6 text-base rounded-xl shadow-lg transition-all"
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
