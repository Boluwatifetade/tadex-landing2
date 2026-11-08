'use client';

import React from 'react';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  ClockIcon,
  LightningIcon,
  SlidersIcon,
  ShieldCheckIcon,
  BroadcastIcon,
  KeyIcon,
  CheckCircleIcon,
  WarningTriangleIcon,
  ArrowRightIcon,
} from '@/components/ui/PhosphorIcons';

interface ComparisonDimension {
  id: string;
  title: string;
  category: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  manual: {
    summary: string;
    details: string;
    frictionTag: string;
  };
  tadex: {
    summary: string;
    details: string;
    advantageTag: string;
  };
}

const COMPARISON_DIMENSIONS: ComparisonDimension[] = [
  {
    id: 'ingestion',
    title: 'Signal Ingestion & Monitoring',
    category: 'Availability',
    icon: ClockIcon,
    manual: {
      summary: 'Requires 24/7 screen vigilance',
      details:
        'Traders must constantly monitor Telegram notifications. Signals published while working, commuting, or sleeping are often seen late or missed entirely.',
      frictionTag: 'Manual Phone Vigilance',
    },
    tadex: {
      summary: 'Continuous cloud-based signal reading',
      details:
        'Connected Telegram channels are parsed in real time around the clock. Your configured trade rules execute automatically without needing your phone open.',
      advantageTag: '24/7 Cloud Ingestion',
    },
  },
  {
    id: 'timing',
    title: 'Order Entry & Execution Timing',
    category: 'Speed & Precision',
    icon: LightningIcon,
    manual: {
      summary: 'Manual transcription causes entry delays',
      details:
        'Switching between Telegram and Bybit, typing entry prices, selecting contract quantities, and confirming orders takes valuable time while fast markets move.',
      frictionTag: 'App-Switching Delay',
    },
    tadex: {
      summary: 'Direct Bybit API order dispatch',
      details:
        'Orders are placed programmatically through the Bybit API immediately after a signal is parsed and validated, minimizing manual transcription delay.',
      advantageTag: 'Low-Latency API Dispatch',
    },
  },
  {
    id: 'sizing',
    title: 'Position Sizing & Risk Calculation',
    category: 'Risk Management',
    icon: SlidersIcon,
    manual: {
      summary: 'Hurried mental math or external calculators',
      details:
        'Calculating lot sizes under time pressure often leads to arbitrary contract quantities, inconsistent position sizes, or taking excessive leverage.',
      frictionTag: 'Calculation Pressure',
    },
    tadex: {
      summary: 'Pre-configured mathematical risk rules',
      details:
        'Position sizing is calculated automatically on every trade based on your pre-set parameters (fixed margin or exact account risk percentage) before dispatch.',
      advantageTag: 'Automated Risk Rules',
    },
  },
  {
    id: 'stop-loss',
    title: 'Stop Loss Discipline',
    category: 'Capital Protection',
    icon: ShieldCheckIcon,
    manual: {
      summary: 'Frequently delayed or skipped emotionally',
      details:
        'Traders often intend to set stop losses later or hesitate during volatile wicks hoping for a quick rebound, leaving account balances unhedged.',
      frictionTag: 'Emotional Hesitation',
    },
    tadex: {
      summary: 'Automated stop loss placement with orders',
      details:
        'Configured trade orders dispatch with protective stop loss parameters attached, helping enforce exit discipline automatically when signals specify risk targets.',
      advantageTag: 'Configured Stop Loss',
    },
  },
  {
    id: 'duplicates',
    title: 'Signal Updates & Duplicate Guard',
    category: 'Order Integrity',
    icon: BroadcastIcon,
    manual: {
      summary: 'Channel edits and updates cause confusion',
      details:
        'Telegram channels often edit messages, post multi-target updates, or publish reminder alerts, leading to accidental duplicate entries or mismanaged trades.',
      frictionTag: 'Duplicate Order Risk',
    },
    tadex: {
      summary: 'Built-in idempotency key protection',
      details:
        'Each signal message ID and payload revision is tracked with idempotency keys, helping prevent duplicate order dispatches when channels edit or repost signals.',
      advantageTag: 'Idempotent Order Guard',
    },
  },
  {
    id: 'custody',
    title: 'Account Custody & Operational Control',
    category: 'Security & Custody',
    icon: KeyIcon,
    manual: {
      summary: 'Direct control with manual operational responsibility',
      details:
        'You retain full direct access to your exchange account, but you remain responsible for monitoring signals, calculating position sizes, and placing orders.',
      frictionTag: 'Manual Responsibility',
    },
    tadex: {
      summary: 'Non-custodial trade-only API access',
      details:
        'Your trading capital stays on Bybit. Tadex connects using trade-only API credentials with withdrawal permissions disabled, and access can be revoked directly in your dashboard.',
      advantageTag: 'Non-Custodial · Bybit Only',
    },
  },
];

