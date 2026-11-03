"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProviderHero from "@/components/providers/ProviderHero";
import ProviderTaglineReveal from "@/components/providers/ProviderTaglineReveal";
import ProviderProblem from "@/components/providers/ProviderProblem";
import ProviderBenefits from "@/components/providers/ProviderBenefits";
import ProviderHowItWorks from "@/components/providers/ProviderHowItWorks";
import ProviderPricingRevenue from "@/components/providers/ProviderPricingRevenue";
import ProviderFAQ from "@/components/providers/ProviderFAQ";
import ProviderFinalCTA from "@/components/providers/ProviderFinalCTA";
import ProviderFooter from "@/components/providers/ProviderFooter";
import ProviderLeadModal from "@/components/providers/ProviderLeadModal";
import TadexLogo from "@/components/ui/TadexLogo";

export default function ForProvidersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenModal = () => {
    setMobileMenuOpen(false);
    setIsModalOpen(true);
  };

  const navItems = [
    { label: "The Problem", id: "the-problem" },
    { label: "Benefits", id: "what-tadex-gives-you" },
    { label: "How It Works", id: "how-it-works" },
    { label: "Revenue Share", id: "pricing-revenue" },
    { label: "FAQ", id: "faq" },
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
          aria-label="Provider navigation"
          className="max-w-[1120px] mx-auto bg-surface-primary/90 backdrop-blur-md rounded-2xl px-4 sm:px-6 h-14 flex items-center justify-between"
        >
          {/* Logo + Provider Badge */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded-lg"
          >
            <TadexLogo size={32} />
            <span className="title-2 text-content-primary">Tadex</span>
            <span className="caption-5 text-brand-accent bg-surface-secondary px-2 py-0.5 rounded-md">
              For Providers
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="button-sm text-content-secondary hover:text-content-primary transition-colors duration-200 ease-weighted"
              >
                {item.label}
              </button>
            ))}

            <div className="h-4 w-px bg-surface-elevated" />

            {/* Dual CTAs & Auth Links */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="caption-3 text-content-muted hover:text-content-primary transition-colors duration-200 ease-weighted px-2 py-1"
              >
                Trader View
              </Link>
              <Link
                href="/login?redirect=/dashboard/provider"
                className="button-sm text-content-secondary hover:text-content-primary transition-colors duration-200 ease-weighted px-2 py-1.5"
              >
                Log In
              </Link>
              <button
                type="button"
                onClick={handleOpenModal}
                className="bg-brand-accent hover:bg-brand-accent-hover text-surface-canvas px-4 py-2 rounded-xl button-sm transition-all duration-200 ease-weighted hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Become a Provider
              </button>
            </div>
          </div>

          {/* Mobile Actions & Animated 3-Bar Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={handleOpenModal}
              className="bg-brand-accent hover:bg-brand-accent-hover text-surface-canvas px-3 py-1.5 rounded-lg button-xsm transition-colors duration-200 ease-weighted"
            >
              Become a Provider
            </button>
            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="w-9 h-9 rounded-lg bg-surface-secondary flex flex-col items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <span
                className={`block w-4 h-0.5 bg-content-primary transition-transform duration-300 ease-weighted ${
                  mobileMenuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block w-4 h-0.5 bg-content-primary transition-opacity duration-200 ease-weighted ${
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`block w-4 h-0.5 bg-content-primary transition-transform duration-300 ease-weighted ${
                  mobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </nav>

        {/* B7 Full-height Mobile Menu Panel */}
        <div
          className={`md:hidden fixed inset-x-4 top-20 bottom-4 bg-surface-primary rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ease-weighted ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="space-y-2">
            {navItems.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                style={{ transitionDelay: `${idx * 40}ms` }}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left py-3 px-4 rounded-xl heading-6 text-content-primary hover:bg-surface-secondary transition-all duration-300 ease-weighted ${
                  mobileMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              >
                {item.label}
              </button>
            ))}
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left py-3 px-4 rounded-xl body-3 text-content-secondary hover:bg-surface-secondary transition-colors duration-200 ease-weighted"
            >
              Trader View
            </Link>
          </div>

          <div className="space-y-3 pt-6">
            <div className="h-px bg-surface-elevated mb-4" />
            <Link
              href="/login?redirect=/dashboard/provider"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-3 rounded-xl bg-surface-secondary text-content-primary button-md"
            >
              Log In
            </Link>
            <button
              type="button"
              onClick={handleOpenModal}
              className="block w-full text-center py-3 rounded-xl bg-brand-accent text-surface-canvas button-md"
            >
              Become a Provider
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main" className="relative">
        {/* Section 1: Hero */}
        <ProviderHero onOpenModal={handleOpenModal} />

        {/* B11 Mandatory Word-by-Word Scroll Reveal Section */}
        <ProviderTaglineReveal />

        {/* Section 2: The Problem */}
        <ProviderProblem />

        {/* Section 3: What Tadex Gives You */}
        <ProviderBenefits />

        {/* Section 4: How It Works */}
        <ProviderHowItWorks onOpenModal={handleOpenModal} />

        {/* Section 5: Pricing & Revenue */}
        <ProviderPricingRevenue onOpenModal={handleOpenModal} />

        {/* Section 6: FAQ */}
        <ProviderFAQ />

        {/* Section 7: Final CTA */}
        <ProviderFinalCTA onOpenModal={handleOpenModal} />
      </main>

      {/* Footer */}
      <ProviderFooter />

      {/* Provider Lead / Talk to Team Modal */}
      <ProviderLeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
