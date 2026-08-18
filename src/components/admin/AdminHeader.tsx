"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import {
  Shield,
  LayoutDashboard,
  Users,
  Radio,
  FileCheck,
  ShieldCheck,
  CreditCard,
  Zap,
  ScrollText,
  LogOut,
  ArrowUpRight,
  Menu,
  X,
  Lock,
} from "lucide-react";

interface AdminHeaderProps {
  adminEmail?: string;
}

export default function AdminHeader({ adminEmail }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clear);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const navLinks = [
    {
      href: "/admin",
      label: "Overview",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      href: "/admin/providers",
      label: "Providers",
      icon: Radio,
      active: pathname === "/admin/providers",
    },
    {
      href: "/admin/providers/applications",
      label: "Applications",
      icon: FileCheck,
      active: pathname.startsWith("/admin/providers/applications"),
    },
    {
      href: "/admin/providers/verification-queue",
      label: "Verification Queue",
      icon: ShieldCheck,
      active: pathname.startsWith("/admin/providers/verification-queue"),
    },
  ];

  const comingSoonStubs = [
    { label: "Users", icon: Users },
    { label: "Billing & Revenue", icon: CreditCard },
    { label: "Execution Engine", icon: Zap },
    { label: "Audit Logs", icon: ScrollText },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Admin Badge */}
        <div className="flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2.5 font-bold text-foreground">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <Shield className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-base tracking-tight font-extrabold">Tadex Admin</span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    link.active
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Desktop Stubs (Disabled / Coming Soon) */}
            <div className="hidden lg:flex items-center gap-1 pl-2 border-l border-border/60">
              {comingSoonStubs.map((stub) => {
                const Icon = stub.icon;
                return (
                  <div
                    key={stub.label}
                    className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-muted-foreground/50 cursor-not-allowed select-none group relative"
                    title={`${stub.label} management is coming in Phase Admin-2`}
                  >
                    <Icon className="h-3 w-3 opacity-60" />
                    <span>{stub.label}</span>
                    <span className="text-[9px] bg-muted/60 text-muted-foreground/70 px-1.5 py-0.2 rounded-full border border-border/40 font-mono">
                      Soon
                    </span>
                  </div>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Right Section: Return to App & Session */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border/80 px-2.5 py-1.5 rounded-md hover:bg-muted/40 transition-colors"
          >
            <span>Exit to Trading App</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>

          {adminEmail && (
            <span className="text-xs text-muted-foreground font-mono bg-muted/40 px-2.5 py-1 rounded-md border border-border/50">
              {adminEmail}
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-xs flex items-center gap-1 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Log out</span>
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle admin navigation menu"
            className="p-1.5"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-4 space-y-4 animate-in slide-in-from-top-2 duration-150">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 pb-1">
              Active Management
            </p>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg ${
                    link.active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-1 pt-2 border-t border-border/60">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 pb-1">
              Coming in Phase Admin-2
            </p>
            {comingSoonStubs.map((stub) => {
              const Icon = stub.icon;
              return (
                <div
                  key={stub.label}
                  className="flex items-center justify-between px-3 py-1.5 text-xs text-muted-foreground/60 rounded-lg cursor-not-allowed"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5" />
                    <span>{stub.label}</span>
                  </div>
                  <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full border border-border/60 font-mono">
                    Coming Soon
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground border border-border py-2 rounded-lg hover:bg-muted"
            >
              <span>Exit to Trading Dashboard</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full text-xs text-destructive hover:text-destructive flex items-center justify-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log out</span>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