export default function ManualVsTadexComparison() {
  return (
    <section
      id="manual-vs-tadex"
      aria-label="Manual Signal Copying versus Tadex Automation"
      className="py-20 lg:py-28 bg-surface-canvas text-content-primary relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          {/* Section Header */}
          <div className="max-w-[720px] mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-subtle border border-surface-elevated caption-4 text-brand-accent font-mono mb-4">
              <span>WORKFLOW COMPARISON</span>
            </div>
            <h2 className="heading-2 text-content-primary mb-4">
              Manual Execution vs. Tadex Automation
            </h2>
            <p className="title-1 text-content-secondary">
              Trading signals move fast. Manual copy-pasting introduces operational friction, calculation pressure, and unforced entry delays. Here is how Tadex automates execution while keeping you in full control.
            </p>
          </div>

          {/* Desktop Table View (>= lg) */}
          <div className="hidden lg:block overflow-hidden rounded-2xl border border-surface-elevated bg-surface-primary shadow-2xl">
            {/* Table Header */}
            <div className="grid grid-cols-12 border-b border-surface-elevated bg-surface-subtle/80 text-content-secondary font-mono caption-3">
              <div className="col-span-4 p-5 text-content-primary font-semibold">
                Operational Dimension
              </div>
              <div className="col-span-4 p-5 border-l border-surface-elevated flex items-center gap-2">
                <WarningTriangleIcon size={16} className="text-content-tertiary" />
                <span className="text-content-primary font-semibold">Manual Telegram Copying</span>
              </div>
              <div className="col-span-4 p-5 border-l border-surface-elevated flex items-center gap-2 bg-brand-accentSubtle/40">
                <CheckCircleIcon size={16} className="text-brand-accent" />
                <span className="text-brand-accent font-semibold">Tadex Automated Execution</span>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-surface-elevated">
              {COMPARISON_DIMENSIONS.map((row) => {
                const Icon = row.icon;
                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-12 items-stretch hover:bg-surface-subtle/40 transition-colors duration-200"
                  >
                    {/* Column 1: Dimension */}
                    <div className="col-span-4 p-6 flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-surface-subtle border border-surface-elevated text-brand-accent flex items-center justify-center flex-shrink-0">
                        <Icon size={20} />
                      </div>
                      <div className="space-y-1">
                        <span className="caption-5 text-content-tertiary font-mono uppercase tracking-wider block">
                          {row.category}
                        </span>
                        <h3 className="title-2 text-content-primary">{row.title}</h3>
                      </div>
                    </div>

                    {/* Column 2: Manual Execution */}
                    <div className="col-span-4 p-6 border-l border-surface-elevated space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="caption-4 px-2 py-0.5 rounded bg-surface-subtle text-content-tertiary border border-surface-elevated font-mono">
                          {row.manual.frictionTag}
                        </span>
                      </div>
                      <p className="title-3 text-content-primary">{row.manual.summary}</p>
                      <p className="body-6 text-content-secondary leading-relaxed">
                        {row.manual.details}
                      </p>
                    </div>

                    {/* Column 3: Tadex Automation */}
                    <div className="col-span-4 p-6 border-l border-surface-elevated bg-brand-accentSubtle/10 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="caption-4 px-2 py-0.5 rounded bg-brand-accentSubtle text-brand-accent border border-brand-accent/30 font-mono font-medium">
                          {row.tadex.advantageTag}
                        </span>
                      </div>
                      <p className="title-3 text-brand-accent">{row.tadex.summary}</p>
                      <p className="body-6 text-content-secondary leading-relaxed">
                        {row.tadex.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile Stacked Cards View (< lg) */}
          <div className="lg:hidden space-y-4">
            {COMPARISON_DIMENSIONS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-surface-elevated bg-surface-primary p-5 sm:p-6 space-y-4 shadow-lg"
                >
                  {/* Dimension Title */}
                  <div className="flex items-center gap-3 pb-3 border-b border-surface-elevated">
                    <div className="w-9 h-9 rounded-lg bg-surface-subtle border border-surface-elevated text-brand-accent flex items-center justify-center flex-shrink-0">
                      <Icon size={18} />
                    </div>
                    <div>
                      <span className="caption-5 text-content-tertiary font-mono uppercase tracking-wider block">
                        Dimension 0{idx + 1} · {item.category}
                      </span>
                      <h3 className="title-2 text-content-primary">{item.title}</h3>
                    </div>
                  </div>

                  {/* Comparison Sub-Cards */}
                  <div className="space-y-3">
                    {/* Manual Panel */}
                    <div className="rounded-xl border border-surface-elevated bg-surface-canvas p-4 space-y-2">
                      <div className="flex items-center justify-between text-content-tertiary">
                        <span className="caption-4 font-mono font-semibold text-content-secondary flex items-center gap-1.5">
                          <WarningTriangleIcon size={14} className="text-content-tertiary" />
                          <span>Manual Execution</span>
                        </span>
                        <span className="caption-5 font-mono text-content-muted">
                          {item.manual.frictionTag}
                        </span>
                      </div>
                      <p className="title-3 text-content-primary text-sm font-medium">
                        {item.manual.summary}
                      </p>
                      <p className="caption-4 text-content-secondary leading-relaxed">
                        {item.manual.details}
                      </p>
                    </div>

                    {/* Tadex Panel */}
                    <div className="rounded-xl border border-brand-accent/30 bg-brand-accentSubtle/20 p-4 space-y-2">
                      <div className="flex items-center justify-between text-brand-accent">
                        <span className="caption-4 font-mono font-semibold flex items-center gap-1.5">
                          <CheckCircleIcon size={14} />
                          <span>Tadex Automation</span>
                        </span>
                        <span className="caption-5 font-mono px-2 py-0.5 rounded bg-brand-accentSubtle border border-brand-accent/30">
                          {item.tadex.advantageTag}
                        </span>
                      </div>
                      <p className="title-3 text-content-primary text-sm font-medium">
                        {item.tadex.summary}
                      </p>
                      <p className="caption-4 text-content-secondary leading-relaxed">
                        {item.tadex.details}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Operational Reality & Disclaimer Footer Card */}
          <div className="mt-8 rounded-2xl border border-surface-elevated bg-surface-subtle p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h4 className="title-2 text-content-primary">
                Automation Eliminates Delay — You Configure the Rules
              </h4>
              <p className="body-6 text-content-secondary">
                Tadex is a software automation layer that executes your instructions directly on your connected Bybit account. Tadex does not give financial advice, generate trading signals, or guarantee profits.
              </p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <Link href="/register" className="block w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-md px-6 py-3.5 rounded-xl transition-[background-color,transform] duration-300 ease-weighted hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
                >
                  <span>Start Free. No Credit Card.</span>
                  <ArrowRightIcon size={18} />
                </button>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
