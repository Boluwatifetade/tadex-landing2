'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRightIcon,
  PlayIcon,
  ShieldCheckIcon,
  LightningIcon,
  PulseIcon,
} from '@/components/ui/PhosphorIcons';

interface TradeScenario {
  id: string;
  tabLabel: string;
  pair: string;
  channel: string;
  direction: string;
  buyZone: string;
  stopLoss: string;
  tp1: string;
  tp2: string;
  riskPercent: string;
  drawdownGuard: string;
  exchange: string;
  exchangeShort: string;
  orderPlaced: string;
  fillStatus: string;
  latency: string;
  summarySignal: string;
}

const TRADE_SCENARIOS: TradeScenario[] = [
  {
    id: 'btc',
    tabLabel: 'BTC/USDT',
    pair: 'BTC/USDT',
    channel: '@AlphaSignals VIP',
    direction: 'BUY ZONE',
    buyZone: '$77,850',
    stopLoss: '$76,400',
    tp1: '$79,500',
    tp2: '$81,200',
    riskPercent: '2.0% Account Risk',
    drawdownGuard: 'Safe (OK)',
    exchange: 'Bybit Futures',
    exchangeShort: 'Bybit',
    orderPlaced: 'Market Buy BTCUSDT',
    fillStatus: 'FILLED @ $77,852',
    latency: '14ms',
    summarySignal: 'BTC Long',
  },
  {
    id: 'eth',
    tabLabel: 'ETH/USDT',
    pair: 'ETH/USDT',
    channel: '@LagosWhales VIP',
    direction: 'BUY ZONE',
    buyZone: '$2,262',
    stopLoss: '$2,195',
    tp1: '$2,340',
    tp2: '$2,420',
    riskPercent: '1.5% Account Risk',
    drawdownGuard: 'Safe (OK)',
    exchange: 'Binance Futures',
    exchangeShort: 'Binance',
    orderPlaced: 'Market Buy ETHUSDT',
    fillStatus: 'FILLED @ $2,263',
    latency: '18ms',
    summarySignal: 'ETH Long',
  },
  {
    id: 'sol',
    tabLabel: 'SOL/USDT',
    pair: 'SOL/USDT',
    channel: '@NairobiPerps VIP',
    direction: 'BUY ZONE',
    buyZone: '$94.20',
    stopLoss: '$91.50',
    tp1: '$98.00',
    tp2: '$102.50',
    riskPercent: '1.0% Account Risk',
    drawdownGuard: 'Safe (OK)',
    exchange: 'OKX Perpetual',
    exchangeShort: 'OKX',
    orderPlaced: 'Market Buy SOLUSDT',
    fillStatus: 'FILLED @ $94.24',
    latency: '16ms',
    summarySignal: 'SOL Long',
  },
];

