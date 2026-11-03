/**
 * Central Feature Flags — Tadex Web Application
 *
 * Governs frontend visibility and route-level access for modules and actions
 * whose backend contracts are not yet active in `/docs/API_CONTRACT.md`.
 *
 * Rule: All unverified or incomplete backend capabilities default to `false`
 * so non-functional features are never exposed as operational capabilities.
 */

export interface FeatureFlags {
  /** `/dashboard/automation` — User-level risk rules & signal pipeline config */
  riskControl: boolean;
  /** `/dashboard/signal-builder` — Provider Signal Builder module */
  signalBuilder: boolean;
  /** Google / Apple OAuth authentication buttons on `/login` and `/register` */
  oauthLogin: boolean;
  /** Passwordless OTP sign-in toggle on `/login` */
  otpLogin: boolean;
  /** `POST /trading/positions/{id}/close` — Manual market close from Positions table */
  manualPositionClose: boolean;
  /** `POST /trading/emergency-halt` — User-level emergency execution kill switch */
  emergencyHalt: boolean;
  /** `POST /auth/logout-all` — Global session revocation across all devices */
  revokeAllSessions: boolean;
}

export type FeatureFlagKey = keyof FeatureFlags;

export const FEATURE_FLAGS: Readonly<FeatureFlags> = Object.freeze({
  riskControl: process.env.NEXT_PUBLIC_FF_RISK_CONTROL === "true",
  signalBuilder: process.env.NEXT_PUBLIC_FF_SIGNAL_BUILDER === "true",
  oauthLogin: process.env.NEXT_PUBLIC_FF_OAUTH_LOGIN === "true",
  otpLogin: process.env.NEXT_PUBLIC_FF_OTP_LOGIN === "true",
  manualPositionClose: process.env.NEXT_PUBLIC_FF_MANUAL_POSITION_CLOSE === "true",
  emergencyHalt: process.env.NEXT_PUBLIC_FF_EMERGENCY_HALT === "true",
  revokeAllSessions: process.env.NEXT_PUBLIC_FF_REVOKE_ALL_SESSIONS === "true",
});

/**
 * Route prefixes gated behind central feature flags.
 * Direct navigation to a gated route when its flag is disabled must redirect
 * to `/dashboard` rather than exposing an unbuilt screen.
 */
export const FEATURE_GATED_ROUTES: Readonly<Record<string, FeatureFlagKey>> =
  Object.freeze({
    "/dashboard/automation": "riskControl",
    "/dashboard/risk-control": "riskControl",
    "/dashboard/signal-builder": "signalBuilder",
  });

export function isFeatureEnabled(
  flag: FeatureFlagKey,
  overrides?: Partial<FeatureFlags>
): boolean {
  if (overrides && typeof overrides[flag] === "boolean") {
    return overrides[flag] as boolean;
  }
  return Boolean(FEATURE_FLAGS[flag]);
}

export function getFeatureFlagForRoute(pathname: string): FeatureFlagKey | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  for (const [routePrefix, flagKey] of Object.entries(FEATURE_GATED_ROUTES)) {
    if (
      normalized === routePrefix ||
      normalized.startsWith(`${routePrefix}/`)
    ) {
      return flagKey;
    }
  }
  return null;
}

export function isRouteEnabled(
  pathname: string,
  overrides?: Partial<FeatureFlags>
): boolean {
  const gatingFlag = getFeatureFlagForRoute(pathname);
  if (!gatingFlag) {
    return true;
  }
  return isFeatureEnabled(gatingFlag, overrides);
}
