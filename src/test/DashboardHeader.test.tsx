import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

let mockPathname = "/dashboard";
const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
  }),
  usePathname: () => mockPathname,
}));

describe("DashboardHeader (Option A Shell)", () => {
  beforeEach(() => {
    mockPathname = "/dashboard";
    mockPush.mockReset();
    vi.restoreAllMocks();
  });

  it("renders brand logo, desktop left sidebar groups, top utility bar, and mobile bottom dock", () => {
    render(<DashboardHeader userEmail="trader@tadex.app" userStatus="active" />);

    expect(screen.getByText("Tadex App")).toBeInTheDocument();
    expect(screen.getByTestId("desktop-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("top-utility-bar")).toBeInTheDocument();
    expect(screen.getByTestId("mobile-bottom-dock")).toBeInTheDocument();

    // Sidebar section headers
    expect(screen.getByTestId("sidebar-trading-section")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-provider-section")).toBeInTheDocument();
    expect(screen.getByTestId("sidebar-account-section")).toBeInTheDocument();

    // Standard navigation destinations
    expect(screen.getAllByText("Overview").length).toBeGreaterThan(0);
    expect(screen.getAllByText("API Keys").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Trading").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Browse Providers").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Provider Portal").length).toBeGreaterThan(0);
    expect(screen.getAllByText("All Plans").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Settings").length).toBeGreaterThan(0);
  });

  it("hides feature-gated modules (Risk Control, Signal Builder) by default", () => {
    render(<DashboardHeader userEmail="trader@tadex.app" userStatus="active" />);

    expect(screen.queryByText("Risk Control")).not.toBeInTheDocument();
    expect(screen.queryByText("Signal Builder")).not.toBeInTheDocument();
  });

  it("enforces role-based admin separation: hides SYSTEM ADMINISTRATION for regular users and shows it for admins", () => {
    const { rerender } = render(
      <DashboardHeader
        userEmail="trader@tadex.app"
        userStatus="active"
        userRole="user"
      />
    );

    expect(screen.queryByTestId("sidebar-admin-section")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin Console")).not.toBeInTheDocument();
    expect(screen.queryByTestId("header-admin-badge")).not.toBeInTheDocument();

    rerender(
      <DashboardHeader
        userEmail="admin@tadex.app"
        userStatus="active"
        userRole="admin"
      />
    );

    expect(screen.getByTestId("sidebar-admin-section")).toBeInTheDocument();
    expect(screen.getByText("Admin Console")).toBeInTheDocument();
    expect(screen.getByText("User Management")).toBeInTheDocument();
    expect(screen.getByText("Execution & Risk")).toBeInTheDocument();
    expect(screen.getByTestId("header-admin-badge")).toHaveTextContent("Admin Role");
  });

  it("marks active route with aria-current='page' in sidebar and mobile bottom dock", () => {
    mockPathname = "/dashboard/trading";
    render(<DashboardHeader userEmail="trader@tadex.app" userStatus="active" />);

    const tradingLinks = screen.getAllByRole("link", { name: /^trading$/i });
    expect(tradingLinks.length).toBeGreaterThanOrEqual(2);
    tradingLinks.forEach((link) => {
      expect(link).toHaveAttribute("aria-current", "page");
    });
  });

  it("toggles mobile hamburger navigation drawer and renders all 7 destinations", () => {
    render(<DashboardHeader userEmail="trader@tadex.app" userStatus="active" />);

    const toggleBtn = screen.getByRole("button", { name: /toggle navigation menu/i });
    expect(toggleBtn).toBeInTheDocument();

    // Click to open mobile navigation drawer
    fireEvent.click(toggleBtn);

    // Verify all 7 destinations are accessible in mobile view
    expect(screen.getAllByRole("link", { name: /overview/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /api keys/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /trading/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /browse providers/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /provider portal/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /all plans/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /log out/i }).length).toBeGreaterThan(0);
  });
});
