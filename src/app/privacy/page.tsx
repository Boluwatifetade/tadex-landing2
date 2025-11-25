import React from 'react';

export const metadata = {
  title: 'Privacy Policy | Tadex',
  description: 'Data Privacy Policy (NDPR Compliant) for Tadex Technologies Ltd.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-[#004859]/10 text-[#004859] px-4 py-2 rounded-full text-sm font-medium mb-4">
            Data Protection
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#004859] mb-4">
            Privacy Policy & Data Protection
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            NDPR Compliant - Your data security is our priority
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Document Header */}
          <div className="bg-gradient-to-r from-[#004859] to-[#006B7C] text-white p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Tadex Technologies Ltd.</h2>
                <p className="text-blue-100">NDPR Compliant Privacy Policy</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="text-sm text-blue-100 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p><strong>Effective Date:</strong> November 24, 2025</p>
                  <p><strong>Jurisdiction:</strong> Federal Republic of Nigeria</p>
                </div>
                <div className="text-sm text-blue-100 bg-[#00B894]/20 backdrop-blur-sm rounded-lg p-3">
                  <p><strong>Status:</strong> NDPR Compliant</p>
                  <p><strong>Version:</strong> 1.0</p>
                </div>
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
                  <h2 className="text-2xl font-bold text-[#004859] mb-4">Preamble</h2>
                  <p className="text-slate-700 leading-relaxed text-lg">
                    Tadex Technologies Ltd ("Tadex") is committed to protecting your personal data in accordance with the 
                    Nigeria Data Protection Regulation (NDPR) 2019 and the NDPA 2023. This policy outlines what we collect, 
                    why we collect it, and your rights as a Data Subject.
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
                  <h2 className="text-2xl font-bold text-[#004859] mb-4">Data We Collect</h2>
                  <p className="text-slate-700 mb-6 text-lg">We strictly limit collection to what is necessary for execution:</p>
                  <div className="grid gap-4">
                    {[
                      {
                        title: "Identity Data",
                        description: "Email Address, Telegram Username",
                        note: "We do NOT collect National ID, BVN, or NIN",
                        icon: "👤"
                      },
                      {
                        title: "Financial Data",
                        description: "Bybit API Keys (Encrypted), Wallet Address",
                        note: "For payouts and trade execution",
                        icon: "💰"
                      },
                      {
                        title: "Transactional Data",
                        description: "Trade history, Subscription status, Payment confirmation",
                        note: "From M-Pesa/Paystack for billing verification",
                        icon: "📊"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-[#004859]/30 transition-colors">
                        <div className="text-2xl flex-shrink-0">{item.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-[#004859] mb-1">{item.title}</h3>
                          <p className="text-slate-700 mb-1">{item.description}</p>
                          <p className="text-sm text-slate-500">{item.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#004859]/10 rounded-full flex items-center justify-center mt-1 group-hover:bg-[#00B894]/20 transition-colors">
                  <span className="text-[#004859] font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#004859] mb-4">Purpose of Processing</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      { icon: "⚡", title: "Execution", desc: "Transmit trade commands to your exchange account via API" },
                      { icon: "🔔", title: "Notification", desc: "Send Telegram/Email alerts regarding trade status" },
                      { icon: "💳", title: "Billing", desc: "Verify subscription payments and manage billing" },
                      { icon: "🛡️", title: "Security", desc: "Detect abnormal IP usage indicating account compromise" }
                    ].map((item, index) => (
                      <div key={index} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-[#00B894]/30 transition-colors">
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <h3 className="font-semibold text-[#004859] mb-2">{item.title}</h3>
                        <p className="text-slate-700 text-sm">{item.desc}</p>
                      </div>
                    ))}
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
                  <h2 className="text-2xl font-bold text-[#004859] mb-4">Data Security Architecture</h2>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Encryption",
                        description: "All API Secrets are encrypted using AES-256-GCM before storage",
                        badge: "Military Grade"
                      },
                      {
                        title: "Storage Location",
                        description: "Data is stored on secure servers (AWS) which may be located outside Nigeria",
                        badge: "Global Infrastructure"
                      },
                      {
                        title: "Retention Policy",
                        description: "We retain trade logs for 5 years as required by financial auditing standards",
                        badge: "Compliant"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-[#004859]/5 rounded-lg border border-[#004859]/20">
                        <div className="w-3 h-3 bg-[#00B894] rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-semibold text-[#004859]">{item.title}</h3>
                            <span className="bg-[#00B894] text-white text-xs px-2 py-1 rounded-full font-medium">
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-slate-700">{item.description}</p>
                        </div>
                      </div>
                    ))}
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
                  <h2 className="text-2xl font-bold text-[#004859] mb-4">Your Rights (Under NDPR)</h2>
                  <p className="text-slate-700 mb-6 text-lg">As a Nigerian Data Subject, you have the right to:</p>
                  <div className="grid gap-4">
                    {[
                      {
                        title: "Right to Access",
                        description: "Request a copy of all trade logs we hold for you",
                        icon: "📋"
                      },
                      {
                        title: "Right to Erasure",
                        description: "Request deletion of your account and personal data",
                        note: "Trade logs will be anonymized for platform analytics",
                        icon: "🗑️"
                      },
                      {
                        title: "Right to Rectification",
                        description: "Correct wrong email addresses or API keys",
                        icon: "✏️"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-white border border-slate-200 rounded-xl hover:border-[#004859]/30 transition-colors">
                        <div className="text-2xl flex-shrink-0">{item.icon}</div>
                        <div>
                          <h3 className="font-semibold text-[#004859] mb-1">{item.title}</h3>
                          <p className="text-slate-700">{item.description}</p>
                          {item.note && (
                            <p className="text-sm text-slate-500 mt-1">{item.note}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#004859]/10 rounded-full flex items-center justify-center mt-1 group-hover:bg-[#00B894]/20 transition-colors">
                  <span className="text-[#004859] font-bold text-sm">6</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#004859] mb-4">Third-Party Sharing</h2>
                  <p className="text-slate-700 mb-6 text-lg font-semibold">We do NOT sell your data. We only share data with:</p>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      { name: "Exchange Partners", detail: "Bybit", purpose: "Trade execution" },
                      { name: "Payment Processors", detail: "Paystack/M-Pesa", purpose: "Fee processing" },
                      { name: "Law Enforcement", detail: "Nigerian Courts", purpose: "Legal compliance" }
                    ].map((item, index) => (
                      <div key={index} className="text-center p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h3 className="font-semibold text-[#004859] mb-1">{item.name}</h3>
                        <p className="text-sm text-slate-600 mb-2">{item.detail}</p>
                        <p className="text-xs text-slate-500">{item.purpose}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="group">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-[#004859]/10 rounded-full flex items-center justify-center mt-1 group-hover:bg-[#00B894]/20 transition-colors">
                  <span className="text-[#004859] font-bold text-sm">7</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#004859] mb-4">Contact Our Data Protection Team</h2>
                  <div className="bg-gradient-to-r from-[#00B894]/10 to-[#004859]/10 rounded-2xl p-8 border border-[#00B894]/20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#00B894] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xl">📧</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#004859] mb-2">Data Protection Officer (DPO)</h3>
                        <a 
                          href="mailto:tadex.team@gmail.com" 
                          className="text-[#004859] text-lg font-semibold hover:text-[#00B894] transition-colors block mb-2"
                        >
                          tadex.team@gmail.com
                        </a>
                        <p className="text-slate-700">Lagos, Nigeria</p>
                        <p className="text-sm text-slate-500 mt-2">
                          For all privacy-related inquiries and data subject requests
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}