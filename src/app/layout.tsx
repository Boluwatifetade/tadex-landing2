import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tadex - Workflow Automation for Event-Driven Systems",
  description: "Simplify Workflows. Automate Event Routing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
