'use client';

import { useState } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import TaglineReveal from '@/components/TaglineReveal';
import WhatTadexDoes from '@/components/WhatTadexDoes';
import HowItWorks from '@/components/HowItWorks';
import WhoThisIsFor from '@/components/WhoThisIsFor';
import Pricing from '@/components/Pricing';
import FAQ from '@/components/FAQ';
import FinalCTA from '@/components/FinalCTA';
import Footer from '@/components/Footer';
import WaitlistModal from '@/components/WaitlistModal';
import PlanWaitlistModal from '@/components/PlanWaitlistModal';
import TadexLogo from '@/components/ui/TadexLogo';

const NAV_ITEMS = [
  { id: 'what-tadex-does', label: 'Benefits' },
  { id: 'how-it-works', label: 'How it Works' },
  { id: 'who-this-is-for', label: 'Audience' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'faq', label: 'FAQ' },
];

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [activeSection, setActiveSection] = useState<string>('what-tadex-does');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWaitlistModal = () => {
    setMobileMenuOpen(false);
    setIsModalOpen(true);
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setIsPlanModalOpen(true);
  };

  const closePlanModal = () => {
    setIsPlanModalOpen(false);
    setTimeout(() => {
      setSelectedPlan('');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-surface-canvas font-sans text-content-primary">
      {/* B10: Skip to content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:bg-brand-accent focus:text-content-inverted focus:px-4 focus:py-2 focus:rounded-lg button-sm"
      >
        Skip to content
      </a>

      {/* B7: Compact Floating Navigation Bar off top edge, centered and sized to content */}
      <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav
          aria-label="Primary navigation"
          className="pointer-events-auto flex items-center justify-between md:justify-start gap-6 w-full max-w-5xl md:w-auto bg-surface-primary/85 backdrop-blur-md border border-surface-elevated rounded-2xl px-4 py-2"
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-lg"
          >
            <TadexLogo size={32} />
            <span className="title-2 text-content-primary">Tadex</span>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isCurrent = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  aria-current={isCurrent ? 'location' : undefined}
                  className={`title-4 px-3 py-2 rounded-lg transition-colors duration-300 ease-weighted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                    isCurrent
                      ? 'text-content-primary bg-surface-secondary'
                      : 'text-content-secondary hover:text-content-primary hover:bg-surface-subtle'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2 pl-2">
            <Link
              href="/login"
              className="title-4 text-content-secondary hover:text-content-primary px-3 py-2 rounded-lg transition-colors duration-300 ease-weighted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="button-sm text-brand-accent hover:bg-brand-accentSubtle border border-brand-accent/40 px-3 py-2 rounded-lg transition-colors duration-300 ease-weighted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              Register
            </Link>
            <button
              type="button"
              onClick={openWaitlistModal}
              className="bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-sm px-3 py-2 rounded-lg transition-[background-color,transform] duration-300 ease-weighted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              Join waitlist
            </button>
          </div>

          {/* Mobile Controls + Animated Toggle Icon (B7) */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={openWaitlistModal}
              className="bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-xsm px-3 py-2 rounded-lg transition-colors duration-300 ease-weighted active:scale-[0.98]"
            >
              Waitlist
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-surface-subtle border border-surface-elevated text-content-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <span className="relative w-5 h-4 block">
                <span
                  className={`absolute left-0 w-5 h-0.5 bg-content-primary transition-transform duration-500 ease-weighted ${
                    mobileMenuOpen ? 'top-2 rotate-45' : 'top-0.5 rotate-0'
                  }`}
                />
                <span
                  className={`absolute left-0 top-2 w-5 h-0.5 bg-content-primary transition-opacity duration-300 ease-weighted ${
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`absolute left-0 w-5 h-0.5 bg-content-primary transition-transform duration-500 ease-weighted ${
                    mobileMenuOpen ? 'top-2 -rotate-45' : 'top-3.5 rotate-0'
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* B7: Full-Height Mobile Menu Panel with Staggered Link Entrance (60ms steps, 24px rise) */}
      <div
        aria-hidden={!mobileMenuOpen}
        className={`fixed inset-0 z-40 md:hidden bg-surface-canvas/95 backdrop-blur-xl transition-opacity duration-500 ease-weighted ${
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col justify-between h-full pt-24 pb-10 px-6">
          <div className="space-y-4">
            {NAV_ITEMS.map((item, idx) => {
              const delayMs = Math.min(idx * 60, 400);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  style={{ transitionDelay: mobileMenuOpen ? `${delayMs}ms` : '0ms' }}
                  className={`block w-full text-left heading-4 text-content-primary py-2 transition-[transform,opacity] duration-500 ease-weighted motion-reduce:transition-none ${
                    mobileMenuOpen
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-6'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="space-y-3 pt-6">
            <div className="h-px bg-surface-elevated mb-4" />
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center bg-surface-primary border border-surface-elevated text-content-primary button-md py-3 rounded-xl"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center bg-brand-accent text-content-inverted button-md py-3 rounded-xl"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main id="main-content" className="relative">
        {/* Section 1: Hero */}
        <Hero />

        {/* Section 2: Mandatory B11 Tagline Reveal */}
        <TaglineReveal />

        {/* Section 3: What Tadex Does */}
        <WhatTadexDoes />

        {/* Section 4: How It Works */}
        <HowItWorks />

        {/* Section 5: Who This Is For */}
        <WhoThisIsFor />

        {/* Section 6: Pricing */}
        <Pricing onPlanSelect={handlePlanSelect} />

        {/* Section 7: FAQ */}
        <FAQ />

        {/* Section 8: Final CTA */}
        <FinalCTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* General Waitlist Modal */}
      <WaitlistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Plan-Specific Waitlist Modal */}
      <PlanWaitlistModal
        isOpen={isPlanModalOpen}
        onClose={closePlanModal}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}