"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ui/ScrollReveal";
import TadexLogo from "@/components/ui/TadexLogo";
import {
  ShieldCheckIcon,
  KeyIcon,
  LockIcon,
  ChartLineUpIcon,
  SlidersIcon,
  CheckCircleIcon,
  WarningTriangleIcon,
  ArrowRightIcon,
  CaretDownIcon,
} from "@/components/ui/PhosphorIcons";

export default function SecurityTransparency() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const securityFeatures = [
    {
      icon: ShieldCheckIcon,
      title: "We Never Hold Your Assets",
      description:
        "Your trading capital stays in your own exchange account at all times. We only dispatch trade-only orders — we never have access to withdraw or transfer any assets.",
      details: [
        "Your funds remain in your custody",
        "Zero custody or withdrawal permissions",
        "Trade order dispatch and position monitoring only",
      ],
    },
    {
      icon: KeyIcon,
      title: "Restricted-Scope API Keys",
      description:
        "You connect exchange API keys with strictly trade-only permissions. Tadex automatically rejects any key that has withdrawal permissions enabled.",
      details: [
        "Read and trade execution permissions only",
        "Withdrawal permissions automatically rejected",
        "Instant key revocation from your dashboard",
      ],
    },
    {
      icon: LockIcon,
      title: "AES-256 Encryption at Rest",
      description:
        "Every exchange API key and secret is encrypted with AES-256 before writing to persistent storage and transmitted exclusively over TLS 1.3.",
      details: [
        "256-bit AES encryption at rest",
        "TLS 1.3 for all API and exchange traffic",
        "Access tokens held strictly in volatile memory",
      ],
    },
    {
      icon: ChartLineUpIcon,
      title: "Full Execution Transparency",
      description:
        "You have complete visibility into every signal parsed, risk check evaluated, and order dispatched. Real-time alerts and audit logs keep you informed 24/7.",
      details: [
        "Real-time Telegram and web execution logs",
        "Immutable compliance and security audit trail",
        "Emergency kill-switch and instant pause controls",
      ],
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "You Create Trade-Only API Keys",
      description:
        "On Bybit, Binance, or OKX, create an API key with only 'Orders & Positions' permissions. Never enable withdrawal or transfer permissions.",
      icon: KeyIcon,
    },
    {
      step: "02",
      title: "We Encrypt & Validate Your Keys",
      description:
        "Tadex verifies that withdrawal permissions are disabled, encrypts your credentials with AES-256, and stores them in isolated database records.",
      icon: ShieldCheckIcon,
    },
    {
      step: "03",
      title: "Automated Signal Execution Begins",
      description:
        "Our engine monitors your subscribed Telegram signal channels, applies your position sizing and stop-loss rules, and dispatches orders to your exchange.",
      icon: ChartLineUpIcon,
    },
    {
      step: "04",
      title: "You Stay In Complete Control",
      description:
        "Pause automation anytime, trigger the emergency kill-switch, or revoke your API key in one click — which permanently erases the encrypted key from our database.",
      icon: SlidersIcon,
    },
  ];

  const securityPractices = [
    {
      category: "Infrastructure Security",
      items: [
        "Managed cloud infrastructure with 99.9% uptime SLA",
        "DDoS mitigation and strict API rate limiting",
        "Idempotency enforcement on every order dispatch endpoint",
        "Automated encrypted backups and disaster recovery",
      ],
    },
    {
      category: "Data & Privacy Protection",
      items: [
        "Compliance with NDPA 2023, GAID 2025, and GDPR",
        "Self-hosted web fonts via next/font (zero Google Fonts IP requests)",
        "First-party cookie-free Vercel Analytics proxied on our own domain",
        "No selling, renting, or sharing of trader data",
      ],
    },
    {
      category: "Session & Access Control",
      items: [
        "Access tokens stored exclusively in memory (never localStorage)",
        "Strict httpOnly refresh cookies for session continuity",
        "Role-based access control and session timeouts",
      ],
    },
    {
      category: "Monitoring & Incident Response",
      items: [
        "24/7 execution health and reconciliation monitoring",
        "Instant Telegram notifications for security events",
        "Emergency kill-switch to halt all automated routing",
      ],
    },
  ];

  const trustIndicators = [
    {
      icon: CheckCircleIcon,
      title: "Open Communication",
      description:
        "We are transparent about how our execution engine works, what permissions we require, and how we protect your exchange account.",
    },
    {
      icon: ShieldCheckIcon,
      title: "Clear Terms & Privacy",
      description:
        "No hidden clauses. Our Terms of Service and Privacy Policy explain our non-custodial architecture and data retention rules in plain language.",
    },
    {
      icon: WarningTriangleIcon,
      title: "Honest About Exchange Limits",
      description:
        "Order execution depends on external exchange uptime and order book liquidity. We enforce strict timeout and slippage guardrails.",
    },
    {
      icon: LockIcon,
      title: "Zero-Custody Architecture",
      description:
        "Because Tadex never holds withdrawal rights, your funds cannot be moved off your exchange even in a worst-case infrastructure breach.",
    },
  ];

  const securityFaqs = [
    {
      question: "What happens if Tadex gets compromised?",
      answer:
        "Even in a worst-case scenario, your funds cannot be withdrawn. We only accept restricted trade-only API keys with withdrawal permissions disabled, and all keys are encrypted at rest with AES-256. You can also revoke the API key directly inside your exchange at any time.",
    },
    {
      question: "Can Tadex access my exchange login credentials?",
      answer:
        "No. We never ask for your exchange email, password, or 2FA codes. You connect using a restricted-scope API key generated inside your exchange account, and you can delete or revoke that key in one click.",
    },
    {
      question: "How do I know my API keys are stored safely?",
      answer:
        "Your API keys and secrets are encrypted with AES-256 before being written to persistent storage and are never logged or displayed in plaintext after setup. Only masked suffixes (e.g. ...a1b2) are shown in your dashboard.",
    },
    {
      question: "What happens when I revoke an API key on Tadex?",
      answer:
        "When you disconnect or revoke an exchange API key in /dashboard/keys, the encrypted credential record is immediately and permanently deleted from our database, terminating all order routing to that exchange.",
    },
    {
      question: "What analytics or external requests run when I visit Tadex?",
      answer:
        "Under the Nigeria Data Protection Act (NDPA) 2023 and GAID 2025, we minimize external data exposure. When loading web fonts, assets are self-hosted via next/font so your IP address is never transmitted to Google. For web analytics, we use first-party cookie-free Vercel Analytics proxied through our own domain. Essential third-party processors (such as Paystack/Flutterwave for checkout and Bybit/Binance/OKX for order execution) are invoked only for the services you request.",
    },
  ];

  return (
    <div className="min-h-screen bg-surface-canvas font-sans text-content-primary selection:bg-brand-accent/20 selection:text-content-primary">
      {/* B10 Skip to content link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-brand-accent focus:text-surface-canvas button-sm"
      >
        Skip to content
      </a>

      {/* B7 Compact Floating Navigation Bar */}
      <header className="fixed top-4 inset-x-0 z-50 px-4 sm:px-6">
        <nav
          aria-label="Security navigation"
          className="max-w-[1120px] mx-auto bg-surface-primary/90 backdrop-blur-md border border-surface-elevated rounded-2xl px-4 sm:px-6 h-14 flex items-center justify-between"
        >
          <Link
            href="/"
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-lg"
          >
            <TadexLogo size={32} />
            <span className="title-2 text-content-primary">Tadex</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="button-sm text-content-secondary hover:text-content-primary transition-colors duration-200 ease-weighted"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="button-sm text-content-secondary hover:text-content-primary transition-colors duration-200 ease-weighted"
            >
              Terms
            </Link>
            <Link
              href="/register"
              className="bg-brand-accent hover:bg-brand-accentHover text-surface-canvas px-4 py-2 rounded-xl button-sm transition-all duration-200 ease-weighted inline-flex items-center gap-1.5"
            >
              <span>Start Free</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        </nav>
      </header>

      <main id="main">
        {/* Hero Section */}
        <section className="pt-28 pb-20 lg:pt-36 lg:pb-24 px-4 sm:px-6 lg:px-8 bg-surface-canvas">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal className="max-w-[680px]">
              <div className="inline-flex items-center gap-2 bg-surface-primary border border-surface-elevated px-3.5 py-1.5 rounded-full caption-3 text-content-secondary mb-6">
                <ShieldCheckIcon size={16} className="text-brand-accent" />
                <span>Non-Custodial Security Architecture</span>
              </div>
              <h1 className="heading-1 hero-heading-gradient max-w-[680px] mb-6">
                Your Security is Our Priority
              </h1>
              <p className="body-1 text-content-secondary max-w-[680px]">
                We believe in complete transparency about how we protect your funds and data. Your capital stays on your exchange — Tadex only dispatches trade-only orders.
              </p>
            </ScrollReveal>
          </div>
        </section>

        <div className="h-px bg-surface-elevated" />

        {/* Main Security Features */}
        <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-surface-primary">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal className="max-w-[680px] mb-14">
              <p className="caption-1 text-brand-accent uppercase tracking-wider mb-3">
                Core Safeguards
              </p>
              <h2 className="heading-2 text-content-primary mb-4">
                How We Keep Your Data Safe
              </h2>
              <p className="body-2 text-content-secondary">
                Four fundamental principles that protect your trading account at every layer.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <ScrollReveal key={feature.title} delayMs={index * 60}>
                    <div className="h-full bg-surface-subtle border border-surface-elevated rounded-2xl p-6 flex flex-col justify-between transition-colors duration-300 ease-weighted hover:border-content-tertiary">
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-surface-secondary border border-surface-elevated text-brand-accent flex items-center justify-center mb-6">
                          <IconComponent size={24} />
                        </div>

                        <h3 className="heading-5 text-content-primary mb-3">
                          {feature.title}
                        </h3>

                        <p className="body-5 text-content-secondary mb-6">
                          {feature.description}
                        </p>
                      </div>

                      <ul className="space-y-3 pt-4">
                        <div className="h-px bg-surface-elevated mb-4" />
                        {feature.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircleIcon
                              size={18}
                              className="text-brand-accent mt-0.5 flex-shrink-0"
                            />
                            <span className="body-6 text-content-primary">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        <div className="h-px bg-surface-elevated" />

        {/* How It Works Visually */}
        <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-surface-canvas">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal className="max-w-[680px] mb-14">
              <p className="caption-1 text-brand-accent uppercase tracking-wider mb-3">
                Zero-Custody Workflow
              </p>
              <h2 className="heading-2 text-content-primary mb-4">
                How It Works: Security in Action
              </h2>
              <p className="body-2 text-content-secondary">
                A step-by-step look at how we execute signals without ever touching your funds.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <ScrollReveal key={step.step} delayMs={index * 60}>
                    <div className="h-full bg-surface-primary border border-surface-elevated rounded-2xl p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <div className="w-11 h-11 rounded-xl bg-surface-subtle border border-surface-elevated text-brand-accent flex items-center justify-center">
                            <IconComponent size={22} />
                          </div>
                          <span className="caption-2 font-mono text-content-tertiary bg-surface-subtle border border-surface-elevated px-2.5 py-1 rounded-lg">
                            STEP {step.step}
                          </span>
                        </div>
                        <h3 className="heading-6 text-content-primary mb-3">
                          {step.title}
                        </h3>
                        <p className="body-6 text-content-secondary">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        <div className="h-px bg-surface-elevated" />

        {/* Security Practices Grid */}
        <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-surface-primary">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal className="max-w-[680px] mb-14">
              <p className="caption-1 text-brand-accent uppercase tracking-wider mb-3">
                Defense In Depth
              </p>
              <h2 className="heading-2 text-content-primary mb-4">
                Our Security Practices
              </h2>
              <p className="body-2 text-content-secondary">
                Industry-standard operational controls across every layer of the platform.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityPractices.map((practice, index) => (
                <ScrollReveal key={practice.category} delayMs={index * 60}>
                  <div className="h-full bg-surface-subtle border border-surface-elevated rounded-2xl p-6">
                    <h3 className="heading-5 text-content-primary mb-4">
                      {practice.category}
                    </h3>
                    <div className="h-px bg-surface-elevated mb-5" />
                    <ul className="space-y-3.5">
                      {practice.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 flex-shrink-0" />
                          <span className="body-6 text-content-secondary">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <div className="h-px bg-surface-elevated" />

        {/* Trust & Transparency */}
        <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-surface-canvas">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal className="max-w-[680px] mb-14">
              <p className="caption-1 text-brand-accent uppercase tracking-wider mb-3">
                Verifiable Trust
              </p>
              <h2 className="heading-2 text-content-primary mb-4">
                Building Trust Through Transparency
              </h2>
              <p className="body-2 text-content-secondary">
                We believe in direct, plain-English communication about how Tadex operates.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trustIndicators.map((indicator, index) => {
                const IconComponent = indicator.icon;
                return (
                  <ScrollReveal key={indicator.title} delayMs={index * 60}>
                    <div className="h-full bg-surface-primary border border-surface-elevated rounded-2xl p-6 flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-surface-subtle border border-surface-elevated text-brand-accent flex items-center justify-center flex-shrink-0">
                        <IconComponent size={22} />
                      </div>
                      <div>
                        <h3 className="title-1 text-content-primary mb-2">
                          {indicator.title}
                        </h3>
                        <p className="body-6 text-content-secondary">
                          {indicator.description}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        <div className="h-px bg-surface-elevated" />

        {/* FAQ Section */}
        <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-surface-primary">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal className="max-w-[680px] mb-12">
              <p className="caption-1 text-brand-accent uppercase tracking-wider mb-3">
                Security FAQ
              </p>
              <h2 className="heading-2 text-content-primary">
                Common Security Questions
              </h2>
            </ScrollReveal>

            <div className="space-y-3">
              {securityFaqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <ScrollReveal key={faq.question} delayMs={index * 50}>
                    <div className="bg-surface-subtle border border-surface-elevated rounded-2xl overflow-hidden transition-colors duration-300 ease-weighted hover:border-content-tertiary">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                      >
                        <span className="title-2 text-content-primary">
                          {faq.question}
                        </span>
                        <span
                          className={`w-8 h-8 rounded-lg bg-surface-secondary text-content-secondary flex items-center justify-center flex-shrink-0 transition-transform duration-300 ease-weighted ${
                            isOpen ? "rotate-180 text-brand-accent" : ""
                          }`}
                        >
                          <CaretDownIcon size={18} />
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-6 pt-1">
                          <div className="h-px bg-surface-elevated mb-4" />
                          <p className="body-5 text-content-secondary">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        <div className="h-px bg-surface-elevated" />

        {/* Final CTA */}
        <section className="py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-surface-canvas">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal>
              <div className="bg-surface-primary border border-surface-elevated rounded-3xl p-8 sm:p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand-accentSubtle border border-brand-accent/40 text-brand-accent flex items-center justify-center mx-auto mb-6">
                  <ShieldCheckIcon size={28} />
                </div>
                <h2 className="heading-2 text-content-primary max-w-[680px] mx-auto mb-4">
                  Automate with Confidence
                </h2>
                <p className="body-2 text-content-secondary max-w-[680px] mx-auto mb-8">
                  Your security and trust are the foundation of everything we build. Connect trade-only keys and start automating with peace of mind.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="bg-brand-accent hover:bg-brand-accentHover text-surface-canvas px-8 py-4 rounded-xl button-lg transition-all duration-300 ease-weighted hover:-translate-y-0.5 inline-flex items-center gap-2"
                  >
                    <span>Get Started Securely</span>
                    <ArrowRightIcon size={18} />
                  </Link>
                  <Link
                    href="/privacy"
                    className="bg-surface-subtle hover:bg-surface-secondary border border-surface-elevated text-content-primary px-6 py-4 rounded-xl button-lg transition-colors duration-300 ease-weighted"
                  >
                    Read Privacy Policy
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}