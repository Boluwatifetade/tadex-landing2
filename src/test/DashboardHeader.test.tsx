import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import * as authStoreModule from "@/lib/auth-store";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/dashboard",
}));

describe("DashboardHeader", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renders brand logo and desktop navigation", () => {
    render(<DashboardHeader userEmail="trader@tadex.app" userStatus="active" />);

    expect(screen.getByText("Tadex App")).toBeInTheDocument();
    expect(screen.getAllByText("Overview").length).toBeGreaterThan(0);
    expect(screen.getAllByText("API Keys").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Trading").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Browse Providers").length).toBeGreaterThan(0);
    expect(screen.getAllByText("All Plans").length).toBeGreaterThan(0);
  });

  it("toggles mobile hamburger navigation drawer and renders all 6 destinations", () => {
    render(<DashboardHeader userEmail="trader@tadex.app" userStatus="active" />);

    const toggleBtn = screen.getByRole("button", { name: /toggle navigation menu/i });
    expect(toggleBtn).toBeInTheDocument();

    // Click to open mobile navigation drawer
    fireEvent.click(toggleBtn);

    // Verify all 6 destinations are accessible in mobile view
    expect(screen.getAllByRole("link", { name: /overview/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /api keys/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /trading/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /browse providers/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /all plans/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /log out/i }).length).toBeGreaterThan(0);
  });
});
