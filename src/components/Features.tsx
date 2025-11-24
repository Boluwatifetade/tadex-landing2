'use client';
import { Zap, Smartphone, TrendingUp, Radio, BarChart3, Shield, Brain } from 'lucide-react';
import Link from 'next/link';

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Instant Execution',
      desc: 'Tadex reads your signal and places the order on Bybit in milliseconds. Faster than humanly possible.',
      color: 'text-[#00B894]',
      bgColor: 'bg-[#00B894]/10',
      highlight: true
    },
    {
      icon: Smartphone,
      title: '100% Telegram Native',
      desc: 'No heavy apps or complex dashboards. Manage your entire trading portfolio directly from your chat app.',
      color: 'text-[#004859]',
      bgColor: 'bg-[#004859]/10'
    },
    {
      icon: Shield,
      title: 'Smart Risk Guard',
      desc: 'Set your risk per trade once (e.g., 2%). Tadex automatically calculates position size for every trade.',
      color: 'text-[#00B894]',
      bgColor: 'bg-[#00B894]/10',
      highlight: true
    },
    {
      icon: Brain,
      title: 'Remove Emotional Bias',
      desc: 'Eliminate FOMO, fear and emotional trading decisions that lead to losses with automated execution.',
      color: 'text-[#004859]',
      bgColor: 'bg-[#004859]/10'
    },
    {
      icon: Radio,
      title: 'Smart Signal Parsing',
      desc: 'Copy-paste signals from any VIP group. Our NLP engine understands entry, SL, and TP formats automatically.',
      color: 'text-[#00B894]',
      bgColor: 'bg-[#00B894]/10',
      highlight: true
    },
    {
      icon: BarChart3,
      title: 'Real-Time PnL Tracking',
      desc: 'Get notified the moment a trade hits profit. Receive daily summary reports of your trading performance.',
      color: 'text-[#004859]',
      bgColor: 'bg-[#004859]/10'
    },
    {
      icon: TrendingUp,
      title: 'Auto-Breakeven & Scaling',
      desc: 'Protect your gains. Tadex automatically moves Stop Loss to entry and scales positions at profit targets.',
      color: 'text-[#00B894]',
      bgColor: 'bg-[#00B894]/10',
      highlight: true
    },
    {
      icon: Shield,
      title: 'Advanced Analytics',
      desc: 'Track performance, win rates and optimize your automated trading strategies with detailed insights.',
      color: 'text-[#004859]',
      bgColor: 'bg-[#004859]/10'
    },
    {
      icon: Radio,
      title: 'Signal Provider Integration',
      desc: 'Subscribe to proven signal providers and automate their strategies instantly with one click.',
      color: 'text-[#00B894]',
      bgColor: 'bg-[#00B894]/10'
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 to-white relative" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#004859]/10 text-[#004859] px-4 py-2 rounded-full text-sm font-medium mb-4">
            Built for Success
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#004859]">
            Powerful Features, <span className="text-[#00B894]">Simplified</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            We stripped away the complexity of pro tools and kept the power. Everything you need to automate your trading strategy and maximize profits.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={feature.title}
                className="group relative bg-white p-8 rounded-2xl border border-slate-200 hover:border-[#004859]/30 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Highlight Badge */}
                {feature.highlight && (
                  <div className="absolute -top-2 -right-2 bg-[#00B894] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    POPULAR
                  </div>
                )}

                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-7 h-7 ${feature.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-4 text-[#004859] group-hover:text-[#006B7C] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.desc}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#004859]/5 to-[#00B894]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#004859] to-[#006B7C] rounded-2xl p-8 lg:p-12 text-white shadow-xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Experience Automated Trading?
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
              Join thousands of traders who've transformed their trading with Tadex
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="https://t.me/TradeSwiftNowBot" 
                target="_blank"
                className="bg-[#00B894] hover:bg-[#00A085] text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Launch Telegram Bot
              </Link>
              <div className="text-blue-100 text-sm">
                No signup required • Instant access
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}