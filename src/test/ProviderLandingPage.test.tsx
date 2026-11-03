import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProviderHero from "@/components/providers/ProviderHero";
import ProviderProblem from "@/components/providers/ProviderProblem";
import ProviderBenefits from "@/components/providers/ProviderBenefits";
import ProviderHowItWorks from "@/components/providers/ProviderHowItWorks";
import ProviderPricingRevenue from "@/components/providers/ProviderPricingRevenue";
import ProviderFAQ from "@/components/providers/ProviderFAQ";
import ProviderFinalCTA from "@/components/providers/ProviderFinalCTA";
import ProviderFooter from "@/components/providers/ProviderFooter";
import ProviderLeadModal from "@/components/providers/ProviderLeadModal";
import ProviderTaglineReveal from "@/components/providers/ProviderTaglineReveal";
import ForProvidersPage from "@/app/for-providers/page";

describe("Tadex for Signal Providers Landing Page", () => {
  it("renders ProviderHero with headline, subhead, CTA, and dashboard mock metrics", () => {
    const onOpenModal = vi.fn();
    render(<ProviderHero onOpenModal={onOpenModal} />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Turn Your Signal Group Into a Real Business",
    });
    expect(heading).toBeInTheDocument();
    expect(heading.className).toContain("hero-heading-gradient");
    expect(heading.className).toContain("max-w-[680px]");

    expect(
      screen.getByText(/Tadex handles billing, access control, and automated execution for your members/i)
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /Become a Provider/i })).toBeInTheDocument();
    expect(screen.getByText("Talk to our team")).toBeInTheDocument();
    expect(
      screen.getByText("Launch support • Revenue dashboard • Automated subscriber management")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Used by signal providers across Nigeria, Kenya, Ghana, and beyond/i)
    ).toBeInTheDocument();

    // Dashboard Mock assertions
    expect(screen.getByText("Active Plans")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Monthly Revenue")).toBeInTheDocument();
    expect(screen.getByText("₦1,250,000")).toBeInTheDocument();
    expect(screen.getAllByText("@AlphaSignals VIP").length).toBeGreaterThan(0);

    // Interaction
    const btn = screen.getByRole("button", { name: /Become a Provider/i });
    fireEvent.click(btn);
    expect(onOpenModal).toHaveBeenCalledTimes(1);
  });

  it("renders mandatory B11 ProviderTaglineReveal section with word-by-word spans", () => {
    render(<ProviderTaglineReveal />);

    expect(screen.getAllByText("every", { selector: "span" })).toHaveLength(2);
    expect(screen.getByText("Telegram.")).toBeInTheDocument();
    expect(screen.getByText("exchanges.")).toBeInTheDocument();
  });

  it("renders ProviderProblem with 3 manual pain point cards", () => {
    render(<ProviderProblem />);

    expect(screen.getByText("Running a VIP Group Manually Is a Full-Time Job")).toBeInTheDocument();
    expect(
      screen.getByText("If you’re managing payments, access, and support by hand, you’re leaving money and time on the table.")
    ).toBeInTheDocument();

    expect(screen.getByText("Payment & Access Chaos")).toBeInTheDocument();
    expect(screen.getByText("Leaked Links & Free Riders")).toBeInTheDocument();
    expect(screen.getByText("No Automation, No Scale")).toBeInTheDocument();
  });

  it("renders ProviderBenefits with 4 benefit cards", () => {
    render(<ProviderBenefits />);

    expect(screen.getByText("What You Get as a Tadex Provider")).toBeInTheDocument();
    expect(screen.getByText("Automated Billing & Access")).toBeInTheDocument();
    expect(screen.getByText("You Set the Price, We Handle the Rest")).toBeInTheDocument();
    expect(screen.getByText("Automated Execution for Your Members")).toBeInTheDocument();
    expect(screen.getByText("Clear Revenue & Subscriber Insights")).toBeInTheDocument();
  });

  it("renders ProviderHowItWorks with 4 numbered steps and mini-flow", () => {
    const onOpenModal = vi.fn();
    render(<ProviderHowItWorks onOpenModal={onOpenModal} />);

    expect(
      screen.getByText("From Telegram Group to Automated Business in 4 Steps")
    ).toBeInTheDocument();
    expect(
      screen.getByText("No code. No complex setup. Just connect, configure, and grow.")
    ).toBeInTheDocument();

    expect(screen.getByText("Create Your Provider Account")).toBeInTheDocument();
    expect(screen.getByText("Create Your Plans")).toBeInTheDocument();
    expect(screen.getByText("Connect Your Telegram Channel")).toBeInTheDocument();
    expect(screen.getByText("Share Your Tadex Link With Members")).toBeInTheDocument();

    // Mini flow
    expect(screen.getByText("1. Telegram VIP Channel")).toBeInTheDocument();
    expect(screen.getByText("2. Tadex Billing & Signal Engine")).toBeInTheDocument();
  });

  it("renders ProviderPricingRevenue with transparent 90/10 split and fee features", () => {
    const onOpenModal = vi.fn();
    render(<ProviderPricingRevenue onOpenModal={onOpenModal} />);

    expect(screen.getByText("Simple, Transparent Revenue Share")).toBeInTheDocument();
    expect(screen.getByText("How You Earn")).toBeInTheDocument();
    expect(screen.getByText("What You Get for That Fee")).toBeInTheDocument();

    // Split numbers
    expect(screen.getByText("₦27,000")).toBeInTheDocument();
    expect(screen.getByText("₦3,000")).toBeInTheDocument();
    expect(
      screen.getByText(/Tadex does not take a cut of your members’ trading PnL/i)
    ).toBeInTheDocument();
  });

  it("renders ProviderFAQ with 8 questions, JSON-LD schema, and toggles answers", () => {
    const { container } = render(<ProviderFAQ />);

    expect(screen.getByText("Frequently Asked Questions (Providers)")).toBeInTheDocument();
    expect(screen.getByText("Do I need to stop using Telegram?")).toBeInTheDocument();
    expect(screen.getByText("How do I get paid?")).toBeInTheDocument();
    expect(screen.getByText("Can I set my own prices?")).toBeInTheDocument();
    expect(screen.getByText("What if I already have members paying me directly?")).toBeInTheDocument();
    expect(screen.getByText("What happens if a member’s payment fails or expires?")).toBeInTheDocument();
    expect(screen.getByText("Can I offer both free and paid communities?")).toBeInTheDocument();
    expect(screen.getByText("Is there a minimum number of members to become a provider?")).toBeInTheDocument();
    expect(screen.getByText("Can I change my prices later?")).toBeInTheDocument();

    // JSON-LD FAQPage schema check (A7)
    const ldJson = container.querySelector('script[type="application/ld+json"]');
    expect(ldJson).not.toBeNull();
    expect(ldJson?.textContent).toContain("FAQPage");

    // Toggle Q2
    const q2 = screen.getByText("How do I get paid?");
    fireEvent.click(q2);
    expect(screen.getByText(/Members pay through Tadex checkout/i)).toBeInTheDocument();
  });

  it("renders ProviderFinalCTA with headline and trust line", () => {
    const onOpenModal = vi.fn();
    render(<ProviderFinalCTA onOpenModal={onOpenModal} />);

    expect(screen.getByText("Ready to Professionalize Your Signal Business?")).toBeInTheDocument();
    expect(screen.getByText("Automated billing")).toBeInTheDocument();
    expect(screen.getByText("Revenue dashboard")).toBeInTheDocument();
    expect(screen.getByText("Multi-currency support")).toBeInTheDocument();
  });

  it("renders ProviderFooter with Tadex for Providers, location Lagos, Nigeria, and zero dead links", () => {
    const { container } = render(<ProviderFooter />);

    expect(screen.getByText("Tadex for Providers")).toBeInTheDocument();
    expect(
      screen.getByText("Automate billing, access, and execution for your signal community.")
    ).toBeInTheDocument();
    expect(screen.getByText("Location: Lagos, Nigeria")).toBeInTheDocument();
    expect(screen.queryByText(/Made with ❤️ for developers/i)).not.toBeInTheDocument();

    const deadLinks = container.querySelectorAll('a[href="#"]');
    expect(deadLinks.length).toBe(0);
  });

  it("opens ProviderLeadModal, submits details, and shows confirmation", async () => {
    const onClose = vi.fn();
    // mock global fetch
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as any);

    render(<ProviderLeadModal isOpen={true} onClose={onClose} />);

    expect(screen.getByText("Become a Tadex Provider")).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText("e.g. Alpha Signals or Alex"), {
      target: { value: "Apex VIP Signals" },
    });
    fireEvent.change(screen.getByPlaceholderText("you@domain.com"), {
      target: { value: "apex@signals.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("@yourchannel"), {
      target: { value: "@ApexSignalsVIP" },
    });
    fireEvent.change(screen.getByPlaceholderText("e.g. 150 members"), {
      target: { value: "250 members" },
    });

    const submitBtn = screen.getByRole("button", { name: /Submit & Connect with Team/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("We Received Your Details!")).toBeInTheDocument();
    });

    fetchSpy.mockRestore();
  });

  it("renders ForProvidersPage with skip-to-content link and floating provider navigation", () => {
    render(<ForProvidersPage />);

    expect(screen.getByText("Skip to content")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /Provider navigation/i })).toBeInTheDocument();
    expect(screen.getByText("For Providers")).toBeInTheDocument();
  });
});
