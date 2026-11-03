'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CloseIcon,
  CheckCircleIcon,
  LightningIcon,
  CrownIcon,
  BroadcastIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from '@/components/ui/PhosphorIcons';

interface PlanWaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: string;
}

interface PlanConfig {
  name: string;
  price: string;
  originalPrice?: string;
  subtitle: string;
  benefits: string[];
  badge: string;
  icon: typeof LightningIcon;
}

const PLAN_CONFIGS: Record<string, PlanConfig> = {
  free: {
    name: 'Free Plan',
    price: '₦0 / forever',
    subtitle: 'Forever free tier for trying Tadex and small setups',
    badge: 'Free Tier',
    icon: LightningIcon,
    benefits: [
      '12 automated trades per month across all free communities',
      'Connect your exchange (Bybit, Binance, OKX) and Telegram',
      'Live execution logs and basic risk controls',
    ],
  },
  premium: {
    name: 'Tadex Premium',
    price: '₦5,000 / month',
    originalPrice: '₦10,000',
    subtitle: '50% launch discount locked in · Monthly, cancel anytime',
    badge: 'Launch Special',
    icon: CrownIcon,
    benefits: [
      'Unlimited automated trades across free communities',
      'Connect multiple exchanges and follow unlimited providers',
      'Portfolio drawdown limits, trailing stops, and execution analytics',
    ],
  },
  provider: {
    name: 'For Signal Providers',
    price: '~90% Revenue Share',
    subtitle: 'Automated billing, VIP access control, and member execution',
    badge: 'For Providers',
    icon: BroadcastIcon,
    benefits: [
      'Create up to 3 paid VIP plans in NGN, USD, GHS, or KES',
      'Automatic Telegram VIP access grant and expiry removal',
      'Automated signal execution on member exchange accounts',
    ],
  },
  'free-trial': {
    name: 'Free Plan',
    price: '₦0 / forever',
    subtitle: 'Forever free tier for trying Tadex and small setups',
    badge: 'Free Tier',
    icon: LightningIcon,
    benefits: [
      '12 automated trades per month across all free communities',
      'Connect your exchange and Telegram',
      'Live execution logs and basic risk controls',
    ],
  },
  basic: {
    name: 'Tadex Premium',
    price: '₦5,000 / month',
    originalPrice: '₦10,000',
    subtitle: '50% launch discount locked in · Monthly, cancel anytime',
    badge: 'Launch Special',
    icon: CrownIcon,
    benefits: [
      'Unlimited automated trades across free communities',
      'Advanced risk controls and multi exchange routing',
      'Priority support and audit grade execution logs',
    ],
  },
};

