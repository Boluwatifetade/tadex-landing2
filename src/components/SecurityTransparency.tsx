"use client";

import { Shield, Lock, Key, Eye, Database, CheckCircle, AlertCircle, Server, FileText, Zap } from 'lucide-react';

export default function SecurityTransparency() {
  const securityFeatures = [
    {
      icon: Shield,
      title: "We Never Hold Your Assets",
      description: "Your data and assets stay in your external accounts at all times. We only route payloads - we never have access to withdraw or transfer any assets.",
      color: "from-green-500 to-green-600",
      details: [
        "Your funds remain in your control",
        "No custody or withdrawal permissions",
        "Only dispatch/routing capabilities"
      ]
    },
    {
      icon: Key,
      title: "Restricted-Scope API Keys",
      description: "We use target destination API keys with restricted permissions - routing/posting only, no administrative access. Even if compromised, your assets cannot be moved.",
      color: "from-blue-500 to-blue-600",
      details: [
        "Read and dispatch permissions only",
        "Withdrawal permissions disabled",
        "You control API key restrictions"
      ]
    },
    {
      icon: Lock,
      title: "AES-256 Encryption",
      description: "Your data is encrypted in transit and at rest using modern industry standards. API keys are stored securely and never exposed.",
      color: "from-purple-500 to-purple-600",
      details: [
        "256-bit AES encryption at rest",
        "TLS 1.3 for data in transit",
        "Encrypted database backups"
      ]
    },
    {
      icon: Eye,
      title: "Full Transparency",
      description: "You have complete visibility into every event, routing rule, and action. Real-time notifications and detailed logs keep you informed 24/7.",
      color: "from-amber-500 to-amber-600",
      details: [
        "Real-time routing notifications",
        "Complete audit logs",
        "Uptime and delivery logs dashboard"
      ]
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: "You Create Restricted-Scope API Keys",
      description: "On your target platform, create API keys with only 'read' and 'write' permissions. Never enable administrative/transfer permissions.",
      icon: Key
    },
    {
      step: 2,
      title: "We Securely Store Your Keys",
      description: "Your API keys are encrypted with AES-256 and stored in secure, isolated databases. We use industry-standard security practices.",
      icon: Database
    },
    {
      step: 3,
      title: "Automated Routing Begins",
      description: "Our system monitors event feeds and routes payloads on your behalf - but only routes. Your assets stay safely in your target account.",
      icon: Zap
    },
    {
      step: 4,
      title: "You Stay In Control",
      description: "Pause routing anytime, revoke API keys instantly, or adjust validation settings. You're always in control.",
      icon: Shield
    }
  ];

  const securityPractices = [
    {
      category: "Infrastructure Security",
      items: [
        "AWS/Cloud infrastructure with 99.9% uptime",
        "DDoS protection and rate limiting",
        "Regular security audits and penetration testing",
        "Automated backup and disaster recovery"
      ]
    },
    {
      category: "Data Protection",
      items: [
        "NDPR and data privacy compliance",
        "No selling or sharing of user data",
        "Encrypted database with access logs",
        "Regular data security assessments"
      ]
    },
    {
      category: "Access Control",
      items: [
        "IP whitelisting options available",
        "Role-based access control",
        "Session management and timeout"
      ]
    },
    {
      category: "Monitoring & Response",
      items: [
        "24/7 system monitoring and alerts",
        "Instant notification of security events",
        "Dedicated security incident response team"
      ]
    }
  ];

  const trustIndicators = [
    {
      icon: CheckCircle,
      title: "Open Communication",
      description: "We're transparent about how our system works, what we can and cannot do, and how we protect your interests."
    },
    {
      icon: FileText,
      title: "Clear Terms of Service",
      description: "No hidden clauses or legal jargon. Our terms are written in plain English so you know exactly what you're agreeing to."
    },
    {
      icon: AlertCircle,
      title: "Honest About Limits",
      description: "Data delivery depends on external uptime. We are upfront about third-party API limits and enforce strict timeout rules."
    },
    {
      icon: Server,
      title: "Battle-Tested Technology",
      description: "Our infrastructure is built on proven, enterprise-grade technologies used by leading institutions."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#004859] to-[#006B7C] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <Shield className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Your Security is Our Priority
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            We believe in complete transparency about how we protect your funds and data. Here's everything you need to know.
          </p>
        </div>
      </section>

      {/* Main Security Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#004859] mb-4">
              How We Keep Your Data Safe
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Four fundamental principles that protect your automation account
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200"
                >
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.color} mb-6`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-[#004859] mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-slate-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Visually */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#004859] mb-4">
              How It Works: Security in Action
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              A step-by-step look at how we keep your funds secure
            </p>
          </div>

          <div className="space-y-8">
            {howItWorks.map((step, index) => {
              const IconComponent = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div 
                  key={index}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Step Number and Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-[#004859] to-[#006B7C] rounded-full flex items-center justify-center">
                        <IconComponent className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#00B894] rounded-full flex items-center justify-center text-white font-bold">
                        {step.step}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 ${isEven ? 'md:text-left' : 'md:text-right'}`}>
                    <h3 className="text-2xl font-bold text-[#004859] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Connector Line (hidden on mobile) */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 h-24 bg-gradient-to-b from-[#004859] to-transparent"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Security Practices Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#004859] mb-4">
              Our Security Practices
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Industry-leading standards across every aspect of our platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityPractices.map((practice, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200"
              >
                <h3 className="text-xl font-bold text-[#004859] mb-6 pb-4 border-b border-slate-200">
                  {practice.category}
                </h3>
                <ul className="space-y-4">
                  {practice.items.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <div className="w-2 h-2 bg-[#00B894] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#004859] mb-4">
              Building Trust Through Transparency
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We believe in honest, clear communication about our platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {trustIndicators.map((indicator, index) => {
              const IconComponent = indicator.icon;
              return (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-white to-blue-50 rounded-xl p-6 border border-blue-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-[#004859]/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-6 h-6 text-[#004859]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-[#004859] mb-2">
                        {indicator.title}
                      </h3>
                      <p className="text-slate-600">
                        {indicator.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#004859] mb-4">
              Common Security Questions
            </h2>
          </div>

          <div className="space-y-6">
            <details className="bg-slate-50 rounded-xl p-6 border border-slate-200 group">
              <summary className="font-semibold text-[#004859] cursor-pointer flex items-center justify-between">
                What happens if Tadex gets compromised?
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Even in the worst-case scenario, your assets are safe. We only store restricted API keys with no transfer or withdrawal permissions. Attackers cannot move your assets off your account.
              </p>
            </details>

            <details className="bg-slate-50 rounded-xl p-6 border border-slate-200 group">
              <summary className="font-semibold text-[#004859] cursor-pointer flex items-center justify-between">
                Can you access my destination account directly?
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                No. We never have your destination login credentials. We only use API keys you create with restricted permissions. You maintain full control and can revoke our access at any time by deleting the API key in your account settings.
              </p>
            </details>

            <details className="bg-slate-50 rounded-xl p-6 border border-slate-200 group">
              <summary className="font-semibold text-[#004859] cursor-pointer flex items-center justify-between">
                How do I know my API keys are safe?
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Your API keys are encrypted with AES-256 (military-grade encryption) and stored in secure, isolated databases. We never display your full API keys after initial setup, and all access is logged and monitored for suspicious activity.
              </p>
            </details>

            <details className="bg-slate-50 rounded-xl p-6 border border-slate-200 group">
              <summary className="font-semibold text-[#004859] cursor-pointer flex items-center justify-between">
                What if I want to stop using Tadex?
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                You can stop at any time with no penalties. Simply pause routing in your dashboard or revoke the API key. Your data can be deleted upon request, and there are no cancellation fees.
              </p>
            </details>

            <details className="bg-slate-50 rounded-xl p-6 border border-slate-200 group">
              <summary className="font-semibold text-[#004859] cursor-pointer flex items-center justify-between">
                Do you share my data with third parties?
                <span className="text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Never. Your routing data, email, and personal information are never sold, shared, or used for any purpose other than providing our service to you. We're NDPR compliant and take data privacy seriously.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#004859] to-[#006B7C] text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-16 h-16 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Automate with Confidence
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Your security and trust are the foundation of everything we build. Start automating with peace of mind.
          </p>
          <button className="bg-white text-[#004859] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
            Get Started Securely
          </button>
        </div>
      </section>
    </div>
  );
}