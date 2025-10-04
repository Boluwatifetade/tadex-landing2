"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import WhyAutomated from "@/components/WhyAutomated";
import HowItWorks from "@/components/HowItWorks";
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
  const router = useRouter();

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
    // Reset selectedPlan after modal animation completes
    setTimeout(() => {
      setSelectedPlan('');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div 
                className="text-2xl font-bold text-[#004859] cursor-pointer" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Tadex
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-slate-700 hover:text-[#004859] transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-slate-700 hover:text-[#004859] transition-colors"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-slate-700 hover:text-[#004859] transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => router.push('/security')}
                className="text-slate-700 hover:text-[#004859] transition-colors flex items-center gap-1"
              >
                <span>Security</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">NEW</span>
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="text-slate-700 hover:text-[#004859] transition-colors"
              >
                FAQ
              </button>
              <button 
                onClick={openWaitlistModal}
                className="bg-[#004859] text-white px-6 py-2 rounded-lg hover:bg-[#00323B] transition-colors font-medium shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
              >
                Join Waitlist
              </button>
            </div>

            {/* Mobile Menu */}
            <div className="md:hidden flex items-center gap-3">
              <button 
                onClick={() => router.push('/security')}
                className="text-[#004859] text-sm font-medium"
              >
                Security
              </button>
              <button 
                onClick={openWaitlistModal}
                className="bg-[#004859] text-white px-4 py-2 rounded-lg hover:bg-[#00323B] transition-colors font-medium text-sm"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        <Hero />
        <div id="features">
          <Features />
        </div>
        <WhyAutomated />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="pricing">
          <Pricing onPlanSelect={handlePlanSelect} />
        </div>
        <div id="faq">
          <FAQ />
        </div>
        <FinalCTA />
        <Footer />
      </main>

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