export default function Hero() {
  const YOUTUBE_DEMO_URL = 'https://youtu.be/7cLw92poCss';
  const [activeId, setActiveId] = useState<string>('btc');

  const activeTrade =
    TRADE_SCENARIOS.find((s) => s.id === activeId) || TRADE_SCENARIOS[0];

  return (
    <section className="relative bg-surface-canvas text-content-primary overflow-hidden pt-28 pb-20 lg:pt-32 lg:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & Actions */}
          <div className="lg:col-span-7 text-left">
            {/* H1 Headline: Capped at 680px with left-to-right #FFFFFF -> #9B9B9B text gradient per B5 */}
            <h1 className="heading-1 hero-heading-gradient max-w-[680px] mb-6">
              Automate Your Trading Signals.{' '}
              <span className="block mt-2">No More Manual Copying.</span>
            </h1>

            {/* Subheadline: Capped at 680px per B5 */}
            <p className="title-1 text-content-secondary max-w-[680px] mb-8">
              Connect your Telegram groups and exchanges. Tadex reads signals and places trades for you 24/7 so you do not miss entries or make costly mistakes.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 mb-6">
              <div className="flex flex-col items-center sm:items-start">
                <Link href="#pricing" className="w-full sm:w-auto">
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-md px-6 py-3 rounded-xl transition-[background-color,transform] duration-300 ease-weighted hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
                  >
                    <span>Start Free</span>
                    <ArrowRightIcon size={18} />
                  </button>
                </Link>
                <span className="caption-4 text-content-tertiary mt-2">
                  No credit card required
                </span>
              </div>

              <div className="flex flex-col items-center sm:items-start">
                <Link
                  href={YOUTUBE_DEMO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <button
                    type="button"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-primary hover:bg-surface-secondary text-content-primary border border-surface-elevated button-md px-6 py-3 rounded-xl transition-[background-color,transform] duration-300 ease-weighted hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface-canvas"
                  >
                    <PlayIcon size={16} className="text-brand-accent" />
                    <span>Watch 2‑min Demo</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Proof Signal / Trust Line */}
            <div className="pt-2 caption-1 text-content-tertiary flex flex-wrap items-center gap-2">
              <ShieldCheckIcon size={16} className="text-brand-accent" />
              <span>99.9% uptime</span>
              <span className="text-content-muted" aria-hidden="true">·</span>
              <span>2,000+ users</span>
              <span className="text-content-muted" aria-hidden="true">·</span>
              <span>Instant setup</span>
            </div>
          </div>

          {/* Right Column: Interactive Flat-Surface Terminal Product Visual */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Outer Terminal Card: rounded-2xl (16px) with p-2 (8px) gap -> inner elements rounded-lg (8px) per B3 */}
              <div className="rounded-2xl border border-surface-elevated bg-surface-primary p-2">
                {/* Terminal Header Bar */}
                <div className="flex items-center justify-between px-3 py-2 bg-surface-subtle rounded-lg mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-status-danger inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-status-warning inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-status-success inline-block" />
                    <span className="caption-4 font-mono text-content-tertiary ml-2">
                      tadex-execution-node v2.4
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 caption-3 font-mono text-brand-accent bg-brand-accentSubtle px-2 py-1 rounded border border-brand-accent/30">
                    <PulseIcon size={14} />
                    <span>ENGINE LIVE</span>
                  </div>
                </div>

                {/* Interactive Signal Pair Switcher */}
                <div
                  role="tablist"
                  aria-label="Live signal execution examples"
                  className="grid grid-cols-3 gap-1.5 px-2 pt-1 pb-2"
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
                        className={`py-1.5 px-2.5 rounded-lg font-mono caption-3 transition-colors duration-200 ease-weighted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${
                          isSelected
                            ? 'bg-surface-secondary text-brand-accent border border-brand-accent/40'
                            : 'bg-surface-subtle text-content-tertiary hover:text-content-primary border border-surface-elevated'
                        }`}
                      >
                        {scenario.tabLabel}
                      </button>
                    );
                  })}
                </div>

                {/* Terminal Content Body */}
                <div className="p-2 font-mono space-y-3">
                  {/* Step 1: Telegram Signal Ingest (outer rounded-xl 12px, p-3 12px -> inner rounded 4px) */}
                  <div className="rounded-xl bg-surface-subtle p-3 border border-surface-elevated">
                    <div className="flex items-center justify-between text-content-tertiary mb-2">
                      <span className="caption-3 text-brand-accent flex items-center gap-1.5">
                        <LightningIcon size={14} />
                        <span>1. Ingest Signal</span>
                      </span>
                      <span className="caption-5 text-content-tertiary">
                        {activeTrade.channel}
                      </span>
                    </div>
                    <div className="text-content-secondary bg-surface-canvas p-3 rounded border border-surface-secondary caption-5">
                      <span className="text-status-warning">{activeTrade.pair}</span>{' '}
                      {activeTrade.direction}:{' '}
                      <span className="text-brand-accent">{activeTrade.buyZone}</span>
                      <br />
                      SL: <span className="text-status-danger">{activeTrade.stopLoss}</span> · TP1:{' '}
                      <span className="text-brand-accent">{activeTrade.tp1}</span> · TP2:{' '}
                      <span className="text-brand-accent">{activeTrade.tp2}</span>
                    </div>
                  </div>

                  {/* Step 2: Risk Guard Verification */}
                  <div className="rounded-xl bg-surface-subtle p-3 border border-surface-elevated">
                    <div className="flex items-center justify-between text-content-tertiary mb-2">
                      <span className="caption-3 text-content-primary">
                        2. Pre Trade Risk Rules
                      </span>
                      <span className="caption-3 text-brand-accent">PASSED</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 caption-5 text-content-secondary">
                      <div className="bg-surface-canvas p-2 rounded border border-surface-secondary">
                        <span className="caption-5 text-content-tertiary block">
                          Position Sizing
                        </span>
                        <span className="caption-3 text-content-primary">
                          {activeTrade.riskPercent}
                        </span>
                      </div>
                      <div className="bg-surface-canvas p-2 rounded border border-surface-secondary">
                        <span className="caption-5 text-content-tertiary block">
                          Max Drawdown Guard
                        </span>
                        <span className="caption-3 text-brand-accent">
                          {activeTrade.drawdownGuard}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Exchange Execution Dispatch */}
                  <div className="rounded-xl bg-brand-accentSubtle p-3 border border-brand-accent/40">
                    <div className="flex items-center justify-between text-content-tertiary mb-2">
                      <span className="caption-3 text-brand-accent">
                        3. Exchange Dispatch
                      </span>
                      <span className="caption-5 text-content-secondary">
                        Latency: {activeTrade.latency}
                      </span>
                    </div>
                    <div className="bg-surface-canvas p-3 rounded border border-surface-secondary caption-5 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-content-tertiary">Target Exchange:</span>
                        <span className="caption-3 text-content-primary">
                          {activeTrade.exchange}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-content-tertiary">Order Placed:</span>
                        <span className="caption-3 text-brand-accent">
                          {activeTrade.orderPlaced}
                        </span>
                      </div>
                      <div className="h-px bg-surface-secondary" />
                      <div className="flex justify-between items-center">
                        <span className="text-content-tertiary">Execution Status:</span>
                        <span className="bg-brand-accent text-content-inverted caption-3 px-2 py-0.5 rounded">
                          {activeTrade.fillStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Flat Summary Bar (no background gradient per B4) */}
                  <div className="bg-surface-secondary border border-surface-elevated rounded-lg p-3 text-center">
                    <div className="caption-3 text-content-primary">
                      <span className="text-content-tertiary">Signal:</span>{' '}
                      <span className="text-status-warning">{activeTrade.summarySignal}</span>
                      <span className="text-content-muted mx-2">→</span>
                      <span className="text-content-tertiary">Exchange:</span>{' '}
                      <span className="text-content-primary">{activeTrade.exchangeShort}</span>
                      <span className="text-content-muted mx-2">→</span>
                      <span className="text-content-tertiary">Status:</span>{' '}
                      <span className="text-brand-accent">Filled</span>
                    </div>
                    <p className="caption-5 text-content-muted mt-1.5">
                      Sample illustrative execution · Not live market data or investment advice
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}