"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Star, CheckCircle, Zap, Crown, DollarSign, Shield} from 'lucide-react';

interface PlanWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: string;
}

export default function PlanWaitlistModal({ isOpen, onClose, selectedPlan }: PlanWaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [tradingVolume, setTradingVolume] = useState('');
  const [currentTool, setCurrentTool] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const planDetails = {
    'free-trial': {
      name: 'Free Trial',
      icon: Zap,
      price: 'Free',
      color: 'from-[#004859] to-[#006B7C]',
      benefits: ['Test all features', '14-day access', 'No commitment'],
      discount: null
    },
    'basic': {
      name: 'Basic Plan',
      icon: Star,
      price: '$5/month',
      originalPrice: '$10/month',
      color: 'from-[#00B894] to-[#00A085]',
      benefits: ['50% launch discount', 'Unlimited automation', 'Priority support'],
      discount: '50%'
    },
    'premium': {
      name: 'Premium Plan', 
      icon: Crown,
      price: '$24/month',
      originalPrice: '$49/month',
      color: 'from-[#004859] to-[#006B7C]',
      benefits: ['50% launch discount', 'Advanced analytics', 'Custom strategies'],
      discount: '50%'
    }
  };

  const plan = planDetails[selectedPlan as keyof typeof planDetails] as {
  name: string;
  icon: typeof Star;
  price: string;
  originalPrice?: string; // optional now
  color: string;
  benefits: string[];
  discount: string | null;
  };

  const IconComponent = plan?.icon || Star;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/plan-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          selectedPlan,
          tradingVolume,
          currentTool
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      console.log('Plan interest submitted:', { email, selectedPlan });
      setIsSubmitted(true);
      setEmail('');
      setTradingVolume('');
      setCurrentTool('');
      
      // Auto-close modal after success
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Error submitting plan interest:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !plan) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className={`relative bg-gradient-to-r ${plan.color} text-white p-6 rounded-t-2xl`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Reserve Your {plan.name}</h2>
            <div className="flex items-center justify-center gap-2 mb-2">
              {plan.originalPrice && (
                <span className="text-lg line-through text-white/70">{plan.originalPrice}</span>
              )}
              <span className="text-3xl font-bold">{plan.price}</span>
            </div>
            {plan.discount && (
              <p className="text-green-200 font-semibold">Save {plan.discount} at launch!</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isSubmitted ? (
            <>
              {/* Benefits */}
              <div className="mb-6">
                <h3 className="font-semibold text-[#004859] mb-3">What you'll get:</h3>
                <div className="space-y-2">
                  {plan.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#00B894]" />
                      <span className="text-slate-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-slate-300 focus:border-[#004859] rounded-lg"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Monthly Trading Volume
                  </label>
                  <select 
                    value={tradingVolume}
                    onChange={(e) => setTradingVolume(e.target.value)}
                    className="w-full border border-slate-300 focus:border-[#004859] rounded-lg py-2 px-3 bg-white"
                  >
                    <option value="">Select volume...</option>
                    <option value="under-1k">Under $1,000</option>
                    <option value="1k-10k">$1,000 - $10,000</option>
                    <option value="10k-50k">$10,000 - $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="over-100k">Over $100,000</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Current Trading Method
                  </label>
                  <select 
                    value={currentTool}
                    onChange={(e) => setCurrentTool(e.target.value)}
                    className="w-full border border-slate-300 focus:border-[#004859] rounded-lg py-2 px-3 bg-white"
                  >
                    <option value="">Select method...</option>
                    <option value="manual">Manual Trading</option>
                    <option value="3commas">3Commas</option>
                    <option value="cryptohopper">Cryptohopper</option>
                    <option value="other-bot">Other Trading Bot</option>
                    <option value="none">Just Getting Started</option>
                  </select>
                </div>
                
                <Button
                  type="submit"
                  className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Reserving Spot...
                    </div>
                  ) : (
                    <>
                      <DollarSign className="w-5 h-5 mr-2" />
                      Reserve My Spot
                    </>
                  )}
                </Button>
              </form>

              {/* Trust indicators */}
              <div className="mt-4 text-center text-xs text-slate-500">
                <p>🔒 No payment required • Cancel anytime • Exclusive launch pricing</p>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00B894]/20 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-[#00B894]" />
              </div>
              <h3 className="text-xl font-bold text-[#004859] mb-2">
                Your {plan.name} is Reserved! 🎉
              </h3>
              <p className="text-slate-600 mb-4">
                You'll be first to know when we launch with exclusive pricing.
              </p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Launch Benefits Secured</span>
                </div>
                <div className="text-sm text-green-700 space-y-1">
                  <p>✓ 50% discount locked in</p>
                  <p>✓ 2-week early access</p>
                  <p>✓ Priority onboarding</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}