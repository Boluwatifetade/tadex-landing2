import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal"],
  display: "swap",
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal"],
  display: "swap",
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Tadex | Automated Telegram Signal Execution for Crypto Traders",
  description:
    "Connect your Telegram signal groups and crypto exchanges. Tadex reads signals and places trades automatically 24/7 with strict risk rules. Start free.",
  openGraph: {
    title: "Tadex | Automated Telegram Signal Execution for Crypto Traders",
    description:
      "Connect your Telegram groups and exchanges. Tadex reads signals and places trades for you 24/7 so you never miss entries or make costly mistakes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} dark`}>
      <body className="antialiased bg-surface-canvas text-content-primary font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
