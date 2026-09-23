'use client';

import { Button } from '@/components/ui/button';
import { Play, ArrowRight, ShieldCheck, Zap, Activity } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const YOUTUBE_DEMO_URL = "https://youtu.be/7cLw92poCss";

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden py-16 sm:py-24 lg:py-32 border-b border-slate-800">
      {/* Subtle Grid Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Ambient Radial Gradient Accent */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#004859]/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00B894]/15 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 text-left">
            {/* Live Indicator Chip */}
            <div className="inline-flex items-center gap-2 bg-[#00B894]/15 border border-[#00B894]/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#00B894] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#00B894] animate-pulse"></span>
              Non-Custodial Cloud Execution
            </div>

            {/* H1 Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
              Automate Your Trading Signals.{' '}
              <span className="text-[#00B894] block mt-1">No More Manual Copying.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Connect your Telegram groups and exchanges. Tadex reads signals and places trades for you 24/7—so you don’t miss entries or make costly mistakes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6">
              <div className="flex flex-col items-center sm:items-start">
                <Link href="#pricing" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-[#00B894] hover:bg-[#00A085] text-slate-950 font-bold px-8 py-6 text-base rounded-xl shadow-lg shadow-[#00B894]/20 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Start Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <span className="text-xs text-slate-400 mt-2">
                  No credit card required
                </span>
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <Link href={YOUTUBE_DEMO_URL} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-slate-900/60 hover:bg-slate-800 text-slate-200 border border-slate-700 px-6 py-6 text-base font-medium rounded-xl backdrop-blur-sm transition-all"
                  >
                    <Play className="w-4 h-4 mr-2 text-[#00B894]" />
                    Watch 2‑min Demo
                  </Button>
                </Link>
              </div>
            </div>

            {/* Trust Line */}
            <div className="pt-2 text-xs sm:text-sm font-medium text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#00B894]" />
              <span>99.9% uptime</span>
              <span className="text-slate-600">•</span>
              <span>2,000+ users</span>
              <span className="text-slate-600">•</span>
              <span>Instant setup</span>
            </div>
          </div>

          {/* Right Column: Terminal Product Visual */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Terminal Frame */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 shadow-2xl backdrop-blur-md overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                    <span className="text-xs font-mono text-slate-400 ml-2">tadex-execution-node v2.4</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                    <Activity className="w-3 h-3 animate-pulse" />
                    <span>ENGINE LIVE</span>
                  </div>
                </div>

                {/* Terminal Content Body */}
                <div className="p-5 font-mono text-xs space-y-4">
                  {/* Step 1: Telegram Signal Ingest */}
                  <div className="rounded-lg bg-slate-950/60 p-3.5 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 mb-2">
                      <span className="text-[#00B894] font-semibold flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" /> 1. Ingest Signal
                      </span>
                      <span className="text-[10px] text-slate-500">Telegram VIP</span>
                    </div>
                    <div className="text-slate-200 bg-slate-900/90 p-2.5 rounded border border-slate-800/70 font-mono text-[11px] leading-relaxed">
                      <span className="text-amber-400">#BTC/USDT</span> BUY ZONE: <span className="text-emerald-400">$68,400</span><br />
                      SL: <span className="text-red-400">$66,200</span> | TP1: <span className="text-emerald-400">$70,500</span> | TP2: <span className="text-emerald-400">$72,500</span>
                    </div>
                  </div>

                  {/* Step 2: Risk Guard Verification */}
                  <div className="rounded-lg bg-slate-950/60 p-3.5 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-400 mb-1.5">
                      <span className="text-sky-400 font-semibold">2. Pre-Trade Risk Rules</span>
                      <span className="text-emerald-400 text-[10px] font-bold">PASSED</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                      <div className="bg-slate-900/80 p-2 rounded border border-slate-800/60">
                        <span className="text-slate-500 text-[10px] block">Position Sizing</span>
                        <span className="font-semibold text-slate-200">2.0% Account Risk</span>
                      </div>
                      <div className="bg-slate-900/80 p-2 rounded border border-slate-800/60">
                        <span className="text-slate-500 text-[10px] block">Max Drawdown Guard</span>
                        <span className="font-semibold text-emerald-400">Safe (OK)</span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Bybit Execution Dispatch */}
                  <div className="rounded-lg bg-emerald-950/30 p-3.5 border border-emerald-700/40">
                    <div className="flex items-center justify-between text-slate-400 mb-1.5">
                      <span className="text-emerald-400 font-semibold">3. Exchange Dispatch</span>
                      <span className="text-[10px] text-slate-400">Latency: 14ms</span>
                    </div>
                    <div className="bg-slate-900/90 p-2.5 rounded border border-emerald-800/40 text-[11px] space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Target Exchange:</span>
                        <span className="font-bold text-white">Bybit Futures</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Order Placed:</span>
                        <span className="text-emerald-400 font-bold">Market Buy BTCUSDT</span>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                        <span className="text-slate-400">Execution Status:</span>
                        <span className="bg-emerald-500 text-slate-950 font-extrabold px-2 py-0.5 rounded text-[10px]">
                          FILLED @ $68,402
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* High-Level Visual Flow Banner */}
                  <div className="bg-gradient-to-r from-[#004859]/30 to-[#00B894]/20 border border-[#00B894]/40 rounded-xl p-3 text-center">
                    <div className="text-[11px] font-bold text-slate-200">
                      <span className="text-slate-400">Signal:</span> <span className="text-amber-300">BTC Long</span>
                      <span className="text-slate-500 mx-1.5">→</span>
                      <span className="text-slate-400">Exchange:</span> <span className="text-white">Bybit</span>
                      <span className="text-slate-500 mx-1.5">→</span>
                      <span className="text-slate-400">Status:</span> <span className="text-[#00B894]">Filled</span>
                    </div>
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