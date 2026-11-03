'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  CloseIcon,
  MailIcon,
  CheckCircleIcon,
  ChartLineUpIcon,
  UsersIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from '@/components/ui/PhosphorIcons';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Submission failed. Check your email and try again.');
      }

      setIsSubmitted(true);
      setEmail('');

      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2500);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Submission failed. Check your connection and try again.';
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

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="waitlist-modal-title"
      className="fixed inset-0 bg-surface-canvas/85 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-weighted"
      onClick={handleBackdropClick}
    >
      {/* Outer card rounded-2xl (16px) with p-6 (24px) */}
      <div className="relative bg-surface-primary border border-surface-elevated rounded-2xl max-w-md w-full p-6 text-content-primary">
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-accentSubtle border border-brand-accent/40 text-brand-accent flex items-center justify-center flex-shrink-0">
                <MailIcon size={22} />
              </div>
              <div>
                <h2 id="waitlist-modal-title" className="heading-5 text-content-primary">
                  Join the Waitlist
                </h2>
                <p className="caption-4 text-content-secondary">
                  Priority access to automated Telegram signal execution
                </p>
              </div>
            </div>

            <div className="h-px bg-surface-elevated my-4" />

            {/* Benefits Grid */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="bg-surface-subtle border border-surface-elevated rounded-xl p-3 text-center">
                <div className="inline-flex items-center justify-center text-brand-accent mb-1">
                  <ChartLineUpIcon size={18} />
                </div>
                <p className="caption-4 text-content-secondary">24/7 Execution</p>
              </div>
              <div className="bg-surface-subtle border border-surface-elevated rounded-xl p-3 text-center">
                <div className="inline-flex items-center justify-center text-brand-accent mb-1">
                  <UsersIcon size={18} />
                </div>
                <p className="caption-4 text-content-secondary">2,000+ Traders</p>
              </div>
              <div className="bg-surface-subtle border border-surface-elevated rounded-xl p-3 text-center">
                <div className="inline-flex items-center justify-center text-brand-accent mb-1">
                  <ShieldCheckIcon size={18} />
                </div>
                <p className="caption-4 text-content-secondary">Non Custodial</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="waitlist-email-input"
                  className="block caption-3 text-content-secondary mb-2"
                >
                  Email address
                </label>
                <input
                  id="waitlist-email-input"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-subtle border border-surface-elevated focus:border-brand-accent text-content-primary placeholder:text-content-tertiary rounded-xl py-3 px-4 body-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                  required
                  disabled={isLoading}
                />
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
                {isLoading ? 'Joining waitlist...' : 'Join Waitlist'}
              </button>
            </form>

            <div className="h-px bg-surface-elevated my-4" />

            <div className="flex items-center justify-between caption-4 text-content-tertiary">
              <span>No spam. Unsubscribe anytime.</span>
              <Link
                href="/register"
                onClick={onClose}
                className="text-brand-accent hover:underline inline-flex items-center gap-1 caption-3"
              >
                <span>Create account now</span>
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
              Waitlist spot confirmed
            </h3>
            <p className="body-6 text-content-secondary mb-4">
              Your email has been added to the priority rollout list.
            </p>
            <div className="bg-surface-subtle border border-surface-elevated rounded-xl p-3">
              <p className="caption-3 text-brand-accent">
                Confirmation recorded
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}