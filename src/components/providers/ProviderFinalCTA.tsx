'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, CreditCard, LayoutDashboard, Coins } from 'lucide-react';

interface ProviderFinalCTAProps {
  onOpenModal: () => void;
}

export default function ProviderFinalCTA({ onOpenModal }: ProviderFinalCTAProps) {
  return (
    <section className="relative bg-slate-950 text-white overflow-hidden py-20 lg:py-28 border-t border-slate-800">
      {/* Subtle Background Radial Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#004859]/25 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6">
          Ready to Professionalize Your Signal Business?
        </h2>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Join providers who use Tadex to automate billing, access, and execution—so they can focus on trading and growth.
        </p>

        {/* Primary CTA Button */}
        <div className="flex flex-col items-center justify-center mb-10">
          <Button
            size="lg"
            onClick={onOpenModal}
            className="bg-[#00B894] hover:bg-[#00A085] text-slate-950 font-black px-10 py-7 text-lg rounded-xl shadow-xl shadow-[#00B894]/20 transition-all duration-300 transform hover:scale-105"
          >
            Become a Provider
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <span className="text-xs text-[#00B894] mt-3 font-semibold">
            Talk to our team
          </span>
        </div>

        {/* Trust Line */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#00B894]" />
            <span>Automated billing</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-4 h-4 text-[#00B894]" />
            <span>Revenue dashboard</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-[#00B894]" />
            <span>Multi-currency support</span>
          </div>
        </div>
      </div>
    </section>
  );
}
