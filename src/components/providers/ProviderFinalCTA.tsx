'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  ArrowRightIcon,
  CreditCardIcon,
  DashboardIcon,
  CoinsIcon,
} from '@/components/ui/PhosphorIcons';

interface ProviderFinalCTAProps {
  onOpenModal: () => void;
}

export default function ProviderFinalCTA({ onOpenModal }: ProviderFinalCTAProps) {
  return (
    <section className="relative bg-surface-canvas text-content-primary py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="bg-surface-primary border border-surface-elevated rounded-2xl p-8 sm:p-12 lg:p-16">
            <div className="max-w-[680px]">
              {/* Headline */}
              <h2 className="heading-2 text-content-primary mb-4">
                Ready to Professionalize Your Signal Business?
              </h2>

              {/* Subheadline */}
              <p className="title-1 text-content-secondary mb-8">
                Join providers who use Tadex to automate billing, access, and execution so they can focus on trading and growth.
              </p>

              {/* Primary CTA Button */}
              <div className="flex flex-col items-start mb-8">
                <button
                  type="button"
                  onClick={onOpenModal}
                  className="inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-lg px-8 py-4 rounded-xl transition-[background-color,transform] duration-300 ease-weighted hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                >
                  <span>Become a Provider</span>
                  <ArrowRightIcon size={20} />
                </button>
                <span className="caption-3 text-brand-accent mt-2">
                  Talk to our team
                </span>
              </div>

              <div className="h-px bg-surface-elevated mb-6" />

              {/* Trust Line */}
              <div className="flex flex-wrap items-center gap-6 caption-1 text-content-tertiary">
                <div className="flex items-center gap-2">
                  <CreditCardIcon size={16} className="text-brand-accent" />
                  <span>Automated billing</span>
                </div>
                <div className="flex items-center gap-2">
                  <DashboardIcon size={16} className="text-brand-accent" />
                  <span>Revenue dashboard</span>
                </div>
                <div className="flex items-center gap-2">
                  <CoinsIcon size={16} className="text-brand-accent" />
                  <span>Multi-currency support</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
