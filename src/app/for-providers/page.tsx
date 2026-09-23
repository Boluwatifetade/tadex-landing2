"use client";

import { useState } from "react";
import Link from "next/link";
import ProviderHero from "@/components/providers/ProviderHero";
import ProviderProblem from "@/components/providers/ProviderProblem";
import ProviderBenefits from "@/components/providers/ProviderBenefits";
import ProviderHowItWorks from "@/components/providers/ProviderHowItWorks";
import ProviderPricingRevenue from "@/components/providers/ProviderPricingRevenue";
import ProviderFAQ from "@/components/providers/ProviderFAQ";
import ProviderFinalCTA from "@/components/providers/ProviderFinalCTA";
import ProviderFooter from "@/components/providers/ProviderFooter";
import ProviderLeadModal from "@/components/providers/ProviderLeadModal";

export default function ForProvidersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#00B894]/20 selection:text-[#004859]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Provider Badge */}
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <div className="w-8 h-8 bg-[#004859] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                T
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Tadex</span>
              <span className="text-[11px] font-semibold text-[#00B894] bg-[#00B894]/15 px-2 py-0.5 rounded border border-[#00B894]/30">
                For Providers
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-7">
              <button
                onClick={() => scrollToSection("the-problem")}
                className="text-sm font-medium text-slate-300 hover:text-[#00B894] transition-colors"
              >
                The Problem
              </button>
              <button
                onClick={() => scrollToSection("what-tadex-gives-you")}
                className="text-sm font-medium text-slate-300 hover:text-[#00B894] transition-colors"
              >
                Benefits
              </button>
              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-sm font-medium text-slate-300 hover:text-[#00B894] transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => scrollToSection("pricing-revenue")}
                className="text-sm font-medium text-slate-300 hover:text-[#00B894] transition-colors"
              >
                Revenue Share
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-sm font-medium text-slate-300 hover:text-[#00B894] transition-colors"
              >
                FAQ
              </button>

              {/* Dual CTAs & Auth Links */}
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <Link
                  href="/login?redirect=/dashboard/provider"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 py-1.5"
                >
                  Log In
                </Link>
                <Link
                  href="/"
                  className="text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors px-2 py-1"
                >
                  Trader View
                </Link>
                <button
                  onClick={handleOpenModal}
                  className="bg-[#00B894] hover:bg-[#00A085] text-slate-950 px-4 py-1.5 rounded-full transition-all font-bold text-sm shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
                >
                  Become a Provider
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2">
              <Link
                href="/login?redirect=/dashboard/provider"
                className="text-xs font-medium text-slate-300 px-2 py-1"
              >
                Log In
              </Link>
              <button
                onClick={handleOpenModal}
                className="bg-[#00B894] text-slate-950 px-3 py-1.5 rounded-full hover:bg-[#00A085] transition-colors font-bold text-xs shadow-md"
              >
                Become a Provider
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 7 Provider Page Sections */}
      <main className="relative">
        {/* Section 1: Hero */}
        <ProviderHero onOpenModal={handleOpenModal} />

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
