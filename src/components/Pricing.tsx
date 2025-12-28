'use client';

import { Button } from '@/components/ui/button';
import { Check, Star, Zap, Crown, Shield } from 'lucide-react';

interface PricingProps {
  onPlanSelect: (plan: string) => void;
}

export default function Pricing({ onPlanSelect }: PricingProps) {
  const plans = [
    {
      name: 'Free Trial',
      price: '0',
      period: 'for 14 days',
      originalPrice: null,
      icon: Zap,
      popular: false,
      features: [
        'All core features enabled',
        'Connect one exchange account',
        'Up to 10 automated trades',
        'Basic support',
        'Real-time execution',
        'Performance tracking'
      ],
      cta: 'Start Free Trial',
      description: 'Perfect for testing our platform',
      color: 'border-slate-200 bg-white',
      planId: 'free-trial'
    },
    {
      name: 'Basic Plan',
      price: '10',
      period: 'per month',
      originalPrice: '$19',
      icon: Star,
      popular: true,
      features: [
        'Everything in Free Trial',
        'Unlimited trade automation',
        'Connect up to 3 exchange accounts',
        'Advanced risk management',
        'Email support',
        'Custom position sizing',
        'Multiple signal providers'
      ],
      cta: 'Reserve Basic Plan',
      description: 'Most popular for individual traders',
      color: 'border-[#00B894] bg-gradient-to-br from-white to-[#00B894]/5 relative',
      planId: 'basic'
    },
    {
      name: 'Premium Plan',
      price: '49',
      period: 'per month',
      originalPrice: '$99',
      icon: Crown,
      popular: false,
      features: [
        'Everything in Basic',
        'Unlimited exchange accounts',
        'Priority execution & alerts',
        'Advanced analytics dashboard',
        'Custom strategy builder',
        'Priority support (24/7)',
        'API access',
        'Portfolio management tools'
      ],
      cta: 'Reserve Premium',
      description: 'For professional traders and teams',
      color: 'border-[#004859] bg-gradient-to-br from-white to-[#004859]/5',
      planId: 'premium'
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative" id="pricing">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23004859%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#004859]/10 text-[#004859] px-4 py-2 rounded-full text-sm font-medium mb-4">
            Simple Pricing
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[#004859]">
            Choose Your Plan
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Reserve your spot now and get exclusive launch pricing when we go live.
          </p>
          
          {/* Launch Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-[#00B894] to-[#00A085] text-white px-6 py-3 rounded-full font-semibold mb-8">
            🚀 Launching Soon - Reserve Your Spot & Save 50%
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.name}
                className={`relative p-8 border-2 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${plan.color}`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-[#00B894] to-[#00A085] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Launch Discount Badge */}
                {plan.planId !== 'free-trial' && (
                  <div className="absolute -top-2 -right-2">
                    <div className="bg-red-500 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse">
                      50% OFF
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 ${
                    plan.popular ? 'bg-[#00B894]/20' : 'bg-[#004859]/10'
                  }`}>
                    <IconComponent className={`w-8 h-8 ${
                      plan.popular ? 'text-[#00B894]' : 'text-[#004859]'
                    }`} />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2 text-[#004859]">
                    {plan.name}
                  </h3>
                  
                  <p className="text-slate-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-2">
                    {plan.originalPrice && (
                      <span className="text-lg text-slate-400 line-through mr-2">
                        {plan.originalPrice}
                      </span>
                    )}
                    <span className="text-5xl font-bold text-[#004859]">
                      ${plan.price}
                    </span>
                  </div>
                  
                  <p className="text-slate-600">{plan.period}</p>
                  
                  {/* Launch Pricing Note */}
                  {plan.planId !== 'free-trial' && (
                    <p className="text-sm text-[#00B894] font-medium mt-2">
                      Launch price: ${Math.round(parseInt(plan.price) * 0.5)}/month
                    </p>
                  )}
                </div>

                {/* Features List */}
                <div className="mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#00B894] flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Button 
                  onClick={() => onPlanSelect(plan.planId)}
                  className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-[#00B894] to-[#00A085] hover:from-[#00A085] hover:to-[#009B7A] text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                      : 'bg-[#004859] hover:bg-[#00323B] text-white'
                  }`}
                >
                  {plan.cta}
                </Button>

                {/* Security Badge */}
                {index === 0 && (
                  <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                    <Shield className="w-4 h-4" />
                    No credit card required
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Features */}
        <div className="text-center bg-white rounded-2xl p-8 lg:p-12 border border-slate-200 shadow-sm">
          <h3 className="text-2xl font-bold text-[#004859] mb-6">
            All Plans Include
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-600">
            <div className="flex items-center justify-center gap-3">
              <Shield className="w-5 h-5 text-[#00B894]" />
              <span>Bank-level security</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-5 h-5 text-[#00B894]" />
              <span>Automate your crypto trades safely using real signals</span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Star className="w-5 h-5 text-[#00B894]" />
              <span>99.9% uptime guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}