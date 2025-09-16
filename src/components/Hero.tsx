'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Play, TrendingUp, Zap, Shield } from 'lucide-react';

export default function Hero() {
  const [email, setEmail] = useState('');

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

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

  alert("Email captured and saved!");
  setEmail("");
}


  return (
    <section className="relative bg-gradient-to-br from-[#004859] via-[#006B7C] to-[#004859] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center bg-[#00B894]/20 text-[#00B894] px-4 py-2 rounded-full text-sm font-medium mb-8 border border-[#00B894]/30">
            <Zap className="w-4 h-4 mr-2" />
            Lightning-fast automated trading
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Automated Trading
            <span className="block text-[#00B894]">Made Simple</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Eliminate emotions, maximize profits. Let Tadex execute your trades 3.2x faster with 99.9% uptime.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-[#00B894] hover:bg-[#00A085] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Start 14-Day Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-2 border-white/30 hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
            >
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>

          {/* Trust Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl md:text-5xl font-bold text-[#00B894] mb-2">68%</div>
              <p className="text-blue-100 font-medium">Improvement in execution</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl md:text-5xl font-bold text-[#00B894] mb-2">3.2x</div>
              <p className="text-blue-100 font-medium">Faster signal-to-trade</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl md:text-5xl font-bold text-[#00B894] mb-2">99.9%</div>
              <p className="text-blue-100 font-medium">Uptime guarantee</p>
            </div>
          </div>

          {/* Waitlist Form */}
          <div className="max-w-md mx-auto">
            <p className="text-blue-100 mb-4 font-medium">Join 2,000+ traders on the waitlist</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-blue-200 focus:border-[#00B894] rounded-xl py-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="bg-[#00B894] hover:bg-[#00A085] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap"
              >
                Join Waitlist
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L50 110C100 100 200 80 300 70C400 60 500 60 600 65C700 70 800 80 900 85C1000 90 1100 90 1150 90L1200 90V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}