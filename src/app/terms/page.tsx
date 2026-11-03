import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import TadexLogo from '@/components/ui/TadexLogo';
import { ShieldCheckIcon, WarningTriangleIcon, ArrowRightIcon } from '@/components/ui/PhosphorIcons';

export const metadata = {
  title: 'Terms of Service | Tadex',
  description: 'Terms of Service for Tadex, a product of Voreza Technologies.',
};

export default function TermsPage() {
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
          aria-label="Legal navigation"
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
              href="/security"
              className="button-sm text-content-secondary hover:text-content-primary transition-colors duration-200 ease-weighted"
            >
              Security
            </Link>
            <Link
              href="/"
              className="bg-surface-secondary hover:bg-surface-elevated text-content-primary px-4 py-2 rounded-xl button-sm transition-colors duration-200 ease-weighted inline-flex items-center gap-1.5"
            >
              <span>Home</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>
        </nav>
      </header>

      <main id="main" className="pt-28 pb-20 lg:pt-36 lg:pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-surface-primary border border-surface-elevated px-3.5 py-1.5 rounded-full caption-3 text-content-secondary mb-6">
              <ShieldCheckIcon size={16} className="text-brand-accent" />
              <span>Platform Agreement</span>
            </div>
            <h1 className="heading-1 hero-heading-gradient max-w-[680px] mb-4">
              Terms of Service
            </h1>
            <p className="body-2 text-content-secondary max-w-[680px]">
              Last Updated: November 1, 2026
            </p>
          </div>

          {/* Legal Review Notice Banner */}
          <div className="rounded-2xl border border-status-warning/40 bg-surface-warm p-5 mb-8 text-content-secondary body-6 flex items-start gap-3.5">
            <WarningTriangleIcon size={20} className="text-status-warning flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-content-primary font-medium">Legal Review Notice:</strong> This document represents an operational terms draft reflecting current Tadex platform architecture, non-custodial execution, and provider marketplace mechanics. This draft is subject to formal legal review and regulatory approval in applicable jurisdictions (Nigeria, Kenya, Ghana) prior to definitive legal adoption.
            </div>
          </div>

          <div className="bg-surface-primary border border-surface-elevated rounded-2xl p-6 sm:p-10 md:p-12 space-y-10 text-content-secondary body-5">
            <p className="body-4 text-content-primary">
              Welcome to Tadex (the &ldquo;Platform&rdquo;), owned and operated by Voreza Technologies (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;).
              These Terms of Service (&ldquo;Terms&rdquo;) constitute a legally binding agreement between you and Voreza Technologies
              governing your access to and use of our web applications, APIs, smart order dispatch tools, and Telegram
              automation services. By accessing or using the Platform, you acknowledge that you have read, understood,
              and agree to be bound by these Terms. If you do not agree, do not access or use the Platform.
            </p>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-4">
              <h2 className="heading-5 text-content-primary">1. Eligibility &amp; Account Security</h2>
              <p>
                To use Tadex, you must be at least 18 years of age and possess the legal capacity to enter into a binding agreement.
                When registering an account, you agree to:
              </p>
              <ul className="space-y-2.5 pl-1">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>Provide accurate, current, and complete registration information.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>Maintain the security of your password and authentication credentials.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>Promptly notify us of any unauthorized use or security breach of your account.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>Connect only third-party exchange accounts that you lawfully own and control.</span>
                </li>
              </ul>
            </section>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-4">
              <h2 className="heading-5 text-content-primary">2. Nature of Service &amp; Non-Custodial Architecture</h2>
              <p>
                Tadex provides workflow software tools that automate the dispatch of trading orders to supported cryptocurrency
                exchanges (such as Bybit, Binance, and OKX) based on signal feeds configured by users or published by independent Signal Providers.
              </p>
              <ul className="space-y-3 pl-1">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Strictly Non-Custodial:</strong> Tadex is <strong className="text-content-primary font-medium">not</strong> a custodian, exchange, broker-dealer,
                    bank, or money transmitter. We never take possession, custody, or control of your cryptocurrency or fiat assets.
                    All deposited trading capital remains at all times in your external exchange account.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Trade-Only API Keys Required:</strong> Users connect to the Platform using exchange API keys restricted
                    strictly to trade execution permissions (<code className="bg-surface-secondary text-content-primary px-1.5 py-0.5 rounded font-mono caption-4">Read-Write: Orders &amp; Positions</code>).
                    <strong className="text-content-primary font-medium"> You must never enable withdrawal permissions.</strong> Tadex automatically verifies key permissions and will reject or revoke any API key with withdrawal capabilities.
                  </span>
                </li>
              </ul>
            </section>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-4">
              <h2 className="heading-5 text-content-primary">3. Provider Marketplace &amp; Independent Relationship</h2>
              <p>
                The Platform includes a two-sided marketplace where independent traders (&ldquo;Signal Providers&rdquo;) may publish
                trading strategies and signals for subscription by other users (&ldquo;Subscribers&rdquo;).
              </p>
              <ul className="space-y-3 pl-1">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Tadex is Not a Financial Advisor:</strong> Tadex is a software technology provider and does
                    <strong className="text-content-primary font-medium"> not</strong> provide investment advice, financial recommendations, portfolio management, or trading counsel.
                    Nothing on the Platform constitutes an offer or solicitation to buy or sell any digital asset.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Signal Providers are Independent Third Parties:</strong> Signal Providers are independent contractors
                    and are not employees, agents, or partners of Voreza Technologies. Tadex does not direct, control, or guarantee
                    the accuracy, profitability, or risk management of any signal provider.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">No Performance Guarantees:</strong> Past performance, win rates, and historical return metrics displayed
                    in provider profiles are historical representations and <strong className="text-content-primary font-medium">do not guarantee future results</strong>. You are solely
                    responsible for evaluating the risks of any strategy you choose to automate.
                  </span>
                </li>
              </ul>
            </section>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-4">
              <h2 className="heading-5 text-content-primary">4. Cryptocurrency &amp; Execution Risk Disclosures</h2>
              <p>
                Cryptocurrency trading involves substantial risk of financial loss and is not suitable for every individual.
                By using Tadex, you explicitly acknowledge and accept the following operational risks:
              </p>
              <ul className="space-y-3 pl-1">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Market Volatility &amp; Liquidation:</strong> Digital asset markets are subject to extreme price fluctuations.
                    Leveraged trading carries high risk, including the rapid liquidation of your entire exchange balance.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Latency, Slippage &amp; Execution Gaps:</strong> Automated order routing is subject to internet transmission delays,
                    order book liquidity constraints, and price slippage between the moment a signal is triggered and when your exchange fills the order.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Third-Party System Dependencies:</strong> Platform functionality depends on external third-party infrastructure,
                    including exchange API availability (Bybit, Binance, OKX), payment gateways (Flutterwave, Paystack), and cloud providers. Tadex is not
                    liable for losses caused by exchange API rate-limiting, system outages, maintenance windows, or unexpected exchange rule changes.
                  </span>
                </li>
              </ul>
            </section>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-4">
              <h2 className="heading-5 text-content-primary">5. Subscription Billing, Fees &amp; Refund Policy</h2>
              <ul className="space-y-3 pl-1">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Subscription Fees:</strong> Signal provider plans and platform automation features are billed on a periodic
                    subscription basis (monthly), payable in supported fiat currencies (NGN, USD, KES, GHS) or stablecoins (USDT) via integrated payment gateways.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Platform Automation Fee:</strong> Tadex retains a transparent platform automation and service fee on transactions,
                    which is clearly disclosed in the itemized checkout quote prior to payment confirmation.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Cancellation at Period End:</strong> You may cancel an active subscription at any time via your billing dashboard
                    (<Link href="/dashboard/billing" className="text-brand-accent hover:underline">/dashboard/billing</Link>). Upon cancellation, your
                    subscription will remain active until the end of the currently paid billing period, after which automated execution for that provider will cease.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Strict Non-Refundable Policy:</strong> Because access to automated signal routing and digital software capabilities
                    is provisioned immediately upon successful transaction confirmation, <strong className="text-content-primary font-medium">all subscription payments are strictly non-refundable</strong>,
                    except where explicitly mandated by applicable statutory consumer protection law.
                  </span>
                </li>
              </ul>
            </section>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-4">
              <h2 className="heading-5 text-content-primary">6. Account Suspension &amp; Termination Grounds</h2>
              <p>
                Tadex reserves the right to immediately suspend, restrict, or permanently terminate your account and API access,
                without prior notice or liability, in the event of:
              </p>
              <ul className="space-y-2.5 pl-1">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>Submission of exchange API keys with withdrawal permissions enabled.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>Fraudulent, fabricated, or intentionally deceptive signal track record claims by a Signal Provider.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>Initiation of fraudulent payment chargebacks or payment disputes without prior good-faith support engagement.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>Abusive API usage, automated scraping, denial-of-service attempts, or reverse engineering of platform software.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>Compliance with court orders, regulatory directives, or lawful requests from financial authorities in Nigeria, Kenya, or Ghana.</span>
                </li>
              </ul>
            </section>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-4">
              <h2 className="heading-5 text-content-primary">7. Disclaimer of Warranties &amp; Limitation of Liability</h2>
              <p>
                THE PLATFORM IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED,
                INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, VOREZA TECHNOLOGIES, ITS DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE
                FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF TRADING CAPITAL, PROFITS, DATA, OR
                GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THE PLATFORM OR ANY SIGNAL ACCESSED THROUGH THE PLATFORM.
              </p>
            </section>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-4">
              <h2 className="heading-5 text-content-primary">8. Governing Law &amp; Dispute Resolution</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.
                Any dispute arising out of or relating to these Terms shall first be submitted to good-faith amicable negotiation.
                If unresolved within thirty (30) days, the dispute shall be resolved through binding arbitration in Lagos State, Nigeria.
              </p>
            </section>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-3">
              <h2 className="heading-5 text-content-primary">9. Contact &amp; Operating Address</h2>
              <div className="bg-surface-subtle border border-surface-elevated rounded-xl p-4 text-content-secondary">
                <p className="title-3 text-content-primary">Voreza Technologies</p>
                <p className="body-6 text-content-secondary mt-1">Location: Lagos, Nigeria</p>
                <p className="body-6 text-content-secondary mt-1">
                  Email: <a href="mailto:tadex.team@gmail.com" className="text-brand-accent hover:underline">tadex.team@gmail.com</a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}