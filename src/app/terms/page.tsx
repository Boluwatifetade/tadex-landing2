import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Tadex',
  description: 'Terms of Service for Tadex, a product of Voreza Technologies.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-[#004859]/10 text-[#004859] px-4 py-2 rounded-full text-sm font-medium mb-4">
            Terms of Service
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#004859] mb-4">
            Terms of Service
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Last Updated: August 26, 2026
          </p>
        </div>

        {/* Legal Review Notice Banner */}
        <div className="rounded-xl border border-amber-500/30 bg-amber-50 p-4 mb-8 text-amber-900 text-sm flex items-start gap-3">
          <span className="text-lg">⚖️</span>
          <div>
            <strong>Legal Review Notice:</strong> This document represents an operational terms draft reflecting current Tadex platform architecture, non-custodial execution, and provider marketplace mechanics. This draft is subject to formal legal review and regulatory approval in applicable jurisdictions (Nigeria, Kenya, Ghana) prior to definitive legal adoption.
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-8 text-slate-700 leading-relaxed">
          <p>
            Welcome to Tadex (the "Platform"), owned and operated by Voreza Technologies ("we", "us", or "our"). 
            These Terms of Service ("Terms") constitute a legally binding agreement between you and Voreza Technologies 
            governing your access to and use of our web applications, APIs, smart order dispatch tools, and Telegram 
            automation services. By accessing or using the Platform, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms. If you do not agree, do not access or use the Platform.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">1. Eligibility &amp; Account Security</h2>
            <p className="mb-3">
              To use Tadex, you must be at least 18 years of age and possess the legal capacity to enter into a binding agreement. 
              When registering an account, you agree to:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Provide accurate, current, and complete registration information.</li>
              <li>Maintain the security of your password and authentication credentials.</li>
              <li>Promptly notify us of any unauthorized use or security breach of your account.</li>
              <li>Connect only third-party exchange accounts that you lawfully own and control.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">2. Nature of Service &amp; Non-Custodial Architecture</h2>
            <p className="mb-3">
              Tadex provides workflow software tools that automate the dispatch of trading orders to supported cryptocurrency 
              exchanges (such as Bybit) based on signal feeds configured by users or published by independent Signal Providers.
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong>Strictly Non-Custodial:</strong> Tadex is <strong>not</strong> a custodian, exchange, broker-dealer, 
                bank, or money transmitter. We never take possession, custody, or control of your cryptocurrency or fiat assets. 
                All deposited trading capital remains at all times in your external exchange account.
              </li>
              <li>
                <strong>Trade-Only API Keys Required:</strong> Users connect to the Platform using exchange API keys restricted 
                strictly to trade execution permissions (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs">Read-Write: Orders &amp; Positions</code>). 
                <strong>You must never enable withdrawal permissions.</strong> Tadex automatically verifies key permissions and will reject or revoke any API key with withdrawal capabilities.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">3. Provider Marketplace &amp; Independent Relationship</h2>
            <p className="mb-3">
              The Platform includes a two-sided marketplace where independent traders ("Signal Providers") may publish 
              trading strategies and signals for subscription by other users ("Subscribers").
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong>Tadex is Not a Financial Advisor:</strong> Tadex is a software technology provider and does 
                <strong> not</strong> provide investment advice, financial recommendations, portfolio management, or trading counsel. 
                Nothing on the Platform constitutes an offer or solicitation to buy or sell any digital asset.
              </li>
              <li>
                <strong>Signal Providers are Independent Third Parties:</strong> Signal Providers are independent contractors 
                and are not employees, agents, or partners of Voreza Technologies. Tadex does not direct, control, or guarantee 
                the accuracy, profitability, or risk management of any signal provider.
              </li>
              <li>
                <strong>No Performance Guarantees:</strong> Past performance, win rates, and historical return metrics displayed 
                in provider profiles are historical representations and <strong>do not guarantee future results</strong>. You are solely 
                responsible for evaluating the risks of any strategy you choose to automate.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">4. Cryptocurrency &amp; Execution Risk Disclosures</h2>
            <p className="mb-3">
              Cryptocurrency trading involves substantial risk of financial loss and is not suitable for every individual. 
              By using Tadex, you explicitly acknowledge and accept the following operational risks:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong>Market Volatility &amp; Liquidation:</strong> Digital asset markets are subject to extreme price fluctuations. 
                Leveraged trading carries high risk, including the rapid liquidation of your entire exchange balance.
              </li>
              <li>
                <strong>Latency, Slippage &amp; Execution Gaps:</strong> Automated order routing is subject to internet transmission delays, 
                order book liquidity constraints, and price slippage between the moment a signal is triggered and when your exchange fills the order.
              </li>
              <li>
                <strong>Third-Party System Dependencies:</strong> Platform functionality depends on external third-party infrastructure, 
                including exchange API availability (Bybit), payment gateways (Flutterwave, Paystack), and cloud providers. Tadex is not 
                liable for losses caused by exchange API rate-limiting, system outages, maintenance windows, or unexpected exchange rule changes.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">5. Subscription Billing, Fees &amp; Refund Policy</h2>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong>Subscription Fees:</strong> Signal provider plans and platform automation features are billed on a periodic 
                subscription basis (monthly), payable in supported fiat currencies (NGN) or stablecoins (USDT) via integrated payment gateways.
              </li>
              <li>
                <strong>Platform Automation Fee:</strong> Tadex retains a transparent platform automation and service fee on transactions, 
                which is clearly disclosed in the itemized checkout quote prior to payment confirmation.
              </li>
              <li>
                <strong>Cancellation at Period End:</strong> You may cancel an active subscription at any time via your billing dashboard 
                (<Link href="/dashboard/billing" className="text-[#004859] underline">/dashboard/billing</Link>). Upon cancellation, your 
                subscription will remain active until the end of the currently paid billing period, after which automated execution for that provider will cease.
              </li>
              <li>
                <strong>Strict Non-Refundable Policy:</strong> Because access to automated signal routing and digital software capabilities 
                is provisioned immediately upon successful transaction confirmation, <strong>all subscription payments are strictly non-refundable</strong>, 
                except where explicitly mandated by applicable statutory consumer protection law.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">6. Account Suspension &amp; Termination Grounds</h2>
            <p className="mb-3">
              Tadex reserves the right to immediately suspend, restrict, or permanently terminate your account and API access, 
              without prior notice or liability, in the event of:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Submission of exchange API keys with withdrawal permissions enabled.</li>
              <li>Fraudulent, fabricated, or intentionally deceptive signal track record claims by a Signal Provider.</li>
              <li>Initiation of fraudulent payment chargebacks or payment disputes without prior good-faith support engagement.</li>
              <li>Abusive API usage, automated scraping, denial-of-service attempts, or reverse engineering of platform software.</li>
              <li>Compliance with court orders, regulatory directives, or lawful requests from financial authorities in Nigeria, Kenya, or Ghana.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">7. Disclaimer of Warranties &amp; Limitation of Liability</h2>
            <p className="mb-3">
              THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, 
              INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
            </p>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, VOREZA TECHNOLOGIES, ITS DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE 
              FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF TRADING CAPITAL, PROFITS, DATA, OR 
              GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OR INABILITY TO USE THE PLATFORM OR ANY SIGNAL ACCESSED THROUGH THE PLATFORM.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">8. Governing Law &amp; Dispute Resolution</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria. 
              Any dispute arising out of or relating to these Terms shall first be submitted to good-faith amicable negotiation. 
              If unresolved within thirty (30) days, the dispute shall be resolved through binding arbitration in Lagos State, Nigeria.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">9. Contact &amp; Operating Address</h2>
            <p className="text-slate-600">
              <strong>Voreza Technologies</strong><br />
              17 Peaceland Estate, Igbe Kapo,<br />
              Ikorodu, Lagos State, Nigeria<br />
              Email: <a href="mailto:tadex.team@gmail.com" className="text-[#004859] underline">tadex.team@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}