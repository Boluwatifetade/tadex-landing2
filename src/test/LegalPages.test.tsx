import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PrivacyPage from "@/app/privacy/page";
import TermsPage from "@/app/terms/page";
import SecurityPage from "@/app/security/page";

describe("Legal & Security Pages (Dark Visual System + GDPR Self-Hosted Fonts)", () => {
  it("renders PrivacyPage with dark surface styling, self-hosted next/font disclosure, first-party Vercel Analytics disclosure, and Lagos location", () => {
    render(<PrivacyPage />);

    const heading = screen.getByRole("heading", { level: 1, name: "Privacy Policy" });
    expect(heading).toBeInTheDocument();
    expect(heading.className).toContain("hero-heading-gradient");

    expect(screen.getByText(/First-Party Cookie-Free Web Analytics \(Vercel Analytics\)/i)).toBeInTheDocument();
    expect(screen.getByText(/@vercel\/analytics/i)).toBeInTheDocument();
    expect(screen.getByText(/do not require separate consent under applicable data protection laws/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Nigeria Data Protection Act \(NDPA\) 2023/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/General Application and Implementation Directive \(GAID\) 2025/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Self-Hosted Web Fonts \(Zero Google Fonts Requests\)/i)).toBeInTheDocument();
    expect(screen.getByText(/fonts\.googleapis\.com/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Lagos, Nigeria/i).length).toBeGreaterThan(0);
  });

  it("renders TermsPage with dark surface styling, non-custodial disclosures, and Lagos location", () => {
    render(<TermsPage />);

    const heading = screen.getByRole("heading", { level: 1, name: "Terms of Service" });
    expect(heading).toBeInTheDocument();
    expect(heading.className).toContain("hero-heading-gradient");

    expect(screen.getByText(/Strictly Non-Custodial:/i)).toBeInTheDocument();
    expect(screen.getByText(/Trade-Only API Keys Required:/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Lagos, Nigeria/i).length).toBeGreaterThan(0);
  });

  it("renders SecurityPage with dark surface styling, 4 safeguards, and interactive FAQ", () => {
    render(<SecurityPage />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Your Security is Our Priority",
    });
    expect(heading).toBeInTheDocument();
    expect(heading.className).toContain("hero-heading-gradient");

    expect(screen.getByText("We Never Hold Your Assets")).toBeInTheDocument();
    expect(screen.getByText("Restricted-Scope API Keys")).toBeInTheDocument();
    expect(screen.getByText("AES-256 Encryption at Rest")).toBeInTheDocument();
    expect(screen.getByText("Full Execution Transparency")).toBeInTheDocument();

    const q2 = screen.getByText("Can Tadex access my exchange login credentials?");
    fireEvent.click(q2);
    expect(
      screen.getByText(/We never ask for your exchange email, password, or 2FA codes/i)
    ).toBeInTheDocument();
  });
});
