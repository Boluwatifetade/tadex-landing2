import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Tadex',
  description: 'Privacy Policy for Tadex, a product of Voreza Technologies.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-[#004859]/10 text-[#004859] px-4 py-2 rounded-full text-sm font-medium mb-4">
            Privacy Policy
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#004859] mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Last Updated: August 26, 2026
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12 space-y-8 text-slate-700 leading-relaxed">
          <p>
            Voreza Technologies ("we", "us", or "our") operates the Tadex platform (the "Platform"). 
            Tadex is a non-custodial crypto signal execution automation platform designed to enable retail 
            traders to execute trades on third-party exchanges via restricted API keys. 
            This Privacy Policy describes how we collect, use, store, and protect your information across our web 
            application, API services, and associated Telegram automation tools.
          </p>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">1. Information We Collect</h2>
            <p className="mb-4">
              To deliver non-custodial signal execution, billing, and platform security, we collect the following 
              categories of information:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong>Account &amp; Identity Information:</strong> Email address, hashed password credentials, 
                and email verification status when you create an account on the Platform.
              </li>
              <li>
                <strong>Encrypted Exchange API Credentials:</strong> Third-party exchange (e.g., Bybit) API keys 
                and API secrets submitted by you. <strong>All API keys and secrets are encrypted at rest using AES-256 
                and are never stored or logged in plaintext.</strong> Tadex strictly enforces trade-only permissions 
                and rejects any API keys with withdrawal capabilities enabled.
              </li>
              <li>
                <strong>Telegram Identifiers:</strong> Telegram user IDs and usernames when you link your Telegram 
                account to the platform or interact with the Tadex Telegram execution bot.
              </li>
              <li>
                <strong>Signal Provider Verification Data:</strong> For users applying to become Signal Providers, 
                we collect operational identity information, verified trading track records (such as read-only exchange 
                statements or verified profile links), trading focus areas, and referral sources.
              </li>
              <li>
                <strong>Billing &amp; Transaction Metadata:</strong> Payment currency (NGN, USDT, USD), gross subscription 
                amounts, itemized platform fee deductions, transaction timestamps, external payment gateway reference 
                codes, and gateway transaction IDs (via Flutterwave or Paystack). <em>Note: Tadex never collects, stores, 
                or processes credit/debit card numbers or bank account PINs; all payment processing is handled on certified, 
                secure hosted payment gateway pages.</em>
              </li>
              <li>
                <strong>System, Execution &amp; Audit Telemetry:</strong> Masked API key representations (e.g., 
                <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">...a1b2</code>), trade execution logs, 
                position monitoring status, IP addresses, session timestamps, and administrative audit logs for security 
                incident response and emergency kill-switch events.
              </li>
              <li>
                <strong>Waitlist Submissions:</strong> Email addresses, planned trading volume, and automation preferences 
                voluntarily submitted via waitlist forms.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">2. How We Use Your Information</h2>
            <p className="mb-3">We use collected information solely for the following operational purposes:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Authenticating your identity and maintaining secure session access.</li>
              <li>Routing user-authorized automated trade signals to your connected exchange account via trade-only API keys.</li>
              <li>Processing subscription billing, calculating transparent platform automation fees, and verifying payment settlements.</li>
              <li>Auditing and approving Signal Provider applications to protect community trading standards.</li>
              <li>Delivering real-time execution alerts, position status updates, and security notifications via web and Telegram.</li>
              <li>Maintaining immutable compliance audit logs and enforcing operational safety controls (such as emergency kill-switches).</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">3. Data Security &amp; Encryption Standards</h2>
            <p className="mb-3">
              We employ strict industry-standard technical and operational security controls to safeguard your data:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong>AES-256 Encryption at Rest:</strong> All exchange API keys and secrets are encrypted with 
                AES-256 before being written to persistent database storage.
              </li>
              <li>
                <strong>In-Memory Access Tokens:</strong> User access tokens are held exclusively in volatile memory 
                during active sessions and are never written to unencrypted browser storage (<code className="bg-slate-100 px-1 py-0.5 rounded text-xs">localStorage</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">sessionStorage</code>).
              </li>
              <li>
                <strong>Transport Layer Encryption:</strong> All communications between your browser, our API gateway, 
                and external exchange endpoints are encrypted using TLS 1.3.
              </li>
              <li>
                <strong>Zero Custody Guarantee:</strong> We never request, collect, or store withdrawal permissions. 
                Your funds always remain in your own exchange account.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">4. Data Retention &amp; Deletion Policy</h2>
            <p className="mb-3">We adhere to clear data lifecycle principles:</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong>Immediate Key Erasure on Revocation:</strong> When you disconnect or revoke an exchange API key 
                in your dashboard (<Link href="/dashboard/keys" className="text-[#004859] underline">/dashboard/keys</Link>), 
                the encrypted credential record is <strong>immediately and permanently deleted from our database</strong>, 
                instantly terminating our system's ability to dispatch orders to your exchange account.
              </li>
              <li>
                <strong>Account Deletion:</strong> You may request full account closure and erasure of your personal data 
                at any time by emailing <a href="mailto:tadex.team@gmail.com" className="text-[#004859] underline">tadex.team@gmail.com</a>. 
                Upon verified request, your profile and credentials will be permanently purged from active systems.
              </li>
              <li>
                <strong>Statutory Financial Records:</strong> Billing transaction records and compliance audit logs are 
                retained for the statutory period required by applicable accounting, tax, and anti-financial crime laws in 
                Nigeria, Kenya, and Ghana.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">5. Cookies &amp; Tracking Technologies</h2>
            <p className="mb-3">
              Tadex does not use third-party marketing or cross-site tracking cookies. We utilize strictly necessary 
              first-party <code className="bg-slate-100 px-1 py-0.5 rounded text-xs">httpOnly</code> cookies for silent 
              session authentication and token refresh. These cookies are essential for the secure operation of the platform 
              and cannot be disabled without preventing authenticated dashboard access.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">6. Third-Party Service Providers</h2>
            <p className="mb-3">
              We do not sell, rent, or trade your personal information. We share data only with trusted third parties 
              strictly necessary for operating the platform:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>Payment Processors:</strong> Flutterwave and Paystack for billing facilitation and webhook transaction verification.</li>
              <li><strong>Exchange APIs:</strong> Bybit API for dispatching user-authorized orders and position monitoring.</li>
              <li><strong>Cloud Infrastructure:</strong> Managed database and hosting providers operating under strict confidentiality and security agreements.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">7. Your Data Rights (NDPR / Data Protection)</h2>
            <p>
              In accordance with the Nigeria Data Protection Regulation (NDPR) and applicable regional data protection laws, 
              you have the right to request access to your data, rectify inaccuracies, request data erasure, or restrict processing. 
              To exercise any of these rights, please contact our Data Protection Officer at{' '}
              <a href="mailto:tadex.team@gmail.com" className="text-[#004859] underline">tadex.team@gmail.com</a>.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#004859] mb-3">8. Contact Us &amp; Operating Address</h2>
            <p className="mb-2">
              If you have any questions, concerns, or feedback regarding this Privacy Policy or our security practices, 
              please contact us at:
            </p>
            <p className="text-slate-600">
              <strong>Voreza Technologies</strong><br />
              Lagos, Nigeria<br />
              Email: <a href="mailto:tadex.team@gmail.com" className="text-[#004859] underline">tadex.team@gmail.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}