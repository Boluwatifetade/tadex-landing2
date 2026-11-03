'use client';

import Link from 'next/link';
import TadexLogo from '@/components/ui/TadexLogo';

export default function Footer() {
  const footerLinks = {
    product: [
      { name: 'How it Works', href: '#how-it-works' },
      { name: 'Features', href: '#what-tadex-does' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'FAQ', href: '#faq' },
    ],
    company: [
      { name: 'For Signal Providers', href: '/for-providers' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Security', href: '/security' },
    ],
  };

  return (
    <footer className="bg-surface-primary text-content-tertiary">
      <div className="h-px bg-surface-elevated" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Left Column: Brand & One-Liner */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <TadexLogo size={32} />
              <span className="title-1 text-content-primary">Tadex</span>
            </div>
            <p className="body-6 text-content-secondary max-w-sm">
              Automate trading signals and webhook workflows without manual work.
            </p>
            <div className="caption-4 text-content-tertiary pt-1">
              Location: Lagos, Nigeria
            </div>
          </div>

          {/* Center Column: Product Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="caption-3 text-content-primary">Product</h4>
            <ul className="space-y-2.5 body-6">
              {footerLinks.product.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-content-secondary hover:text-brand-accent transition-colors duration-300 ease-weighted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Company & Legal Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="caption-3 text-content-primary">Company & Legal</h4>
            <ul className="space-y-2.5 body-6">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="text-content-secondary hover:text-brand-accent transition-colors duration-300 ease-weighted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="h-px bg-surface-elevated mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 caption-4 text-content-tertiary">
          <div>© 2026 Voreza Technologies. All rights reserved.</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-accent" />
            <span className="text-content-secondary caption-4">
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
