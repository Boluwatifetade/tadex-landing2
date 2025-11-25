import React from 'react';

export const metadata = {
  title: 'Terms of Service | Tadex',
  description: 'User Terms of Service and Risk Disclosure for Tadex Technologies Ltd.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-[#004859]/10 text-[#004859] px-4 py-2 rounded-full text-sm font-medium mb-4">
            Legal Documentation
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#004859] mb-4">
            Terms of Service & Risk Disclosure
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Understanding your rights and responsibilities when using Tadex
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Document Header */}
          <div className="bg-gradient-to-r from-[#004859] to-[#006B7C] text-white p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Tadex Technologies Ltd.</h2>
                <p className="text-blue-100">User Agreement & Risk Disclosure</p>
              </div>
              <div className="text-sm text-blue-100 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p><strong>Effective Date:</strong> November 24, 2025</p>
                <p><strong>Version:</strong> 1.0</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12 space-y-12">
            
            <section className="group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#004859]/10 rounded-full flex items-center justify-center mt-1 group-hover:bg-[#00B894]/20 transition-colors">
                  <span className="text-[#004859] font-bold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#004859] mb-4">Acceptance of Terms</h2>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    By creating an account on Tadex ("The Platform"), you ("The User") agree to be bound by these Terms. 
                    If you do not agree to these terms, including the mandatory arbitration clause and class action waiver, 
                    do not use the Platform.
                  </p>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#004859]/10 rounded-full flex items-center justify-center mt-1 group-hover:bg-[#00B894]/20 transition-colors">
                  <span className="text-[#004859] font-bold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#004859] mb-4">Nature of Service</h2>
                  <p className="text-slate-700 mb-4 text-lg">Tadex is strictly a technology infrastructure provider.</p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#00B894] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-700">We provide a software interface to automate the transmission of data to your cryptocurrency exchange account.</p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#00B894] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-700"><strong>We are NOT a Financial Advisor, Broker-Dealer, or Hedge Fund.</strong></p>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-[#00B894] rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-slate-700">We do not have custody of your funds. We cannot withdraw your funds.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#004859]/10 rounded-full flex items-center justify-center mt-1 group-hover:bg-[#00B894]/20 transition-colors">
                  <span className="text-[#004859] font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#004859] mb-4">Risk Disclosure</h2>
                  <p className="text-slate-700 mb-6 text-lg font-semibold">
                    Cryptocurrency trading involves extreme risk. By using Tadex, you acknowledge:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <h3 className="font-bold text-red-800 mb-3">Software Risk</h3>
                      <p className="text-red-700 text-sm">
                        Bugs, latency, or API outages at Bybit may cause trades to fail or exit late. 
                        Tadex is provided "AS IS" without warranty.
                      </p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                      <h3 className="font-bold text-yellow-800 mb-3">Signal Risk</h3>
                      <p className="text-yellow-700 text-sm">
                        Signal Providers are independent third parties. Tadex does not vet their financial qualifications. 
                        Past performance is not indicative of future results.
                      </p>
                    </div>
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 md:col-span-2">
                      <h3 className="font-bold text-orange-800 mb-3">Total Loss Warning</h3>
                      <p className="text-orange-700 text-sm font-semibold">
                        You understand that you may lose 100% of the funds allocated to trading.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#004859]/10 rounded-full flex items-center justify-center mt-1 group-hover:bg-[#00B894]/20 transition-colors">
                  <span className="text-[#004859] font-bold text-sm">4</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#004859] mb-4">Limitation of Liability</h2>
                  <p className="text-slate-700 mb-6 text-lg">To the maximum extent permitted by law, Tadex Technologies Ltd. shall NOT be liable for:</p>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Any direct, indirect, or consequential loss of profits or data.",
                      "Losses resulting from 'Fat Finger' errors by Signal Providers.",
                      "Losses resulting from unauthorized access to your account due to your failure to secure your password or API keys."
                    ].map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-[#004859] rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-slate-700">{item}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-[#004859]/5 border border-[#004859]/20 rounded-xl p-6">
                    <h3 className="font-bold text-[#004859] mb-2">Cap on Liability</h3>
                    <p className="text-[#004859]">
                      In no event shall Tadex's total liability exceed the amount paid by you in subscription fees over the last 3 months (e.g., ~$45 USD).
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#004859]/10 rounded-full flex items-center justify-center mt-1 group-hover:bg-[#00B894]/20 transition-colors">
                  <span className="text-[#004859] font-bold text-sm">5</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#004859] mb-4">Payment & Refunds</h2>
                  <div className="grid gap-4">
                    {[
                      { title: "Subscription", desc: "Fees are billed in advance on a monthly basis." },
                      { title: "No Refunds", desc: "Payments are non-refundable. If you cancel, your access continues until the end of the billing period." },
                      { title: "M-Pesa/Mobile Money", desc: "Transaction failures due to telco network issues are outside Tadex's control. Service is only activated upon confirmed receipt of funds." }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="w-6 h-6 bg-[#00B894] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#004859] mb-1">{item.title}</h3>
                          <p className="text-slate-700 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Final Acknowledgment */}
            <div className="bg-gradient-to-r from-[#00B894]/10 to-[#004859]/10 rounded-2xl p-8 border border-[#00B894]/20">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-[#00B894] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white font-bold">✓</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#004859] mb-3">Acknowledgment</h3>
                  <p className="text-[#004859] text-lg leading-relaxed">
                    By using the Tadex platform, I confirm that I have read and understand the risks involved in automated trading, 
                    including the potential for complete loss of funds, and agree to be bound by these Terms of Service.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}