export default function PlanWaitlistModal({
  isOpen,
  onClose,
  selectedPlan,
}: PlanWaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [eventVolume, setEventVolume] = useState('');
  const [currentTool, setCurrentTool] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const plan = PLAN_CONFIGS[selectedPlan] || PLAN_CONFIGS.premium;
  const IconComponent = plan.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/plan-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          selectedPlan: selectedPlan || 'premium',
          eventVolume,
          currentTool,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Request failed. Check your email and try again.');
      }

      setIsSubmitted(true);
      setEmail('');
      setEventVolume('');
      setCurrentTool('');

      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 3000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Request failed. Check your connection and try again.';
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !selectedPlan) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="plan-modal-title"
      className="fixed inset-0 bg-surface-canvas/85 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-weighted"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-surface-primary border border-surface-elevated rounded-2xl max-w-lg w-full p-6 sm:p-8 text-content-primary">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 text-content-tertiary hover:text-content-primary hover:bg-surface-subtle p-2 rounded-lg transition-colors duration-300 ease-weighted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
        >
          <CloseIcon size={18} />
        </button>

        {!isSubmitted ? (
          <div>
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-accentSubtle border border-brand-accent/40 text-brand-accent flex items-center justify-center flex-shrink-0">
                <IconComponent size={24} />
              </div>
              <div>
                <span className="caption-3 text-brand-accent bg-brand-accentSubtle border border-brand-accent/40 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  {plan.badge}
                </span>
                <h2 id="plan-modal-title" className="heading-5 text-content-primary">
                  Start with {plan.name}
                </h2>
                <div className="flex items-baseline gap-2 mt-1">
                  {plan.originalPrice && (
                    <span className="body-5 line-through text-content-tertiary">
                      {plan.originalPrice}
                    </span>
                  )}
                  <span className="title-1 text-brand-accent">{plan.price}</span>
                </div>
                <p className="caption-4 text-content-secondary mt-1">
                  {plan.subtitle}
                </p>
              </div>
            </div>

            <div className="h-px bg-surface-elevated my-5" />

            {/* Benefits */}
            <div className="mb-6 bg-surface-subtle border border-surface-elevated rounded-xl p-4">
              <p className="caption-3 text-content-primary mb-3">
                Included in {plan.name}:
              </p>
              <div className="space-y-2.5">
                {plan.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <CheckCircleIcon
                      size={16}
                      className="text-brand-accent flex-shrink-0 mt-0.5"
                    />
                    <span className="body-6 text-content-secondary">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="plan-email-input"
                  className="block caption-3 text-content-secondary mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="plan-email-input"
                  type="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-subtle border border-surface-elevated focus:border-brand-accent text-content-primary placeholder:text-content-tertiary rounded-xl py-3 px-4 body-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="plan-volume-select"
                    className="block caption-3 text-content-secondary mb-1.5"
                  >
                    Monthly signal volume
                  </label>
                  <select
                    id="plan-volume-select"
                    value={eventVolume}
                    onChange={(e) => setEventVolume(e.target.value)}
                    className="w-full bg-surface-subtle border border-surface-elevated focus:border-brand-accent text-content-primary rounded-xl py-3 px-3 body-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                  >
                    <option value="">Select volume</option>
                    <option value="under-20">Under 20 trades / mo</option>
                    <option value="20-100">20 to 100 trades / mo</option>
                    <option value="over-100">Over 100 trades / mo</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="plan-exchange-select"
                    className="block caption-3 text-content-secondary mb-1.5"
                  >
                    Primary exchange
                  </label>
                  <select
                    id="plan-exchange-select"
                    value={currentTool}
                    onChange={(e) => setCurrentTool(e.target.value)}
                    className="w-full bg-surface-subtle border border-surface-elevated focus:border-brand-accent text-content-primary rounded-xl py-3 px-3 body-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                  >
                    <option value="">Select exchange</option>
                    <option value="bybit">Bybit</option>
                    <option value="binance">Binance</option>
                    <option value="okx">OKX</option>
                    <option value="multi">Multiple exchanges</option>
                  </select>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-surface-subtle border border-status-danger/50 rounded-xl p-3">
                  <p className="caption-4 text-status-danger">{errorMsg}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-accent hover:bg-brand-accentHover text-content-inverted py-3 px-4 rounded-xl button-md transition-[background-color,transform] duration-300 ease-weighted active:scale-[0.98] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                {isLoading ? 'Reserving plan...' : `Continue with ${plan.name}`}
              </button>
            </form>

            <div className="h-px bg-surface-elevated my-4" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 caption-4 text-content-tertiary">
              <span>No payment required today · Cancel anytime</span>
              <Link
                href="/register"
                onClick={onClose}
                className="text-brand-accent hover:underline inline-flex items-center gap-1 caption-3"
              >
                <span>Open live account</span>
                <ArrowRightIcon size={14} />
              </Link>
            </div>
          </div>
        ) : (
          /* Success State (Calm & Specific per B8) */
          <div className="text-center py-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-accentSubtle border border-brand-accent/40 text-brand-accent rounded-xl mb-4">
              <CheckCircleIcon size={24} />
            </div>
            <h3 className="heading-5 text-content-primary mb-2">
              {plan.name} reserved
            </h3>
            <p className="body-6 text-content-secondary mb-6">
              Your plan selection and launch pricing have been linked to your email.
            </p>
            <div className="bg-surface-subtle border border-surface-elevated rounded-xl p-4 text-left space-y-2 mb-6">
              <div className="flex items-center gap-2 caption-3 text-brand-accent">
                <ShieldCheckIcon size={16} />
                <span>Account benefits locked</span>
              </div>
              <p className="caption-4 text-content-secondary">
                Launch pricing ({plan.price}) and priority onboarding are active for your account.
              </p>
            </div>
            <Link
              href="/register"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-md px-6 py-3 rounded-xl transition-colors duration-300 ease-weighted"
            >
              <span>Complete registration</span>
              <ArrowRightIcon size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}