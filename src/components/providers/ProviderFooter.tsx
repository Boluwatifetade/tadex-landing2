'use client';

import Link from 'next/link';
import TadexLogo from '@/components/ui/TadexLogo';

export default function ProviderFooter() {
  const footerLinks = {
    product: [
      { name: 'How it Works', href: '#how-it-works' },
      { name: 'Features', href: '#what-tadex-gives-you' },
      { name: 'Pricing', href: '#pricing-revenue' },
      { name: 'FAQ', href: '#faq' },
    ],
    company: [
      { name: 'Trader Platform', href: '/' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Security', href: '/security' },
    ],
  };

  return (
    <footer className="bg-surface-primary text-content-secondary">
      {/* Top 1px flat horizontal line instead of border-t */}
      <div className="h-px bg-surface-elevated" />

      <div className="max-w-[1280px] mx-auto px-6 md:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Left Column: Brand & One-Liner */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <TadexLogo size={32} />
              <span className="title-1 text-content-primary">Tadex for Providers</span>
            </div>
            <p className="body-6 text-content-secondary max-w-sm">
              Automate billing, access, and execution for your signal community.
            </p>
            <div className="caption-4 text-content-muted pt-1">
              Location: Lagos, Nigeria
            </div>
          </div>

          {/* Center Column: Product Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="caption-3 text-content-primary uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="body-6 text-content-secondary hover:text-content-primary transition-colors duration-200 ease-weighted"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Company & Legal Links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="caption-3 text-content-primary uppercase tracking-wider">
              Company & Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="body-6 text-content-secondary hover:text-content-primary transition-colors duration-200 ease-weighted"
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 caption-4 text-content-muted">
          <div>
            © 2026 Voreza Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-accent" />
            <span className="text-content-secondary caption-3">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
