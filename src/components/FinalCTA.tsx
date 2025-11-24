'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, TrendingUp, Shield, Zap, Users, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function FinalCTA() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      console.log("Email captured and saved:", email);
      setIsSubmitted(true);
      setEmail("");

      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      console.error("Network error", err);
      alert("Network error. Try again.");
    }
  };

  const benefits = [
    { icon: TrendingUp, text: "68% better execution" },
    { icon: Zap, text: "3.2x faster trades" },
    { icon: Shield, text: "99.9% uptime" },
    { icon: Users, text: "2,000+ traders" }
  ];

  return (
    <section className="relative bg-gradient-to-br from-[#004859] via-[#006B7C] to-[#004859] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-[#00B894]/20 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#00B894]/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center bg-[#00B894]/20 text-[#00B894] px-4 py-2 rounded-full text-sm font-medium mb-6 border border-[#00B894]/30">
            <TrendingUp className="w-4 h-4 mr-2" />
            Join the trading revolution
          </div>

          {/* Main Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Start Automating in <span className="text-[#00B894]">2 Minutes</span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join the beta today. No credit card required. No complex setup. Just pure trading efficiency.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-[#00B894]/30 transition-all duration-300 hover:scale-105">
                  <IconComponent className="w-6 h-6 text-[#00B894] mx-auto mb-2" />
                  <p className="text-sm text-blue-100 font-medium">{benefit.text}</p>
                </div>
              );
            })}
          </div>

          {/* Dual CTA Section */}
          <div className="max-w-2xl mx-auto mb-12">
            {/* Primary CTA - Telegram Bot */}
            <div className="mb-8">
              <Link href="https://t.me/TradeSwiftNowBot" target="_blank">
                <Button 
                  size="lg"
                  className="bg-[#00B894] hover:bg-[#00A085] text-white px-10 py-6 text-lg rounded-full font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full sm:w-auto mb-4"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Launch Tadex Bot Now
                </Button>
              </Link>
              <p className="text-blue-100 text-sm">
                Instant access • No signup required • Start trading immediately
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="px-4 text-blue-100 text-sm">OR</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>

            {/* Secondary CTA - Waitlist */}
            <div>
              <p className="text-blue-100 mb-4 font-medium">Join waitlist for early access to new features</p>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-[#00B894] rounded-xl py-4 px-6 text-lg"
                    required
                  />
                  <Button
                    type="submit"
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-8 py-4 rounded-xl font-semibold transition-all duration-300 text-lg whitespace-nowrap group"
                  >
                    Join Waitlist
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              ) : (
                <div className="flex items-center justify-center gap-3 bg-[#00B894]/20 backdrop-blur-sm border border-[#00B894]/30 rounded-xl py-4 px-6 max-w-md mx-auto">
                  <CheckCircle className="w-6 h-6 text-[#00B894]" />
                  <span className="text-[#00B894] font-semibold text-lg">
                    You're on the waitlist! Check your email.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-100 mb-8">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#00B894]" />
              <span className="text-sm">Bank-level security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#00B894]" />
              <span className="text-sm">99.9% uptime guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[#00B894]" />
              <span className="text-sm">No credit card required</span>
            </div>
          </div>

          {/* Social Proof */}
          <div className="pt-8 border-t border-white/20">
            <p className="text-blue-100 mb-4">Trusted by traders worldwide</p>
            <div className="flex justify-center items-center gap-8 opacity-80">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00B894]">2,000+</div>
                <div className="text-xs text-blue-100">Traders</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00B894]">68%</div>
                <div className="text-xs text-blue-100">Better Execution</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00B894]">3.2x</div>
                <div className="text-xs text-blue-100">Faster Trades</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#00B894]">99.9%</div>
                <div className="text-xs text-blue-100">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L50 110C100 100 200 80 300 70C400 60 500 60 600 65C700 70 800 80 900 85C1000 90 1100 90 1150 90L1200 90V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0Z" fill="#f8fafc"/>
        </svg>
      </div>
    </section>
  );
}