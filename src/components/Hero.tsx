'use client';
import { Button } from '@/components/ui/button';
import { Play, TrendingUp, Zap, Send } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  // Link to the actual bot
  const TELEGRAM_BOT_URL = "https://t.me/TradeSwiftNowBot";
  // Placeholder for YouTube video
  const YOUTUBE_DEMO_URL = "https://youtu.be/7cLw92poCss"; 

  return (
    <section className="relative bg-gradient-to-br from-[#004859] via-[#006B7C] to-[#004859] text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center max-w-6xl mx-auto">
          {/* Badge - Original Style */}
          <div className="inline-flex items-center bg-[#00B894]/20 text-[#00B894] px-4 py-2 rounded-full text-sm font-medium mb-8 border border-[#00B894]/30">
            <Zap className="w-4 h-4 mr-2" />
            Live on Telegram Beta
          </div>

          {/* Main Headline - Original Large Typography */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Automate Your Trades With Signals You Trust and Execute Your Crypto Signals Automatically With Full Control.
            <span className="block text-[#00B894]">Visualize Profits.</span>
          </h1>

          {/* Subheadline - Original Style */}
          <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Connect your exchange, follow expert signals, and track your PnL in real-time. The simplest trading bot for the African crypto space.
          </p>

          {/* CTA Buttons - New Actions with Original Styling */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href={TELEGRAM_BOT_URL} target="_blank">
              <Button 
                size="lg" 
                className="bg-[#00B894] hover:bg-[#00A085] text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Send className="w-5 h-5 mr-2" />
                Request Private Beta Access
              </Button>
            </Link>
            <Link href={YOUTUBE_DEMO_URL} target="_blank">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-2 border-white/30 hover:bg-white/10 px-8 py-6 text-lg font-semibold rounded-xl backdrop-blur-sm transition-all duration-300"
              >
                <Play className="w-5 h-5 mr-2" />
                Watch Setup Video
              </Button>
            </Link>
          </div>

          {/* Content Grid - Text + Visual */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Trust Stats - Original Beautiful Cards */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-[#00B894] mb-2">3.2x</div>
                  <p className="text-blue-100 font-medium">Faster Execution</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-[#00B894] mb-2">24/7</div>
                  <p className="text-blue-100 font-medium">Uptime</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-[#00B894] mb-2">68%</div>
                  <p className="text-blue-100 font-medium">Profit Improvement</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-[#00B894] mb-2">0%</div>
                  <p className="text-blue-100 font-medium">Beta Fees</p>
                </div>
              </div>

              {/* Additional Benefits */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Why Traders Love Tadex</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00B894] rounded-full"></div>
                    <span>Real-time PnL Tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00B894] rounded-full"></div>
                    <span>Multi-Exchange Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00B894] rounded-full"></div>
                    <span>Expert Trading Signals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#00B894] rounded-full"></div>
                    <span>Risk Management Tools</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone Mockup - New Visual */}
            <div className="relative">
              <div className="relative z-10 bg-white rounded-[2.5rem] shadow-2xl p-4 border-8 border-slate-800 max-w-xs mx-auto transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                {/* Phone Speaker */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-slate-800 rounded-b-xl"></div>
                
                {/* Screen Content */}
                <div className="bg-slate-50 rounded-[1.5rem] overflow-hidden h-[500px] flex flex-col relative">
                  {/* Mock Header */}
                  <div className="bg-[#004859] p-4 pt-8 text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xs">🤖</div>
                    <div>
                      <div className="font-bold text-sm">Tadex Bot</div>
                      <div className="text-[10px] text-[#00B894]">● Online</div>
                    </div>
                  </div>

                  {/* Mock Chat */}
                  <div className="flex-1 p-4 space-y-4">
                    {/* User Msg */}
                    <div className="flex justify-end">
                      <div className="bg-[#00B894] text-white p-3 rounded-2xl rounded-tr-sm text-xs max-w-[80%] shadow-sm">
                        BTCUSDT BUY ENTRY: 67000 SL: 66500 TP: 68000
                      </div>
                    </div>

                    {/* Bot Msg */}
                    <div className="flex justify-start">
                      <div className="bg-white border border-slate-200 text-slate-800 p-3 rounded-2xl rounded-tl-sm text-xs max-w-[90%] shadow-sm">
                        <p className="font-bold text-[#004859] mb-1">✅ Signal Received</p>
                        <div className="space-y-1 text-slate-600">
                          <p>Token: BTC/USDT</p>
                          <p>Risk: 2.0% ($124.50)</p>
                          <p>Entry: Market</p>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex justify-between">
                          <span>Executing on Bybit...</span>
                          <span className="text-[#00B894]">Just now</span>
                        </div>
                      </div>
                    </div>

                    {/* Success Notification */}
                    <div className="absolute top-1/2 left-4 right-4 bg-white p-3 rounded-xl shadow-xl border-l-4 border-[#00B894] animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex gap-3 items-center">
                        <div className="bg-green-100 p-2 rounded-full">
                          <Zap className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Order Filled</p>
                          <p className="text-[10px] text-slate-500">BTCUSDT Long @ $67,042</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00B894]/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Ready to Transform Your Trading?</h3>
            <p className="text-blue-100 mb-6">Join hundreds of traders already automating their strategies</p>
            <Link href={TELEGRAM_BOT_URL} target="_blank">
              <Button 
                size="lg" 
                className="bg-[#00B894] hover:bg-[#00A085] text-white px-8 py-4 text-lg font-semibold rounded-xl"
              >
                <Send className="w-5 h-5 mr-2" />
                Start Free on Telegram
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom wave - Original Beautiful Transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-16" viewBox="0 0 1200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L50 110C100 100 200 80 300 70C400 60 500 60 600 65C700 70 800 80 900 85C1000 90 1100 90 1150 90L1200 90V120H1150C1100 120 1000 120 900 120C800 120 700 120 600 120C500 120 400 120 300 120C200 120 100 120 50 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}