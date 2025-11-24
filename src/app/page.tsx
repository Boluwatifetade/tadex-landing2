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
import ComparisonTable from "@/components/ComparisonTable";
import Roadmap from "@/components/Roadmap";
import SecurityTransparency from "@/components/SecurityTransparency";

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
    setTimeout(() => {
      setSelectedPlan('');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans text-slate-900">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-8 h-8 bg-[#004859] rounded-lg flex items-center justify-center text-white font-bold">T</div>
              <span className="text-xl font-bold text-[#004859]">Tadex</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('how-it-works')} 
                className="text-sm font-medium text-slate-600 hover:text-[#004859] transition-colors"
              >
                How it Works
              </button>
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-sm font-medium text-slate-600 hover:text-[#004859] transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="text-sm font-medium text-slate-600 hover:text-[#004859] transition-colors"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('security')} 
                className="text-sm font-medium text-slate-600 hover:text-[#004859] transition-colors flex items-center gap-1"
              >
                <span>Security</span>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">NEW</span>
              </button>
              <button 
                onClick={() => scrollToSection('faq')} 
                className="text-sm font-medium text-slate-600 hover:text-[#004859] transition-colors"
              >
                FAQ
              </button>
              
              {/* Dual CTAs */}
              <div className="flex items-center gap-3">
                <a 
                  href="https://t.me/TradeSwiftNowBot" 
                  target="_blank"
                  className="bg-[#00B894] text-white px-5 py-2 rounded-full hover:bg-[#00A085] transition-colors font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105 duration-300"
                >
                  Launch Bot
                </a>
                <button 
                  onClick={openWaitlistModal}
                  className="border border-[#004859] text-[#004859] px-5 py-2 rounded-full hover:bg-[#004859] hover:text-white transition-all font-medium text-sm"
                >
                  Join Waitlist
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center gap-3">
              <a 
                href="https://t.me/TradeSwiftNowBot" 
                target="_blank"
                className="bg-[#00B894] text-white px-4 py-2 rounded-full hover:bg-[#00A085] transition-colors font-medium text-sm shadow-md"
              >
                Launch
              </a>
              <button 
                onClick={openWaitlistModal}
                className="border border-[#004859] text-[#004859] px-3 py-2 rounded-full hover:bg-[#004859] hover:text-white transition-all font-medium text-sm"
              >
                Waitlist
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        <Hero />
        <div id="how-it-works">
          <HowItWorks />
        </div>
        <div id="features">
          <Features />
        </div>
        <WhyAutomated />
        <ComparisonTable />
        <Roadmap />
        <div id="security">
          <SecurityTransparency />
        </div>
        <div id="pricing">
          <Pricing onPlanSelect={handlePlanSelect} />
        </div>
        <div id="faq">
          <FAQ />
        </div>
        <FinalCTA />
      </main>

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