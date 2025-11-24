'use client';
import { Check, X, Minus } from 'lucide-react';

export default function ComparisonTable() {
  const features = [
    { name: 'Mobile-First Experience', tadex: true, c3: false, ch: false },
    { name: 'Free Beta Access', tadex: true, c3: false, ch: false },
    { name: 'Simple Chat Interface', tadex: true, c3: false, ch: false },
    { name: 'Real-time PnL Alerts', tadex: true, c3: true, ch: true },
    { name: 'Auto-Breakeven Logic', tadex: true, c3: 'Paid', ch: 'Paid' },
    { name: 'Localized Support (Africa)', tadex: true, c3: false, ch: false },
  ];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#004859] mb-4">
            Why Traders Switch to Tadex
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Stop paying for complex dashboards you don't use. Get the features you need, right in Telegram.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-6 text-left text-slate-600 font-medium">Feature</th>
                <th className="p-6 text-center bg-[#004859]/5 border-x border-[#004859]/10">
                  <span className="text-[#004859] font-bold text-lg">Tadex</span>
                </th>
                <th className="p-6 text-center text-slate-500 font-medium">3Commas</th>
                <th className="p-6 text-center text-slate-500 font-medium">Cryptohopper</th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, idx) => (
                <tr key={idx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="p-6 text-slate-700 font-medium">{feature.name}</td>
                  <td className="p-6 text-center bg-[#004859]/5 border-x border-[#004859]/10">
                    <div className="flex justify-center">
                      {feature.tadex === true ? (
                        <div className="bg-[#00B894]/20 p-1 rounded-full">
                          <Check className="w-5 h-5 text-[#00B894]" />
                        </div>
                      ) : (
                        <span className="text-[#004859] font-semibold">{feature.tadex}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex justify-center">
                      {feature.c3 === true ? (
                        <Check className="w-5 h-5 text-slate-400" />
                      ) : feature.c3 === false ? (
                        <X className="w-5 h-5 text-slate-300" />
                      ) : (
                        <span className="text-slate-400 text-sm">{feature.c3}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex justify-center">
                      {feature.ch === true ? (
                        <Check className="w-5 h-5 text-slate-400" />
                      ) : feature.ch === false ? (
                        <X className="w-5 h-5 text-slate-300" />
                      ) : (
                        <span className="text-slate-400 text-sm">{feature.ch}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}