'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRightIcon,
  PlayIcon,
  ShieldCheckIcon,
  LightningIcon,
} from '@/components/ui/PhosphorIcons';

interface TradeScenario {
  id: string;
  tabLabel: string;
  pair: string;
  channel: string;
  direction: string;
  entryPrice: string;
  stopLoss: string;
  takeProfit: string;
  riskPercent: string;
  computedQty: string;
  exchange: string;
  orderPlaced: string;
  fillStatus: string;
  simulatedId: string;
}

const TRADE_SCENARIOS: TradeScenario[] = [
  {
    id: 'btc',
    tabLabel: 'BTC/USDT',
    pair: 'BTCUSDT Perp',
    channel: '@AlphaSignals VIP (Demo)',
    direction: 'BUY',
    entryPrice: '$75,000.00',
    stopLoss: '$72,750.00',
    takeProfit: '$78,500.00',
    riskPercent: '1.5% Risk ($15.00)',
    computedQty: '0.0066 BTC',
    exchange: 'Bybit USDT Perpetual',
    orderPlaced: 'Market Buy 0.0066 BTCUSDT',
    fillStatus: 'SIMULATED FILL @ $75,002.00',
    simulatedId: 'SIM-BYB-984210',
  },
  {
    id: 'eth',
    tabLabel: 'ETH/USDT',
    pair: 'ETHUSDT Perp',
    channel: '@AlphaSignals VIP (Demo)',
    direction: 'BUY',
    entryPrice: '$2,450.00',
    stopLoss: '$2,380.00',
    takeProfit: '$2,580.00',
    riskPercent: '1.5% Risk ($15.00)',
    computedQty: '0.2140 ETH',
    exchange: 'Bybit USDT Perpetual',
    orderPlaced: 'Market Buy 0.2140 ETHUSDT',
    fillStatus: 'SIMULATED FILL @ $2,450.50',
    simulatedId: 'SIM-BYB-981140',
  },
  {
    id: 'sol',
    tabLabel: 'SOL/USDT',
    pair: 'SOLUSDT Perp',
    channel: '@AlphaSignals VIP (Demo)',
    direction: 'BUY',
    entryPrice: '$165.00',
    stopLoss: '$160.00',
    takeProfit: '$175.00',
    riskPercent: '1.5% Risk ($15.00)',
    computedQty: '3.0000 SOL',
    exchange: 'Bybit USDT Perpetual',
    orderPlaced: 'Market Buy 3.0000 SOLUSDT',
    fillStatus: 'SIMULATED FILL @ $165.20',
    simulatedId: 'SIM-BYB-978310',
  },
];

