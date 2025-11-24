'use client';
import { CheckCircle, Circle, Clock } from 'lucide-react';

export default function Roadmap() {
  const milestones = [
    {
      phase: "Phase 1 (Live)",
      title: "MVP Launch",
      items: ["Telegram Bot Interface", "Bybit Integration", "Auto-Risk Calculation", "Real-time PnL"],
      status: "completed",
      color: "bg-[#00B894]"
    },
    {
      phase: "Phase 2 (Q2 2026)",
      title: "Multi-Exchange",
      items: ["Binance Support", "OKX Integration", "Copy Trading Marketplace", "Advanced Analytics"],
      status: "in-progress",
      color: "bg-[#004859]"
    },
    {
      phase: "Phase 3 (Q3 2026)",
      title: "Platform Expansion",
      items: ["Web Dashboard", "Mobile App (iOS/Android)", "Build-Your-Own-Bot", "AI-Powered Insights"],
      status: "planned",
      color: "bg-slate-300"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-[#004859]/10 text-[#004859] px-4 py-2 rounded-full text-sm font-medium mb-4">
            The Vision
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#004859] mb-4">
            Roadmap to the Future
          </h2>
          <p className="text-slate-600">We're just getting started. Here's what's coming next.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {milestones.map((milestone, idx) => (
            <div key={idx} className="relative p-6 rounded-2xl border border-slate-200 bg-slate-50/50">
              {/* Connector Line */}
              <div className={`absolute top-0 left-6 w-1 h-full ${
                idx === 0 ? 'bg-gradient-to-b from-[#00B894] to-[#004859]' : 
                idx === 1 ? 'bg-gradient-to-b from-[#004859] to-slate-300' : 
                'bg-slate-200'
              } -z-10 hidden md:block`}></div>

              <div className="flex items-center gap-4 mb-6">
                <div className={`w-4 h-4 rounded-full ${milestone.color} ring-4 ring-white shadow-sm`}></div>
                <span className={`text-sm font-bold uppercase tracking-wider ${
                  milestone.status === 'completed' ? 'text-[#00B894]' : 
                  milestone.status === 'in-progress' ? 'text-[#004859]' : 'text-slate-400'
                }`}>
                  {milestone.phase}
                </span>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-4">{milestone.title}</h3>
              
              <ul className="space-y-3">
                {milestone.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                    {milestone.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4 text-[#00B894] mt-0.5" />
                    ) : milestone.status === 'in-progress' ? (
                      <Clock className="w-4 h-4 text-[#004859] mt-0.5" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 mt-0.5" />
                    )}
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}