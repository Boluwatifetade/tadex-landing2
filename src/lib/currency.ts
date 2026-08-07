export interface PlanPriceItem {
  currency: string;
  amount_cents: number;
  amount: number;
  is_override?: boolean;
}

export interface PlanOutLike {
  id: string;
  currency: string;
  monthly_price: number;
  supported_currencies?: string[];
  prices?: PlanPriceItem[];
}

export const ZERO_DECIMAL_CURRENCIES = new Set([
  "JPY", "KRW", "UGX", "VND", "PYG", "CLP", "RWF", "BIF",
  "DJF", "GNF", "ISK", "KMF", "XAF", "XOF", "XPF"
]);

export function formatCurrencyAmount(amount: number, currCode: string): string {
  const symbols: Record<string, string> = {
    NGN: "₦",
    USD: "$",
    USDT: "USDT ",
    EUR: "€",
    GBP: "£",
    KES: "KSh ",
    GHS: "GH₵ ",
    JPY: "¥",
  };
  const upperCurr = (currCode || "NGN").trim().toUpperCase();
  const sym = symbols[upperCurr] || `${upperCurr} `;
  const isZeroDecimal = ZERO_DECIMAL_CURRENCIES.has(upperCurr);
  const decimals = isZeroDecimal ? 0 : 2;
  const num = typeof amount === "number" ? amount : 0;
  return `${sym}${num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

export function resolvePlanPrice(plan: PlanOutLike, selectedCurrency: string) {
  const targetCurr = (selectedCurrency || "USD").toUpperCase();

  // 1. Check matching entry in prices[]
  const matchingItem = plan.prices?.find(
    (p) => (p.currency || "").toUpperCase() === targetCurr
  );

  if (matchingItem) {
    return {
      currency: targetCurr,
      amount: matchingItem.amount,
      isSupported: true,
    };
  }

  // 2. Check if base currency matches target currency
  const baseCurr = (plan.currency || "NGN").toUpperCase();
  if (baseCurr === targetCurr) {
    return {
      currency: baseCurr,
      amount: plan.monthly_price,
      isSupported: true,
    };
  }

  // 3. Target currency is NOT supported by this plan.
  // Return the plan's actual base price with isSupported = false!
  return {
    currency: baseCurr,
    amount: plan.monthly_price,
    isSupported: false,
  };
}
