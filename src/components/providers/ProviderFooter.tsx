'use client';

import Link from 'next/link';

export default function ProviderFooter() {
  const footerLinks = {
    product: [
      { name: 'How it Works', href: '#how-it-works' },
      { name: 'Features', href: '#what-tadex-gives-you' },
      { name: 'Pricing', href: '#pricing-revenue' },
      { name: 'FAQ', href: '#faq' },
    ],
    company: [
      { name: 'About', href: '#' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Security', href: '/security' },
    ],
  };

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Left Column: Brand & One-Liner */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#004859] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                T
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Tadex for Providers</span>
            </div>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Automate billing, access, and execution for your signal community.
            </p>
            <div className="text-xs text-slate-500 pt-1">
              Location: Lagos, Nigeria
            </div>
          </div>

          {/* Center Column: Product Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.product.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="hover:text-[#00B894] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Company & Legal Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Company & Legal
            </h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.company.map((link, idx) => (
                <li key={idx}>
                  <Link
                    href={link.href}
                    className="hover:text-[#00B894] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Voreza Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00B894] animate-pulse"></span>
            <span className="text-slate-400 font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
