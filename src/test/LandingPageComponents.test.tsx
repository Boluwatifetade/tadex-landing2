import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Hero from "@/components/Hero";
import TaglineReveal from "@/components/TaglineReveal";
import WhatTadexDoes from "@/components/WhatTadexDoes";
import HowItWorks from "@/components/HowItWorks";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import WaitlistModal from "@/components/WaitlistModal";
import PlanWaitlistModal from "@/components/PlanWaitlistModal";
import Home from "@/app/page";

describe("Landing Page Revamp (ai-design-skills)", () => {
  it("renders Hero with gradient headline, subhead, CTAs, trust line, and flat terminal visual", () => {
    render(<Hero />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: /Automate Your Trading Signals\. No More Manual Copying\./i,
    });
    expect(heading).toBeInTheDocument();
    expect(heading.className).toContain("hero-heading-gradient");
    expect(heading.className).toContain("max-w-[680px]");

    expect(
      screen.getByText(/Connect your Telegram groups and exchanges/i)
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Start Free/i })).toBeInTheDocument();
    expect(screen.getByText(/No credit card required/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Watch 2‑min Demo/i })).toBeInTheDocument();
    expect(screen.getByText(/99\.9% uptime/i)).toBeInTheDocument();
    expect(screen.getByText(/2,000\+ users/i)).toBeInTheDocument();

    // Terminal mock assertions (default BTC/USDT live price + interactive tab switching + sample/illustrative label)
    expect(screen.getByText(/tadex-execution-node v2\.4/i)).toBeInTheDocument();
    expect(screen.getByText(/FILLED @ \$77,852/i)).toBeInTheDocument();
    expect(screen.getByText(/Sample illustrative execution/i)).toBeInTheDocument();

    const ethTab = screen.getByRole("tab", { name: "ETH/USDT" });
    fireEvent.click(ethTab);
    expect(screen.getByText(/FILLED @ \$2,263/i)).toBeInTheDocument();
    expect(screen.getByText("Binance Futures")).toBeInTheDocument();
  });

  it("renders mandatory B11 TaglineReveal section with word-by-word spans", () => {
    render(<TaglineReveal />);

    expect(screen.getAllByText("Every", { selector: "span" })).toHaveLength(2);
    expect(screen.getByText("milliseconds.")).toBeInTheDocument();
    expect(screen.getByText("exchange.")).toBeInTheDocument();
  });

  it("renders WhatTadexDoes with 3 benefit cards", () => {
    render(<WhatTadexDoes />);

    expect(screen.getByText("What You Get With Tadex")).toBeInTheDocument();
    expect(screen.getByText("Never Miss a Trade")).toBeInTheDocument();
    expect(screen.getByText("Remove Human Error")).toBeInTheDocument();
    expect(screen.getByText("Run Like a Pro Operation")).toBeInTheDocument();
  });

  it("renders HowItWorks with 4 simple steps and CTA", () => {
    render(<HowItWorks />);

    expect(screen.getByText("Set Up in Minutes, Not Days")).toBeInTheDocument();
    expect(screen.getByText("Create Your Account")).toBeInTheDocument();
    expect(screen.getByText("Connect Your Accounts")).toBeInTheDocument();
    expect(screen.getByText("Set Your Rules")).toBeInTheDocument();
    expect(screen.getByText("Let Tadex Handle the Rest")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Start Free/i })).toBeInTheDocument();
  });

  it("renders WhoThisIsFor with 3 user profiles, no prop firm claims, and no banned filler words", () => {
    render(<WhoThisIsFor />);

    expect(screen.getByText("Built for Traders, Not Engineers")).toBeInTheDocument();
    expect(screen.getByText("Signal Followers")).toBeInTheDocument();
    expect(screen.getByText("Signal Providers")).toBeInTheDocument();
    expect(screen.getByText("Busy & Multi-Account Traders")).toBeInTheDocument();
    expect(screen.queryByText(/prop firm/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/effortless/i)).not.toBeInTheDocument();
  });

  it("renders Pricing in Naira with 3 plans and explainer", () => {
    const onPlanSelect = vi.fn();
    render(<Pricing onPlanSelect={onPlanSelect} />);

    expect(screen.getByText("Simple, Transparent Pricing")).toBeInTheDocument();

    // Free tier
    expect(screen.getByText("₦0")).toBeInTheDocument();
    expect(screen.getAllByText(/12 automated trades/i).length).toBeGreaterThan(0);

    // Tadex Premium
    expect(screen.getByText("₦5,000")).toBeInTheDocument();
    expect(screen.getByText("₦10,000")).toBeInTheDocument();
    expect(screen.getByText("Most Popular")).toBeInTheDocument();

    // Signal Providers
    expect(screen.getByText("For Signal Providers")).toBeInTheDocument();
    expect(screen.getByText(/Turn Your Signals Into a Business/i)).toBeInTheDocument();

    // Explainer
    expect(screen.getByText("How Tadex Pricing Works")).toBeInTheDocument();

    // CTA interaction
    const getPremiumBtn = screen.getByRole("button", { name: "Get Premium" });
    fireEvent.click(getPremiumBtn);
    expect(onPlanSelect).toHaveBeenCalledWith("premium");
  });

  it("renders FAQ with 7 questions, JSON-LD schema, and toggles answers", () => {
    const { container } = render(<FAQ />);

    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
    expect(screen.getByText("Do I need to install anything?")).toBeInTheDocument();
    expect(screen.getByText("Is it really free to start?")).toBeInTheDocument();
    expect(screen.getByText("Which exchanges work with Tadex?")).toBeInTheDocument();
    expect(screen.getByText("Is my money safe? What about my API keys?")).toBeInTheDocument();
    expect(screen.getByText("I’m new to trading. Is this suitable for beginners?")).toBeInTheDocument();
    expect(screen.getByText("Can I cancel anytime?")).toBeInTheDocument();
    expect(screen.getByText("Does Tadex give trading advice or signals?")).toBeInTheDocument();

    // JSON-LD FAQPage schema check (A7)
    const ldJson = container.querySelector('script[type="application/ld+json"]');
    expect(ldJson).not.toBeNull();
    expect(ldJson?.textContent).toContain("FAQPage");

    // Toggle 2nd question
    const q2Btn = screen.getByText("Is it really free to start?");
    fireEvent.click(q2Btn);
    expect(screen.getByText(/up to 12 automated trades per month/i)).toBeInTheDocument();
  });

  it("renders FinalCTA with headline, CTA, and trust line", () => {
    render(<FinalCTA />);

    expect(
      screen.getByText("Ready to Stop Copying Trades Manually?")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Start Free/i })).toBeInTheDocument();
    expect(screen.getByText("Secure API handling")).toBeInTheDocument();
  });

  it("renders Footer with required links, location Lagos, Nigeria, no dead # links, and no developer tagline", () => {
    const { container } = render(<Footer />);

    expect(
      screen.getByText("Automate trading signals and webhook workflows without manual work.")
    ).toBeInTheDocument();
    expect(screen.getByText(/Lagos, Nigeria/i)).toBeInTheDocument();
    expect(screen.getByText(/© 2026 Voreza Technologies\. All rights reserved\./i)).toBeInTheDocument();
    expect(screen.getByText("All systems operational")).toBeInTheDocument();

    // Assert no dead href="#" links in footer (B9)
    const deadLinks = container.querySelectorAll('a[href="#"]');
    expect(deadLinks.length).toBe(0);

    // Assert developer tagline is removed
    expect(screen.queryByText(/Made with ❤️ for developers/i)).not.toBeInTheDocument();
  });

  it("renders WaitlistModal and PlanWaitlistModal with dark surface styling and Naira pricing", () => {
    const onClose = vi.fn();
    render(<WaitlistModal isOpen={true} onClose={onClose} />);
    expect(screen.getByText("Join the Waitlist")).toBeInTheDocument();

    render(<PlanWaitlistModal isOpen={true} onClose={onClose} selectedPlan="free" />);
    expect(screen.getByText("Free Tier")).toBeInTheDocument();
    expect(screen.getByText("₦0 / forever")).toBeInTheDocument();

    render(<PlanWaitlistModal isOpen={true} onClose={onClose} selectedPlan="premium" />);
    expect(screen.getByText("Start with Tadex Premium")).toBeInTheDocument();
    expect(screen.getByText("₦5,000 / month")).toBeInTheDocument();
  });

  it("renders Home page with skip-to-content link and floating navigation", () => {
    render(<Home />);

    expect(screen.getByText("Skip to content")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /Primary navigation/i })).toBeInTheDocument();
  });
});
