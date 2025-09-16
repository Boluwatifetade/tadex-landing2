'use client';
import { Zap, Brain, TrendingUp, Radio, BarChart3, Shield } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Automated Execution',
      desc: 'Connect your exchange and let Tadex handle entries, exits, stop-losses and take-profits automatically.',
      color: 'text-[#00B894]',
      bgColor: 'bg-[#00B894]/10'
    },
    {
      icon: Brain,
      title: 'Remove Emotional Bias',
      desc: 'Eliminate FOMO, fear and emotional trading decisions that lead to losses.',
      color: 'text-[#004859]',
      bgColor: 'bg-[#004859]/10'
    },
    {
      icon: TrendingUp,
      title: 'Lightning Fast Performance',
      desc: 'Execute trades 3.2x faster than manual trading with zero missed opportunities.',
      color: 'text-[#00B894]',
      bgColor: 'bg-[#00B894]/10'
    },
    {
      icon: Radio,
      title: 'Signal Integration',
      desc: 'Subscribe to proven signal providers and automate their strategies instantly.',
      color: 'text-[#004859]',
      bgColor: 'bg-[#004859]/10'
    },
    {
      icon: BarChart3,
      title: 'Provider Dashboard',
      desc: 'Signal providers can easily input trades and monetize their expertise.',
      color: 'text-[#00B894]',
      bgColor: 'bg-[#00B894]/10'
    },
    {
      icon: Shield,
      title: 'Advanced Analytics',
      desc: 'Track performance, win rates and optimize your automated trading strategies.',
      color: 'text-[#004859]',
      bgColor: 'bg-[#004859]/10'
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-white relative" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#004859]/10 text-[#004859] px-4 py-2 rounded-full text-sm font-medium mb-4">
            Built for Success
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#004859]">
            Built for Smarter Trading
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to automate your trading strategy and maximize profits
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={feature.title}
                className="group relative bg-white p-8 rounded-2xl border border-slate-200 hover:border-[#004859]/20 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${feature.bgColor} mb-6`}>
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
          <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#004859] to-[#006B7C] text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 cursor-pointer">
            <TrendingUp className="w-5 h-5" />
            Start Your Free Trial Today
          </div>
        </div>
      </div>
    </section>
  );
}