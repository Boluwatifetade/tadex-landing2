"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Mail, CheckCircle, TrendingUp, Users, Shield } from 'lucide-react';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      console.log('Email submitted successfully:', email);
      setIsSubmitted(true);
      setEmail('');
      
      // Auto-close modal after success
      setTimeout(() => {
        setIsSubmitted(false);
        onClose();
      }, 2500);
    } catch (error) {
      console.error('Error submitting email:', error);
      // You could add error state handling here if needed
      // setError(error.message);
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
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#004859] to-[#006B7C] text-white p-6 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Join the Waitlist</h2>
            <p className="text-blue-100">Be first to access automated trading</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isSubmitted ? (
            <>
              {/* Benefits */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-[#00B894]/10 rounded-lg mb-2">
                    <TrendingUp className="w-5 h-5 text-[#00B894]" />
                  </div>
                  <p className="text-xs text-slate-600">3.2x Faster</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-[#004859]/10 rounded-lg mb-2">
                    <Users className="w-5 h-5 text-[#004859]" />
                  </div>
                  <p className="text-xs text-slate-600">2,000+ Users</p>
                </div>
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-[#00B894]/10 rounded-lg mb-2">
                    <Shield className="w-5 h-5 text-[#00B894]" />
                  </div>
                  <p className="text-xs text-slate-600">Strong Security</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-slate-300 focus:border-[#004859] rounded-lg py-3 px-4"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#004859] to-[#006B7C] hover:from-[#00323B] hover:to-[#004859] text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Joining...
                    </div>
                  ) : (
                    'Join Waitlist'
                  )}
                </Button>
              </form>

              {/* Trust indicators */}
              <div className="mt-4 text-center text-xs text-slate-500">
                <p>🔒 We'll never spam you. Unsubscribe anytime.</p>
              </div>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#00B894]/20 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-[#00B894]" />
              </div>
              <h3 className="text-xl font-bold text-[#004859] mb-2">
                Welcome to Tadex!
              </h3>
              <p className="text-slate-600 mb-4">
                You&apos;re now on our waitlist. We&apos;ll notify you as soon as we launch!
              </p>
              <div className="bg-[#00B894]/10 border border-[#00B894]/20 rounded-lg p-3">
                <p className="text-sm text-[#00B894] font-medium">
                  Success
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}