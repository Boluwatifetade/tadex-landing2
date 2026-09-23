import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Hero from "@/components/Hero";
import WhatTadexDoes from "@/components/WhatTadexDoes";
import HowItWorks from "@/components/HowItWorks";
import WhoThisIsFor from "@/components/WhoThisIsFor";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

describe("Landing Page 7 Sections", () => {
  it("renders Hero with headline, subhead, CTAs, trust line, and terminal visual", () => {
    render(<Hero />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Automate Your Trading Signals\. No More Manual Copying\./i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Connect your Telegram groups and exchanges/i)
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Start Free/i })).toBeInTheDocument();
    expect(screen.getByText(/No credit card required/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Watch 2‑min Demo/i })).toBeInTheDocument();
    expect(screen.getByText(/99\.9% uptime/i)).toBeInTheDocument();
    expect(screen.getByText(/2,000\+ users/i)).toBeInTheDocument();

    // Terminal mock assertions
    expect(screen.getByText(/tadex-execution-node v2\.4/i)).toBeInTheDocument();
    expect(screen.getByText(/FILLED @ \$68,402/i)).toBeInTheDocument();
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

  it("renders WhoThisIsFor with 3 user profiles", () => {
    render(<WhoThisIsFor />);

    expect(screen.getByText("Built for Traders, Not Engineers")).toBeInTheDocument();
    expect(screen.getByText("Signal Followers")).toBeInTheDocument();
    expect(screen.getByText("Signal Providers")).toBeInTheDocument();
    expect(screen.getByText("Busy Traders & Prop Traders")).toBeInTheDocument();
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

  it("renders FAQ with 7 questions and toggles answers", () => {
    render(<FAQ />);

    expect(screen.getByText("Frequently Asked Questions")).toBeInTheDocument();
    expect(screen.getByText("Do I need to install anything?")).toBeInTheDocument();
    expect(screen.getByText("Is it really free to start?")).toBeInTheDocument();
    expect(screen.getByText("Which exchanges work with Tadex?")).toBeInTheDocument();
    expect(screen.getByText("Is my money safe? What about my API keys?")).toBeInTheDocument();
    expect(screen.getByText("I’m new to trading. Is this suitable for beginners?")).toBeInTheDocument();
    expect(screen.getByText("Can I cancel anytime?")).toBeInTheDocument();
    expect(screen.getByText("Does Tadex give trading advice or signals?")).toBeInTheDocument();

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

  it("renders Footer with required links, location Lagos, Nigeria, and no developer tagline", () => {
    render(<Footer />);

    expect(
      screen.getByText("Automate trading signals and webhook workflows without manual work.")
    ).toBeInTheDocument();
    expect(screen.getByText(/Lagos, Nigeria/i)).toBeInTheDocument();
    expect(screen.getByText(/© 2026 Voreza Technologies\. All rights reserved\./i)).toBeInTheDocument();
    expect(screen.getByText("All systems operational")).toBeInTheDocument();

    // Assert developer tagline is removed
    expect(screen.queryByText(/Made with ❤️ for developers/i)).not.toBeInTheDocument();
  });
});
