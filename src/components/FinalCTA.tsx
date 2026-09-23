'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';
import Link from 'next/link';

export default function FinalCTA() {
  return (
    <section className="relative bg-slate-950 text-white overflow-hidden py-20 lg:py-28 border-t border-slate-800">
      {/* Subtle Background Radial Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#004859]/25 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-6">
          Ready to Stop Copying Trades Manually?
        </h2>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Join thousands of traders who already use Tadex to automate their signals and protect their capital.
        </p>

        {/* Primary CTA Button */}
        <div className="flex flex-col items-center justify-center mb-10">
          <Link href="#pricing">
            <Button
              size="lg"
              className="bg-[#00B894] hover:bg-[#00A085] text-slate-950 font-bold px-10 py-7 text-lg rounded-xl shadow-xl shadow-[#00B894]/20 transition-all duration-300 transform hover:scale-105"
            >
              Start Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <span className="text-xs text-slate-400 mt-3 font-medium">
            No credit card required
          </span>
        </div>

        {/* Trust Line */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00B894]" />
            <span>99.9% uptime</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#00B894]" />
            <span>Secure API handling</span>
          </div>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00B894]" />
            <span>Instant setup</span>
          </div>
        </div>
      </div>
    </section>
  );
}