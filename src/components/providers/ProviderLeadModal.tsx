'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CloseIcon,
  CheckCircleIcon,
  BroadcastIcon,
  SendIcon,
  ArrowRightIcon,
} from '@/components/ui/PhosphorIcons';

interface ProviderLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProviderLeadModal({ isOpen, onClose }: ProviderLeadModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telegramHandle, setTelegramHandle] = useState('');
  const [communitySize, setCommunitySize] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/plan-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          selectedPlan: 'provider',
          eventVolume: communitySize,
          currentTool: `${name} (${telegramHandle})`,
        }),
      });

      if (!res.ok) {
        await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      }

      setIsSubmitted(true);
    } catch {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setTelegramHandle('');
    setCommunitySize('');
    setErrorMsg(null);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="provider-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-surface-canvas/85 backdrop-blur-md transition-opacity duration-300 ease-weighted"
      onClick={handleBackdropClick}
    >
      <div className="relative w-full max-w-lg bg-surface-primary border border-surface-elevated rounded-2xl p-6 sm:p-8 text-content-primary">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 text-content-tertiary hover:text-content-primary hover:bg-surface-subtle transition-colors duration-300 ease-weighted p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          aria-label="Close dialog"
        >
          <CloseIcon size={18} />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-11 h-11 rounded-xl bg-brand-accentSubtle border border-brand-accent/40 text-brand-accent flex items-center justify-center flex-shrink-0">
                <BroadcastIcon size={22} />
              </div>
              <div>
                <h3 id="provider-modal-title" className="heading-5 text-content-primary">
                  Become a Tadex Provider
                </h3>
                <p className="caption-3 text-brand-accent">
                  Talk to our community onboarding team
                </p>
              </div>
            </div>

            <p className="body-6 text-content-secondary mb-6">
              Tell us about your Telegram group. Our team will reach out within 24 hours to help you configure plans and automated member execution.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block caption-3 text-content-secondary mb-1.5">
                  Your Name or Brand Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alpha Signals or Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-subtle border border-surface-elevated focus:border-brand-accent text-content-primary placeholder:text-content-tertiary rounded-xl py-3 px-4 body-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                />
              </div>

              <div>
                <label className="block caption-3 text-content-secondary mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-subtle border border-surface-elevated focus:border-brand-accent text-content-primary placeholder:text-content-tertiary rounded-xl py-3 px-4 body-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block caption-3 text-content-secondary mb-1.5">
                    Telegram Handle / Channel
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="@yourchannel"
                    value={telegramHandle}
                    onChange={(e) => setTelegramHandle(e.target.value)}
                    className="w-full bg-surface-subtle border border-surface-elevated focus:border-brand-accent text-content-primary placeholder:text-content-tertiary rounded-xl py-3 px-4 body-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                  />
                </div>

                <div>
                  <label className="block caption-3 text-content-secondary mb-1.5">
                    Community Size
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 150 members"
                    value={communitySize}
                    onChange={(e) => setCommunitySize(e.target.value)}
                    className="w-full bg-surface-subtle border border-surface-elevated focus:border-brand-accent text-content-primary placeholder:text-content-tertiary rounded-xl py-3 px-4 body-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="caption-4 text-status-danger bg-surface-subtle p-3 rounded-xl border border-status-danger/40">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-md py-3.5 px-6 rounded-xl transition-[background-color,transform] duration-300 ease-weighted active:scale-[0.98] disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Submit & Connect with Team'}</span>
                <SendIcon size={16} />
              </button>
            </form>

            <div className="h-px bg-surface-elevated my-5" />

            <div className="text-center">
              <p className="caption-4 text-content-tertiary">
                Ready to register right now?{' '}
                <Link
                  href="/register?redirect=/dashboard/provider"
                  className="text-brand-accent hover:underline caption-3 inline-flex items-center gap-1"
                >
                  <span>Create account & open portal</span>
                  <ArrowRightIcon size={14} />
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-brand-accentSubtle text-brand-accent rounded-xl flex items-center justify-center mx-auto mb-4 border border-brand-accent/40">
              <CheckCircleIcon size={24} />
            </div>
            <h3 className="heading-5 text-content-primary mb-2">
              We Received Your Details!
            </h3>
            <p className="body-6 text-content-secondary max-w-sm mx-auto mb-6">
              Our provider onboarding team will review your channel and contact you shortly via Telegram or Email.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register?redirect=/dashboard/provider">
                <button
                  type="button"
                  className="w-full sm:w-auto bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-md px-6 py-3 rounded-xl transition-colors duration-300 ease-weighted active:scale-[0.98]"
                >
                  Register Now
                </button>
              </Link>
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto bg-surface-subtle hover:bg-surface-secondary border border-surface-elevated text-content-primary button-md px-6 py-3 rounded-xl transition-colors duration-300 ease-weighted active:scale-[0.98]"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