export default function Hero() {
  const [activeId, setActiveId] = useState<string>('btc');

  const activeTrade =
    TRADE_SCENARIOS.find((s) => s.id === activeId) || TRADE_SCENARIOS[0];

  return (
    <section className="relative bg-surface-canvas text-content-primary overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 text-left space-y-6">
            {/* Pill: Verified Integration Scope */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-subtle border border-surface-elevated caption-4 text-content-secondary font-mono">
              <span className="w-2 h-2 rounded-full bg-brand-accent inline-block" />
              <span>Bybit API Integration Tested · Non-Custodial</span>
            </div>

            {/* H1 Headline: Capped at 680px with left-to-right #FFFFFF -> #9B9B9B text gradient per B5 */}
            <h1 className="heading-1 hero-heading-gradient max-w-[680px]">
              Automate Your Trading Signals.{' '}
              <span className="block mt-2">Execute Without Manual Delay.</span>
            </h1>

            {/* Subheadline: Capped at 680px per B5 */}
            <p className="title-1 text-content-secondary max-w-[640px]">
              Connect your Telegram trading communities to your Bybit account. Tadex reads incoming signals and executes configured orders automatically, 24 hours a day, with strict position sizing and mandatory stop loss enforcement.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 pt-2">
              <div className="flex flex-col items-center sm:items-start">
                <Link href="/register" className="w-full sm:w-auto">
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-md px-6 py-3.5 rounded-xl transition-[background-color,transform] duration-300 ease-weighted hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
                  >
                    <span>Start Free. No Credit Card.</span>
                    <ArrowRightIcon size={18} />
                  </button>
                </Link>
                <span className="caption-4 text-content-tertiary mt-2">
                  Includes 12 automated trades each month on Free · Fast web onboarding
                </span>
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <Link href="#product-demo" className="w-full sm:w-auto">
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-primary hover:bg-surface-secondary text-content-primary border border-surface-elevated button-md px-5 py-3.5 rounded-xl transition-[background-color,transform] duration-300 ease-weighted hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
                  >
                    <PlayIcon size={16} className="text-brand-accent" />
                    <span>Explore Product Demo</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Proof Signal / Trust Line (Truthful & Verified) */}
            <div className="pt-2 caption-1 text-content-tertiary flex flex-wrap items-center gap-2">
              <ShieldCheckIcon size={16} className="text-brand-accent" />
              <span>Bybit API integration tested</span>
              <span className="text-content-muted" aria-hidden="true">·</span>
              <span>Non-custodial (trade-only API)</span>
              <span className="text-content-muted" aria-hidden="true">·</span>
              <span>Zero credit card required</span>
            </div>
          </div>

          {/* Right Column: Authentic Tadex Web App Execution Preview (Unmistakably Simulated) */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="rounded-2xl border border-surface-elevated bg-surface-primary p-3 sm:p-4 shadow-2xl font-mono text-xs space-y-3">
                {/* Simulated Header Banner */}
                <div className="flex items-center justify-between pb-3 border-b border-surface-elevated">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-accent inline-block animate-pulse" />
                    <span className="caption-3 font-mono text-content-primary">
                      Tadex Execution Engine
                    </span>
                  </div>
                  <span className="caption-4 font-mono text-brand-accent bg-brand-accentSubtle border border-brand-accent/40 px-2 py-0.5 rounded font-semibold tracking-wider">
                    SIMULATED EXECUTION PREVIEW
                  </span>
                </div>

                {/* Simulated Account Identifier (Unmistakably Simulated) */}
                <div className="bg-surface-subtle p-3 rounded-xl border border-surface-elevated space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-content-primary font-semibold">BYBIT MAINNET</span>
                    <span className="text-brand-accent caption-4">CONNECTED (DEMO)</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-content-tertiary">
                    <span>Key: demo_preview_key</span>
                    <span>Trade-Only Scope</span>
                  </div>
                </div>

                {/* Interactive Signal Pair Switcher */}
                <div
                  role="tablist"
                  aria-label="Simulated execution scenarios"
                  className="grid grid-cols-3 gap-1.5"
                >
                  {TRADE_SCENARIOS.map((scenario) => {
                    const isSelected = scenario.id === activeTrade.id;
                    return (
                      <button
                        key={scenario.id}
                        type="button"
                        role="tab"
                        aria-selected={isSelected}
                        onClick={() => setActiveId(scenario.id)}
                        className={`py-1.5 px-2.5 rounded-lg font-mono caption-4 transition-colors duration-200 ease-weighted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                          isSelected
                            ? 'bg-surface-secondary text-brand-accent border border-brand-accent/40 font-semibold'
                            : 'bg-surface-subtle text-content-tertiary hover:text-content-primary border border-surface-elevated'
                        }`}
                      >
                        {scenario.tabLabel}
                      </button>
                    );
                  })}
                </div>

                {/* Ingest Signal */}
                <div className="rounded-xl bg-surface-subtle p-3 border border-surface-elevated space-y-1.5">
                  <div className="flex items-center justify-between text-content-tertiary text-[11px]">
                    <span className="caption-4 text-brand-accent flex items-center gap-1.5">
                      <LightningIcon size={13} />
                      <span>1. Ingest Signal</span>
                    </span>
                    <span className="caption-5 text-content-tertiary">
                      {activeTrade.channel}
                    </span>
                  </div>
                  <div className="text-content-secondary bg-surface-canvas p-2.5 rounded border border-surface-secondary caption-5 leading-relaxed">
                    <span className="text-status-warning font-semibold">{activeTrade.pair}</span>{' '}
                    {activeTrade.direction}:{' '}
                    <span className="text-brand-accent">{activeTrade.entryPrice}</span>
                    <br />
                    SL: <span className="text-status-danger">{activeTrade.stopLoss}</span> · TP:{' '}
                    <span className="text-brand-accent">{activeTrade.takeProfit}</span>
                  </div>
                </div>

                {/* Pre-Trade Risk Rules */}
                <div className="rounded-xl bg-surface-subtle p-3 border border-surface-elevated space-y-2">
                  <div className="flex items-center justify-between text-content-tertiary text-[11px]">
                    <span className="caption-4 text-content-primary font-semibold">
                      2. Pre-Trade Risk Guard
                    </span>
                    <span className="caption-4 text-brand-accent font-semibold">PASSED</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 caption-5 text-content-secondary">
                    <div className="bg-surface-canvas p-2 rounded border border-surface-secondary">
                      <span className="caption-5 text-content-tertiary block text-[10px]">
                        Position Sizing
                      </span>
                      <span className="caption-4 text-content-primary font-semibold">
                        {activeTrade.riskPercent}
                      </span>
                    </div>
                    <div className="bg-surface-canvas p-2 rounded border border-surface-secondary">
                      <span className="caption-5 text-content-tertiary block text-[10px]">
                        Computed Quantity
                      </span>
                      <span className="caption-4 text-brand-accent font-semibold">
                        {activeTrade.computedQty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulated Bybit Dispatch */}
                <div className="rounded-xl bg-brand-accentSubtle/60 p-3 border border-brand-accent/40 space-y-2">
                  <div className="flex items-center justify-between text-content-tertiary text-[11px]">
                    <span className="caption-4 text-brand-accent font-semibold">
                      3. Bybit Dispatch
                    </span>
                    <span className="caption-5 text-content-tertiary">
                      {activeTrade.exchange}
                    </span>
                  </div>
                  <div className="bg-surface-canvas p-2.5 rounded border border-surface-secondary caption-5 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-content-tertiary text-[11px]">Order:</span>
                      <span className="caption-4 text-content-primary font-semibold">
                        {activeTrade.orderPlaced}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-content-tertiary text-[11px]">Status:</span>
                      <span className="bg-brand-accent text-content-inverted caption-4 px-2 py-0.5 rounded font-semibold">
                        {activeTrade.fillStatus}
                      </span>
                    </div>
                    <div className="h-px bg-surface-secondary" />
                    <div className="flex justify-between items-center text-[10px] text-content-tertiary pt-0.5">
                      <span>Idempotency Key: Active</span>
                      <span>Order #{activeTrade.simulatedId}</span>
                    </div>
                  </div>
                </div>

                {/* Illustrative Footer Note */}
                <p className="caption-5 text-content-muted text-center pt-1">
                  Sample illustrative workflow · Real execution subject to Bybit account balance and market liquidity
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
