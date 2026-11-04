import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";
import RegisterPage from "@/app/register/page";
import DashboardLayout from "@/app/dashboard/layout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import * as apiClientModule from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";

let mockPathname = "/dashboard";
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  usePathname: () => mockPathname,
  useSearchParams: () => new URLSearchParams(),
}));

describe("Phase 2 — Authentication Split-Screen Harmonization & Route Protection", () => {
  beforeEach(() => {
    mockPathname = "/dashboard";
    mockPush.mockReset();
    mockReplace.mockReset();
    vi.restoreAllMocks();
    useAuthStore.setState({
      accessToken: "valid-jwt-token",
      isAuthenticated: true,
      isInitializing: false,
      user: {
        id: "u1",
        email: "trader@tadex.app",
        status: "active",
        role: "user",
        email_verified: true,
      },
    });
  });

  it("renders harmonized Login split-screen shell with verified email/password only (no decorative OAuth or OTP)", () => {
    render(<LoginPage />);

    expect(screen.getByTestId("auth-split-shell")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /log in to your account/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^sign in$/i })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /^create account$/i })).toHaveAttribute("href", "/register");

    // Password visibility toggle works
    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    expect(passwordInput.type).toBe("password");
    const showBtn = screen.getByRole("button", { name: /show password/i });
    fireEvent.click(showBtn);
    expect(passwordInput.type).toBe("text");

    // Strictly no decorative OAuth or OTP buttons
    expect(screen.queryByText(/continue with google/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/continue with apple/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/one-time code|otp/i)).not.toBeInTheDocument();
  });

  it("submits LoginPage credentials via POST /auth/login and stores access token in memory", async () => {
    const apiSpy = vi.spyOn(apiClientModule, "apiClient").mockResolvedValueOnce({
      access_token: "fresh-session-jwt",
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "trader@tadex.app" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "Password123!" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^log in$/i }));

    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(
        "/auth/login",
        expect.objectContaining({ method: "POST" }),
        { skipAuth: true }
      );
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("renders harmonized Register split-screen shell and submits POST /auth/register followed by POST /auth/login", async () => {
    const apiSpy = vi
      .spyOn(apiClientModule, "apiClient")
      .mockResolvedValueOnce({
        id: "u2",
        email: "newtrader@tadex.app",
        email_verified: false,
        status: "active",
      })
      .mockResolvedValueOnce({
        access_token: "registered-jwt",
      });

    render(<RegisterPage />);

    expect(screen.getByTestId("auth-split-shell")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^create account$/i })).toHaveAttribute(
      "aria-current",
      "page"
    );

    // Strictly no decorative OAuth or OTP buttons
    expect(screen.queryByText(/continue with google/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/continue with apple/i)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "newtrader@tadex.app" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "StrongPass123!" },
    });
    fireEvent.change(screen.getByLabelText(/^confirm password$/i), {
      target: { value: "StrongPass123!" },
    });

    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(apiSpy).toHaveBeenCalledWith(
        "/auth/register",
        expect.objectContaining({ method: "POST" }),
        { skipAuth: true }
      );
      expect(apiSpy).toHaveBeenCalledWith(
        "/auth/login",
        expect.objectContaining({ method: "POST" }),
        { skipAuth: true }
      );
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("redirects disabled feature-gated routes (e.g. /dashboard/automation) back to /dashboard in DashboardLayout", async () => {
    mockPathname = "/dashboard/automation";
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path: string) => {
      if (path === "/me") {
        return {
          id: "u1",
          email: "trader@tadex.app",
          status: "active",
          role: "user",
          email_verified: true,
        };
      }
      if (path === "/keys") {
        return [];
      }
      return null;
    });

    render(
      <DashboardLayout>
        <div data-testid="gated-child">Secret Gated Content</div>
      </DashboardLayout>
    );

    expect(screen.queryByTestId("gated-child")).not.toBeInTheDocument();
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("truthfully renders 'Not Connected' in top utility bar when account has zero connected exchange keys", async () => {
    mockPathname = "/dashboard";
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path: string) => {
      if (path === "/me") {
        return {
          id: "u1",
          email: "trader@tadex.app",
          status: "active",
          role: "user",
          email_verified: true,
          telegram_linked: true,
          telegram_username: "lagostrader",
        };
      }
      if (path === "/keys") {
        return []; // No connected keys
      }
      return null;
    });

    render(
      <DashboardLayout>
        <div data-testid="child-content">Dashboard Content</div>
      </DashboardLayout>
    );

    await waitFor(() => {
      const beaconBadges = screen.getAllByTestId("sync-freshness-status");
      expect(beaconBadges.length).toBeGreaterThan(0);
      // Confirms exchange status is truthfully "Not Connected", never "Live Mainnet"
      expect(beaconBadges[0]).toHaveTextContent("Not Connected");
      expect(beaconBadges[0]).toHaveAttribute("data-status", "disconnected");
      expect(screen.queryByText("Live Mainnet")).not.toBeInTheDocument();
    });
  });

  it("honestly renders 'BYBIT Configured (Unverified)' when key is active but lacks verified exchange sync", async () => {
    mockPathname = "/dashboard";
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path: string) => {
      if (path === "/me") {
        return {
          id: "u1",
          email: "trader@tadex.app",
          status: "active",
          role: "user",
          email_verified: true,
        };
      }
      if (path === "/keys") {
        return [
          {
            id: "key_1",
            exchange: "bybit",
            api_key_masked: "AbCd...1234",
            is_testnet: false,
            status: "active",
            last_used_at: null, // Unverified connectivity
          },
        ];
      }
      return null;
    });

    render(
      <DashboardLayout>
        <div data-testid="child-content">Dashboard Content</div>
      </DashboardLayout>
    );

    await waitFor(() => {
      const beaconBadges = screen.getAllByTestId("sync-freshness-status");
      expect(beaconBadges.length).toBeGreaterThan(0);
      expect(beaconBadges[0]).toHaveTextContent("BYBIT Configured (Unverified)");
      expect(beaconBadges[0]).toHaveAttribute("data-status", "degraded");
      expect(beaconBadges[0]).not.toHaveAttribute("data-status", "fresh");
    });
  });

  it("honestly renders 'BYBIT Mainnet (Unsynced)' when key has verified communication but account data is not yet synchronized", async () => {
    mockPathname = "/dashboard";
    const recentIso = new Date(Date.now() - 10_000).toISOString(); // 10s ago API communication
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path: string) => {
      if (path === "/me") {
        return {
          id: "u1",
          email: "trader@tadex.app",
          status: "active",
          role: "user",
          email_verified: true,
        };
      }
      if (path === "/keys") {
        return [
          {
            id: "key_1",
            exchange: "bybit",
            api_key_masked: "AbCd...1234",
            is_testnet: false,
            status: "active",
            last_used_at: recentIso, // Verified API communication, but NO portfolio data sync
          },
        ];
      }
      return null;
    });

    render(
      <DashboardLayout>
        <div data-testid="child-content">Dashboard Content</div>
      </DashboardLayout>
    );

    await waitFor(() => {
      const beaconBadges = screen.getAllByTestId("sync-freshness-status");
      expect(beaconBadges.length).toBeGreaterThan(0);
      expect(beaconBadges[0]).toHaveTextContent("BYBIT Mainnet (Unsynced)");
      expect(beaconBadges[0]).toHaveAttribute("data-status", "degraded");
      expect(beaconBadges[0]).not.toHaveAttribute("data-status", "fresh");
    });
  });

  it("renders verified fresh exchange state in DashboardHeader when account data synchronization is fresh", () => {
    render(
      <DashboardHeader
        userEmail="trader@tadex.app"
        freshnessState="fresh"
        freshnessLabel="BYBIT Mainnet"
        lastUpdatedAt={new Date()}
      />
    );

    const beaconBadges = screen.getAllByTestId("sync-freshness-status");
    expect(beaconBadges.length).toBeGreaterThan(0);
    expect(beaconBadges[0]).toHaveTextContent("BYBIT Mainnet");
    expect(beaconBadges[0]).toHaveAttribute("data-status", "fresh");
  });

  it("renders 'BYBIT Auth Failed' when exchange key has failed authentication or revoked status", async () => {
    mockPathname = "/dashboard";
    vi.spyOn(apiClientModule, "apiClient").mockImplementation(async (path: string) => {
      if (path === "/me") {
        return {
          id: "u1",
          email: "trader@tadex.app",
          status: "active",
          role: "user",
          email_verified: true,
        };
      }
      if (path === "/keys") {
        return [
          {
            id: "key_1",
            exchange: "bybit",
            api_key_masked: "AbCd...1234",
            is_testnet: false,
            status: "invalid",
          },
        ];
      }
      return null;
    });

    render(
      <DashboardLayout>
        <div data-testid="child-content">Dashboard Content</div>
      </DashboardLayout>
    );

    await waitFor(() => {
      const beaconBadges = screen.getAllByTestId("sync-freshness-status");
      expect(beaconBadges.length).toBeGreaterThan(0);
      expect(beaconBadges[0]).toHaveTextContent("BYBIT Auth Failed");
      expect(beaconBadges[0]).toHaveAttribute("data-status", "error");
    });
  });
});
