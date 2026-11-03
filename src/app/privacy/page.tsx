import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import TadexLogo from '@/components/ui/TadexLogo';
import { ShieldCheckIcon, ArrowRightIcon } from '@/components/ui/PhosphorIcons';

export const metadata = {
  title: 'Privacy Policy | Tadex',
  description: 'Privacy Policy for Tadex, a product of Voreza Technologies.',
};

export default function PrivacyPage() {
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
              href="/terms"
              className="button-sm text-content-secondary hover:text-content-primary transition-colors duration-200 ease-weighted"
            >
              Terms
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
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-surface-primary border border-surface-elevated px-3.5 py-1.5 rounded-full caption-3 text-content-secondary mb-6">
              <ShieldCheckIcon size={16} className="text-brand-accent" />
              <span>Privacy &amp; Data Protection</span>
            </div>
            <h1 className="heading-1 hero-heading-gradient max-w-[680px] mb-4">
              Privacy Policy
            </h1>
            <p className="body-2 text-content-secondary max-w-[680px]">
              Last Updated: November 1, 2026
            </p>
          </div>

          <div className="bg-surface-primary border border-surface-elevated rounded-2xl p-6 sm:p-10 md:p-12 space-y-10 text-content-secondary body-5">
            <p className="body-4 text-content-primary">
              Voreza Technologies (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates the Tadex platform (the &ldquo;Platform&rdquo;).
              Tadex is a non-custodial crypto signal execution automation platform designed to enable retail
              traders to execute trades on third-party exchanges via restricted API keys.
              This Privacy Policy describes how we collect, use, store, and protect your information across our web
              application, API services, and associated Telegram automation tools.
            </p>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-4">
              <h2 className="heading-5 text-content-primary">1. Information We Collect</h2>
              <p>
                To deliver non-custodial signal execution, billing, and platform security, we collect the following
                categories of information:
              </p>
              <ul className="space-y-3 pl-1">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Account &amp; Identity Information:</strong> Email address, hashed password credentials,
                    and email verification status when you create an account on the Platform.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Encrypted Exchange API Credentials:</strong> Third-party exchange (e.g., Bybit, Binance, OKX) API keys
                    and API secrets submitted by you. <strong className="text-content-primary font-medium">All API keys and secrets are encrypted at rest using AES-256
                    and are never stored or logged in plaintext.</strong> Tadex strictly enforces trade-only permissions
                    and rejects any API keys with withdrawal capabilities enabled.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Telegram Identifiers:</strong> Telegram user IDs and usernames when you link your Telegram
                    account to the platform or interact with the Tadex Telegram execution bot.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Signal Provider Verification Data:</strong> For users applying to become Signal Providers,
                    we collect operational identity information, verified trading track records (such as read-only exchange
                    statements or verified profile links), trading focus areas, and referral sources.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Billing &amp; Transaction Metadata:</strong> Payment currency (NGN, USDT, USD, KES, GHS), gross subscription
                    amounts, itemized platform fee deductions, transaction timestamps, external payment gateway reference
                    codes, and gateway transaction IDs (via Flutterwave or Paystack). Note: Tadex never collects, stores,
                    or processes credit/debit card numbers or bank account PINs; all payment processing is handled on certified,
                    secure hosted payment gateway pages.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">System, Execution &amp; Audit Telemetry:</strong> Masked API key representations (e.g.,{' '}
                    <code className="bg-surface-secondary text-content-primary px-1.5 py-0.5 rounded font-mono caption-4">...a1b2</code>), trade execution logs,
                    position monitoring status, IP addresses, session timestamps, and administrative audit logs for security
                    incident response and emergency kill-switch events.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Waitlist Submissions:</strong> Email addresses, planned trading volume, and automation preferences
                    voluntarily submitted via waitlist forms.
                  </span>
                </li>
              </ul>
            </section>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-4">
              <h2 className="heading-5 text-content-primary">2. How We Use Your Information</h2>
              <p>We use collected information solely for the following operational purposes:</p>
              <ul className="space-y-2.5 pl-1">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>Authenticating your identity and maintaining secure session access.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>Routing user-authorized automated trade signals to your connected exchange account via trade-only API keys.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>Processing subscription billing, calculating transparent platform automation fees, and verifying payment settlements.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>Auditing and approving Signal Provider applications to protect community trading standards.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>Delivering real-time execution alerts, position status updates, and security notifications via web and Telegram.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>Maintaining immutable compliance audit logs and enforcing operational safety controls (such as emergency kill-switches).</span>
                </li>
              </ul>
            </section>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-4">
              <h2 className="heading-5 text-content-primary">3. Data Security &amp; Encryption Standards</h2>
              <p>
                We employ strict industry-standard technical and operational security controls to safeguard your data:
              </p>
              <ul className="space-y-3 pl-1">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">AES-256 Encryption at Rest:</strong> All exchange API keys and secrets are encrypted with
                    AES-256 before being written to persistent database storage.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">In-Memory Access Tokens:</strong> User access tokens are held exclusively in volatile memory
                    during active sessions and are never written to unencrypted browser storage (<code className="bg-surface-secondary text-content-primary px-1.5 py-0.5 rounded font-mono caption-4">localStorage</code> or <code className="bg-surface-secondary text-content-primary px-1.5 py-0.5 rounded font-mono caption-4">sessionStorage</code>).
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Transport Layer Encryption:</strong> All communications between your browser, our API gateway,
                    and external exchange endpoints are encrypted using TLS 1.3.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Zero Custody Guarantee:</strong> We never request, collect, or store withdrawal permissions.
                    Your funds always remain in your own exchange account.
                  </span>
                </li>
              </ul>
            </section>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-4">
              <h2 className="heading-5 text-content-primary">4. Data Retention &amp; Deletion Policy</h2>
              <p>We adhere to clear data lifecycle principles:</p>
              <ul className="space-y-3 pl-1">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Immediate Key Erasure on Revocation:</strong> When you disconnect or revoke an exchange API key
                    in your dashboard (<Link href="/dashboard/keys" className="text-brand-accent hover:underline">/dashboard/keys</Link>),
                    the encrypted credential record is <strong className="text-content-primary font-medium">immediately and permanently deleted from our database</strong>,
                    instantly terminating our system&apos;s ability to dispatch orders to your exchange account.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Account Deletion:</strong> You may request full account closure and erasure of your personal data
                    at any time by emailing <a href="mailto:tadex.team@gmail.com" className="text-brand-accent hover:underline">tadex.team@gmail.com</a>.
                    Upon verified request, your profile and credentials will be permanently purged from active systems.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span>
                    <strong className="text-content-primary font-medium">Statutory Financial Records:</strong> Billing transaction records and compliance audit logs are
                    retained for the statutory period required by applicable accounting, tax, and anti-financial crime laws in
                    Nigeria, Kenya, and Ghana.
                  </span>
                </li>
              </ul>
            </section>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-4">
              <h2 className="heading-5 text-content-primary">5. Cookies, First-Party Analytics &amp; Self-Hosted Fonts</h2>
              <p>
                <strong className="text-content-primary font-medium">Strictly Necessary Authentication Cookies:</strong> Tadex does not use third-party advertising or cross-site tracking cookies. We utilize strictly necessary
                first-party <code className="bg-surface-secondary text-content-primary px-1.5 py-0.5 rounded font-mono caption-4">httpOnly</code> cookies for silent
                session authentication and token refresh. Because these cookies are strictly necessary for the provision of the service you request (session authentication), they do not require separate consent under applicable data protection laws, but you can clear them at any time through browser settings (which will result in logout).
              </p>
              <p>
                <strong className="text-content-primary font-medium">First-Party Cookie-Free Web Analytics (Vercel Analytics):</strong> For web traffic analytics, we use <code className="bg-surface-secondary text-content-primary px-1.5 py-0.5 rounded font-mono caption-4">@vercel/analytics</code> to measure aggregate page views and route performance without sending analytics telemetry to third-party advertising networks.
                Analytics requests are proxied first-party through our own domain (<code className="bg-surface-secondary text-content-primary px-1.5 py-0.5 rounded font-mono caption-4">/_vercel/insights/*</code>), do not set any cookies by default, never fingerprint persistent cross-site profiles, and discard visitor identifiers after 24 hours.
              </p>
              <p>
                <strong className="text-content-primary font-medium">Self-Hosted Web Fonts (Zero Google Fonts Requests):</strong> To protect visitor privacy under the Nigeria Data Protection Act (NDPA) 2023, the General Application and Implementation Directive (GAID) 2025, and GDPR,
                all web fonts (<code className="bg-surface-secondary text-content-primary px-1.5 py-0.5 rounded font-mono caption-4">Geist</code> and <code className="bg-surface-secondary text-content-primary px-1.5 py-0.5 rounded font-mono caption-4">Geist Mono</code>) are compiled and self-hosted at build time via <code className="bg-surface-secondary text-content-primary px-1.5 py-0.5 rounded font-mono caption-4">next/font</code> and served as static files from our own domain (<code className="bg-surface-secondary text-content-primary px-1.5 py-0.5 rounded font-mono caption-4">/_next/static/media/</code>).
                When loading web fonts, your browser never connects to <code className="bg-surface-secondary text-content-primary px-1.5 py-0.5 rounded font-mono caption-4">fonts.googleapis.com</code> or <code className="bg-surface-secondary text-content-primary px-1.5 py-0.5 rounded font-mono caption-4">fonts.gstatic.com</code>, and your IP address is never transmitted to Google (furthermore, the Platform embeds zero third-party Google resources such as Google Analytics, Google Maps, reCAPTCHA, or YouTube iframes).
              </p>
            </section>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-4">
              <h2 className="heading-5 text-content-primary">6. Third-Party Service Providers</h2>
              <p>
                We do not sell, rent, or trade your personal information. For core platform operations (outside of our cookie-free analytics and self-hosted fonts described in Section 5), we share operational data only with trusted service providers strictly necessary for delivering the Platform:
              </p>
              <ul className="space-y-2.5 pl-1">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span><strong className="text-content-primary font-medium">Payment Processors:</strong> Flutterwave and Paystack for billing facilitation and webhook transaction verification when you initiate a checkout.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span><strong className="text-content-primary font-medium">Exchange APIs:</strong> Bybit, Binance, and OKX APIs for dispatching user-authorized orders and position monitoring.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                  <span><strong className="text-content-primary font-medium">Cloud Hosting &amp; Transactional Infrastructure:</strong> Vercel (application hosting and cookie-free first-party web analytics), Supabase (encrypted database storage), and Resend (transactional account and waitlist emails), operating under strict data processing agreements.</span>
                </li>
              </ul>
            </section>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-4">
              <h2 className="heading-5 text-content-primary">7. Your Data Rights (NDPA 2023, GAID 2025 &amp; GDPR)</h2>
              <p>
                Under the Nigeria Data Protection Act (NDPA) 2023 and the General Application and Implementation Directive (GAID) 2025, as well as GDPR and applicable regional data protection laws,
                you have the right to request access to your data, rectify inaccuracies, request data erasure, or restrict processing.
                To exercise any of these rights, please contact our Data Protection Officer at{' '}
                <a href="mailto:tadex.team@gmail.com" className="text-brand-accent hover:underline">tadex.team@gmail.com</a>.
              </p>
            </section>

            <div className="h-px bg-surface-elevated" />

            <section className="space-y-3">
              <h2 className="heading-5 text-content-primary">8. Contact Us &amp; Operating Address</h2>
              <p>
                If you have any questions, concerns, or feedback regarding this Privacy Policy or our security practices,
                please contact us at:
              </p>
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