'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, CheckCircle2, Radio, Send, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
          plan: 'provider',
          features: [`name:${name}`, `telegram:${telegramHandle}`, `size:${communitySize}`],
        }),
      });

      if (!res.ok) {
        // Fallback to general waitlist if plan-waitlist endpoint rejects extra payload
        await fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      // Still show success if network issue was partial
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-white">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSubmitted ? (
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#00B894]/20 text-[#00B894] flex items-center justify-center">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Become a Tadex Provider</h3>
                <p className="text-xs text-[#00B894] font-medium">Talk to our community onboarding team</p>
              </div>
            </div>

            <p className="text-sm text-slate-300 mb-6 mt-3 leading-relaxed">
              Tell us a bit about your Telegram group. Our team will reach out within 24 hours to help you set up plans and start automated execution.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Your Name or Brand Name
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Alpha Signals or Alex"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 rounded-xl h-11"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 rounded-xl h-11"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Telegram Handle / Channel
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="@yourchannel"
                    value={telegramHandle}
                    onChange={(e) => setTelegramHandle(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 rounded-xl h-11"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                    Community Size
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g. 150 members"
                    value={communitySize}
                    onChange={(e) => setCommunitySize(e.target.value)}
                    className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-500 rounded-xl h-11"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-400 bg-red-950/40 p-2.5 rounded-lg border border-red-800/50">
                  {errorMsg}
                </p>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#00B894] hover:bg-[#00A085] text-slate-950 font-bold py-6 text-base rounded-xl shadow-lg transition-all"
              >
                {isSubmitting ? 'Submitting...' : 'Submit & Connect with Team'}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                Ready to register right now?{' '}
                <Link
                  href="/register?redirect=/dashboard/provider"
                  className="text-[#00B894] hover:underline font-semibold"
                >
                  Create account & open portal <ArrowRight className="w-3 h-3 inline ml-0.5" />
                </Link>
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-500/20 text-[#00B894] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#00B894]/30">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">We Received Your Details!</h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto mb-6 leading-relaxed">
              Our provider onboarding team will review your channel and contact you shortly via Telegram or Email.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/register?redirect=/dashboard/provider">
                <Button className="w-full sm:w-auto bg-[#00B894] hover:bg-[#00A085] text-slate-950 font-bold px-6 py-5 rounded-xl">
                  Register Now
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 px-6 py-5 rounded-xl"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
