"use client";

import { useState } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import WhatTadexDoes from "@/components/WhatTadexDoes";
import HowItWorks from "@/components/HowItWorks";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import WaitlistModal from "@/components/WaitlistModal";
import PlanWaitlistModal from "@/components/PlanWaitlistModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWaitlistModal = () => {
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
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#00B894]/20 selection:text-[#004859]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <div className="w-8 h-8 bg-[#004859] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                T
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Tadex</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-7">
              <button
                onClick={() => scrollToSection('what-tadex-does')}
                className="text-sm font-medium text-slate-300 hover:text-[#00B894] transition-colors"
              >
                What Tadex Does
              </button>
              <button
                onClick={() => scrollToSection('how-it-works')}
                className="text-sm font-medium text-slate-300 hover:text-[#00B894] transition-colors"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollToSection('who-this-is-for')}
                className="text-sm font-medium text-slate-300 hover:text-[#00B894] transition-colors"
              >
                Who This Is For
              </button>
              <button
                onClick={() => scrollToSection('pricing')}
                className="text-sm font-medium text-slate-300 hover:text-[#00B894] transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-sm font-medium text-slate-300 hover:text-[#00B894] transition-colors"
              >
                FAQ
              </button>

              {/* Dual CTAs & Auth Links */}
              <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-2 py-1.5"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium text-[#00B894] hover:text-white transition-colors border border-[#00B894]/40 hover:border-[#00B894] px-4 py-1.5 rounded-full"
                >
                  Register
                </Link>
                <button
                  onClick={openWaitlistModal}
                  className="bg-[#00B894] hover:bg-[#00A085] text-slate-950 px-4 py-1.5 rounded-full transition-all font-bold text-sm shadow-md hover:shadow-lg transform hover:scale-105 duration-200"
                >
                  Join Waitlist
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs font-medium text-slate-300 px-2 py-1"
              >
                Log In
              </Link>
              <button
                onClick={openWaitlistModal}
                className="bg-[#00B894] text-slate-950 px-3 py-1.5 rounded-full hover:bg-[#00A085] transition-colors font-bold text-xs shadow-md"
              >
                Waitlist
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 7 Core Page Sections */}
      <main className="relative">
        {/* Section 1: Hero */}
        <Hero />

        {/* Section 2: What Tadex Does */}
        <WhatTadexDoes />

        {/* Section 3: How It Works */}
        <HowItWorks />

        {/* Section 4: Who This Is For */}
        <WhoThisIsFor />

        {/* Section 5: Pricing */}
        <Pricing onPlanSelect={handlePlanSelect} />

        {/* Section 6: FAQ */}
        <FAQ />

        {/* Section 7: Final CTA */}
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