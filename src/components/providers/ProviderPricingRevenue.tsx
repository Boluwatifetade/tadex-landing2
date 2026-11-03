'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import {
  CheckIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  WalletIcon,
} from '@/components/ui/PhosphorIcons';

interface ProviderPricingRevenueProps {
  onOpenModal: () => void;
}

type CurrencyCode = 'NGN' | 'USD';

const NGN_PRICE_PRESETS = [15000, 30000, 50000, 100000, 150000];
const USD_PRICE_PRESETS = [15, 25, 50, 100, 150];
const SUBSCRIBER_PRESETS = [25, 50, 100, 250, 500];

export default function ProviderPricingRevenue({
  onOpenModal,
}: ProviderPricingRevenueProps) {
  const [currency, setCurrency] = useState<CurrencyCode>('NGN');
  const [planPrice, setPlanPrice] = useState<number>(30000);
  const [subscribers, setSubscribers] = useState<number>(100);

  const handleCurrencyChange = (nextCurrency: CurrencyCode) => {
    if (nextCurrency === currency) return;
    setCurrency(nextCurrency);
    if (nextCurrency === 'USD') {
      setPlanPrice(25);
    } else {
      setPlanPrice(30000);
    }
  };

  const symbol = currency === 'NGN' ? '₦' : '$';
  const minPrice = currency === 'NGN' ? 5000 : 5;
  const maxPrice = currency === 'NGN' ? 250000 : 250;
  const priceStep = currency === 'NGN' ? 5000 : 5;
  const pricePresets = currency === 'NGN' ? NGN_PRICE_PRESETS : USD_PRICE_PRESETS;

  const safePrice = Number.isFinite(planPrice) && planPrice >= 0 ? planPrice : 0;
  const perSubProviderShare = Math.round(safePrice * 0.9);
  const perSubTadexFee = Math.round(safePrice * 0.1);

  const monthlyProviderTakeHome = perSubProviderShare * subscribers;
  const monthlyTadexFee = perSubTadexFee * subscribers;
  const annualProviderTakeHome = monthlyProviderTakeHome * 12;

  const formatAmount = (amount: number) =>
    `${symbol}${amount.toLocaleString('en-US')}`;

  const formatPresetLabel = (preset: number) => {
    if (currency === 'NGN' && preset >= 1000) {
      return `₦${preset / 1000}k`;
    }
    return `${symbol}${preset}`;
  };

  const featuresIncluded = [
    'Automated billing and subscription management',
    'Access control (grant/remove VIP access based on payment status)',
    'Automated signal execution for your members',
    'Revenue dashboard and transaction history',
    'Reduced chargeback and dispute risk (centralized records)',
    'Support for multiple currencies and payment methods',
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-surface-canvas relative" id="pricing-revenue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <ScrollReveal>
          {/* Section Header */}
          <div className="max-w-[680px] mb-12 sm:mb-16">
            <h2 className="heading-2 text-content-primary mb-4">
              Simple, Transparent Revenue Share
            </h2>
            <p className="title-1 text-content-secondary">
              You set your prices. Tadex takes a small platform fee from each subscription.
            </p>
          </div>

          {/* Two-Column Revenue Split Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch mb-12">
            {/* Left Column: How You Earn & Interactive Revenue Calculator */}
            <div className="bg-surface-primary rounded-2xl border border-surface-elevated p-5 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-surface-subtle border border-surface-elevated text-brand-accent flex items-center justify-center flex-shrink-0">
                    <WalletIcon size={24} />
                  </div>
                  <div>
                    <h3 className="heading-5 text-content-primary">How You Earn</h3>
                    <p className="caption-4 text-content-tertiary">
                      Autonomous billing and settlement
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 body-6 text-content-secondary mb-6">
                  <p>
                    You create paid plans and set your own prices (e.g.,{' '}
                    <strong className="font-semibold text-content-primary">
                      ₦30,000/month VIP
                    </strong>
                    ,{' '}
                    <strong className="font-semibold text-content-primary">
                      ₦150,000/month VIP
                    </strong>
                    ,{' '}
                    <strong className="font-semibold text-content-primary">
                      $25/month VIP
                    </strong>
                    , etc.).
                  </p>
                  <p>
                    Members pay through Tadex checkout. Tadex processes the payment and splits it automatically:
                  </p>
                  <ul className="space-y-2 pl-1">
                    <li className="flex items-center gap-2 body-5 text-content-primary">
                      <span className="w-2 h-2 rounded-full bg-brand-accent flex-shrink-0" />
                      <span>You: ~90% of the subscription price</span>
                    </li>
                    <li className="flex items-center gap-2 body-5 text-content-secondary">
                      <span className="w-2 h-2 rounded-full bg-content-tertiary flex-shrink-0" />
                      <span>Tadex: ~10% platform fee</span>
                    </li>
                  </ul>
                </div>

                {/* Interactive Revenue Calculator Box (Nested radius: outer rounded-xl 12px, p-4 16px -> inner rounded-lg 8px) */}
                <div className="rounded-xl bg-surface-subtle p-4 sm:p-5 border border-surface-elevated space-y-5">
                  {/* Top Bar: Title + Currency Toggle */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="caption-3 text-content-primary">
                        Interactive Revenue Calculator
                      </div>
                      <div className="caption-5 text-content-tertiary">
                        Real World Monthly Example
                      </div>
                    </div>

                    <div
                      role="group"
                      aria-label="Calculator currency"
                      className="inline-flex items-center rounded-lg bg-surface-primary p-1 border border-surface-elevated"
                    >
                      <button
                        type="button"
                        onClick={() => handleCurrencyChange('NGN')}
                        className={`px-2.5 py-1 rounded-md caption-4 font-mono transition-colors ${
                          currency === 'NGN'
                            ? 'bg-brand-accent text-surface-canvas font-semibold'
                            : 'text-content-secondary hover:text-content-primary'
                        }`}
                      >
                        NGN (₦)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCurrencyChange('USD')}
                        className={`px-2.5 py-1 rounded-md caption-4 font-mono transition-colors ${
                          currency === 'USD'
                            ? 'bg-brand-accent text-surface-canvas font-semibold'
                            : 'text-content-secondary hover:text-content-primary'
                        }`}
                      >
                        USD ($)
                      </button>
                    </div>
                  </div>

                  {/* Control 1: Monthly Plan Price (Slider + Custom Input + Presets up to 150k+) */}
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label
                        htmlFor="provider-price-input"
                        className="caption-3 text-content-secondary"
                      >
                        Your Monthly VIP Price:
                      </label>
                      <div className="flex items-center gap-1.5 bg-surface-primary border border-surface-elevated rounded-lg px-2.5 py-1">
                        <span className="caption-3 text-brand-accent font-mono">
                          {symbol}
                        </span>
                        <input
                          id="provider-price-input"
                          type="number"
                          min={0}
                          max={currency === 'NGN' ? 5000000 : 10000}
                          step={priceStep}
                          value={planPrice}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPlanPrice(Number.isNaN(val) ? 0 : Math.max(0, val));
                          }}
                          aria-label="Monthly VIP subscription price"
                          className="w-24 sm:w-28 bg-transparent text-right font-mono body-4 text-brand-accent focus:outline-none"
                        />
                        <span className="caption-5 text-content-tertiary">/mo</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      aria-label="Adjust monthly subscription price"
                      min={minPrice}
                      max={maxPrice}
                      step={priceStep}
                      value={Math.min(Math.max(safePrice, minPrice), maxPrice)}
                      onChange={(e) => setPlanPrice(Number(e.target.value))}
                      className="w-full accent-brand-accent cursor-pointer h-1.5 bg-surface-elevated rounded-lg"
                    />

                    {/* Quick Price Presets (e.g. ₦15k, ₦30k, ₦50k, ₦100k, ₦150k) */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="caption-5 text-content-tertiary mr-1">
                        Quick set:
                      </span>
                      {pricePresets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setPlanPrice(preset)}
                          className={`px-2 py-1 rounded-md caption-5 font-mono border transition-colors ${
                            safePrice === preset
                              ? 'bg-brand-accentSubtle border-brand-accent text-brand-accent'
                              : 'bg-surface-primary border-surface-elevated text-content-secondary hover:text-content-primary'
                          }`}
                        >
                          {formatPresetLabel(preset)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Control 2: Active VIP Subscribers Slider + Presets */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <label
                        htmlFor="provider-subscribers-slider"
                        className="caption-3 text-content-secondary"
                      >
                        Active VIP Subscribers:
                      </label>
                      <span className="font-mono body-4 text-content-primary bg-surface-primary border border-surface-elevated px-2.5 py-1 rounded-lg">
                        {subscribers.toLocaleString('en-US')} members
                      </span>
                    </div>

                    <input
                      id="provider-subscribers-slider"
                      type="range"
                      aria-label="Adjust active VIP subscribers"
                      min={5}
                      max={1000}
                      step={5}
                      value={subscribers}
                      onChange={(e) => setSubscribers(Number(e.target.value))}
                      className="w-full accent-brand-accent cursor-pointer h-1.5 bg-surface-elevated rounded-lg"
                    />

                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="caption-5 text-content-tertiary mr-1">
                        Group size:
                      </span>
                      {SUBSCRIBER_PRESETS.map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setSubscribers(count)}
                          className={`px-2 py-1 rounded-md caption-5 font-mono border transition-colors ${
                            subscribers === count
                              ? 'bg-brand-accentSubtle border-brand-accent text-brand-accent'
                              : 'bg-surface-primary border-surface-elevated text-content-secondary hover:text-content-primary'
                          }`}
                        >
                          {count} VIPs
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-surface-elevated" />

                  {/* Per-Subscriber Split Line */}
                  <div className="flex flex-wrap items-center justify-between gap-2 caption-4 text-content-secondary">
                    <span>
                      Plan Price:{' '}
                      <strong className="text-brand-accent font-mono">
                        {formatAmount(safePrice)} / month
                      </strong>
                    </span>
                    <span className="font-mono caption-5 text-content-tertiary">
                      Per member: {formatAmount(perSubProviderShare)} you ·{' '}
                      {formatAmount(perSubTadexFee)} fee
                    </span>
                  </div>

                  {/* Responsive Split Output Cards: Stacks on mobile (grid-cols-1) so numbers never cram, side-by-side on sm+ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                    <div className="bg-brand-accentSubtle p-3.5 rounded-lg border border-brand-accent/40">
                      <span className="caption-5 text-content-secondary block">
                        YOU EARN (90%)
                      </span>
                      <span className="title-1 text-brand-accent block mt-0.5 break-words">
                        {formatAmount(monthlyProviderTakeHome)}
                        <span className="caption-5 text-content-secondary font-sans">
                          {' '}
                          /mo
                        </span>
                      </span>
                      <span className="caption-5 text-content-tertiary block mt-1">
                        {formatAmount(perSubProviderShare)} per subscriber/mo ·{' '}
                        {formatAmount(annualProviderTakeHome)}/yr
                      </span>
                    </div>

                    <div className="bg-surface-primary p-3.5 rounded-lg border border-surface-elevated">
                      <span className="caption-5 text-content-tertiary block">
                        TADEX FEE (~10%)
                      </span>
                      <span className="title-1 text-content-primary block mt-0.5 break-words">
                        {formatAmount(monthlyTadexFee)}
                        <span className="caption-5 text-content-tertiary font-sans">
                          {' '}
                          /mo
                        </span>
                      </span>
                      <span className="caption-5 text-content-tertiary block mt-1">
                        {formatAmount(perSubTadexFee)} per subscriber/mo · all inclusive infra
                      </span>
                    </div>
                  </div>

                  {/* Explicit Price Freedom Clarification */}
                  <div className="rounded-lg bg-surface-primary p-3 border border-surface-elevated caption-5 text-content-secondary">
                    <strong className="text-content-primary font-semibold">
                      100% Price Freedom — We Never Fix Your Price:
                    </strong>{' '}
                    This calculator is illustrative only. Tadex never caps or dictates your subscription price—you can charge whatever your signals are worth (whether ₦10,000, ₦100,000, ₦150,000+, or any USD amount).
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: What You Get for That Fee */}
            <div className="bg-surface-primary rounded-2xl border border-surface-elevated p-5 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-surface-subtle border border-surface-elevated text-brand-accent flex items-center justify-center flex-shrink-0">
                    <ShieldCheckIcon size={24} />
                  </div>
                  <div>
                    <h3 className="heading-5 text-content-primary">
                      What You Get for That Fee
                    </h3>
                    <p className="caption-4 text-content-tertiary">
                      Everything required to operate at scale
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {featuresIncluded.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-accentSubtle border border-brand-accent/40 text-brand-accent flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckIcon size={12} />
                      </div>
                      <span className="body-5 text-content-secondary">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="h-px bg-surface-elevated mb-6" />
                <div className="bg-brand-accentSubtle text-content-primary p-4 rounded-xl caption-4 border border-brand-accent/40">
                  <strong className="font-semibold text-brand-accent">
                    Transparent Guarantee:
                  </strong>{' '}
                  Tadex does not take a cut of your members’ trading PnL. Our fee is only on the subscription price you set.
                </div>
              </div>
            </div>
          </div>

          {/* CTA Under Section */}
          <div className="flex flex-col items-stretch sm:items-start">
            <button
              type="button"
              onClick={onOpenModal}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-accent hover:bg-brand-accentHover text-content-inverted button-md px-6 py-3 rounded-xl transition-[background-color,transform] duration-300 ease-weighted hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            >
              <span>Become a Provider</span>
              <ArrowRightIcon size={18} />
            </button>
            <p className="caption-4 text-content-tertiary mt-2 text-center sm:text-left">
              Talk to our team
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
