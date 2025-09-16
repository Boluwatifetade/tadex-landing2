'use client';
import { Link, Settings, Play, BarChart3, ArrowRight, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      icon: Link,
      title: 'Sign Up & Connect Exchange',
      desc: 'Create your Tadex account and securely connect your Bybit (or supported broker) API keys.',
      features: ['Bank-level security', 'Read-only permissions', '2-minute setup']
    },
    {
      number: '2',
      icon: Settings,
      title: 'Choose Signal Provider',
      desc: 'Select from vetted signal providers or import your own to automate their strategies instantly.',
      features: ['Verified providers', 'Performance history', 'Custom strategies']
    },
    {
      number: '3',
      icon: Play,
      title: 'Set Your Risk Preferences',
      desc: 'Control position size, stop-loss and take-profit levels to fit your risk appetite.',
      features: ['Custom risk levels', 'Position sizing', 'Auto stop-loss']
    },
    {
      number: '4',
      icon: BarChart3,
      title: 'Trade Automatically',
      desc: 'Tadex executes signals in real time, logs every trade and tracks your performance.',
      features: ['Real-time execution', 'Detailed analytics', 'Performance tracking']
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-white relative" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#004859]/10 text-[#004859] px-4 py-2 rounded-full text-sm font-medium mb-4">
            Simple Process
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#004859]">
            How It Works
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Get started with automated trading in 4 simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line (Hidden on mobile) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-[#004859] via-[#00B894] to-[#004859] z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div
                  key={step.number}
                  className="relative group"
                >
                  {/* Card */}
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-[#004859]/30 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 text-center h-full flex flex-col">
                    {/* Step Number */}
                    <div className="relative mx-auto mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#004859] to-[#006B7C] rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {step.number}
                      </div>
                      <div className="absolute inset-0 bg-[#00B894] rounded-full animate-ping opacity-20"></div>
                    </div>

                    {/* Icon */}
                    <div className="mx-auto mb-4 w-12 h-12 bg-[#004859]/10 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-[#004859]" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold mb-4 text-[#004859] group-hover:text-[#006B7C] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                      {step.desc}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2">
                      {step.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center gap-2 text-sm text-slate-500">
                          <CheckCircle className="w-4 h-4 text-[#00B894]" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Arrow (Hidden on last item and mobile) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-24 -right-4 z-20 w-8 h-8 items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-[#00B894]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-20 text-center bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-8 lg:p-12 border border-slate-200">
          <h3 className="text-2xl md:text-3xl font-bold text-[#004859] mb-4">
            Ready to Start Automated Trading?
          </h3>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of traders who&apos;ve already automated their success with Tadex
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="inline-flex items-center bg-[#004859] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#00323B] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl">
              <Play className="w-5 h-5 mr-2" />
              Start Free Trial
            </div>
            <div className="text-slate-500 text-sm">
              No credit card required • 14-day free trial
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}