import type { FreshnessState } from "@/components/dashboard/SyncFreshnessBeacon";

export interface KeySummary {
  id: string;
  exchange: string;
  api_key_masked: string;
  is_testnet: boolean;
  status: string; // "active" | "inactive" | "invalid" | "revoked" | "error"
  created_at?: string | null;
  last_used_at?: string | null;
}

export type ConnectionHealth =
  | "disconnected"
  | "unverified"
  | "connected"
  | "stale"
  | "error";

export type DataFreshness =
  | "fresh"
  | "stale"
  | "missing"
  | "unverified"
  | "syncing";

export interface ResolvedExchangeStatus {
  /** Combined StatusBadge state variant */
  state: FreshnessState;
  /** Human-readable status label for top utility bar beacon */
  label: string;
  /** Authoritative connection health (derived strictly from activeKey.last_used_at vs communicationThresholdMs) */
  connectionHealth: ConnectionHealth;
  /** Authoritative data freshness (derived strictly from syncTimestamp) */
  dataFreshness: DataFreshness;
  /** The active key if present */
  activeKey: KeySummary | null;
  /** Timestamp of last verified exchange API communication (from activeKey.last_used_at) */
  lastCommunicationAt: Date | null;
  /** Age of last exchange communication in seconds, if timestamp present */
  communicationAgeSeconds: number | null;
  /** Timestamp of last successful account-data synchronization (from syncTimestamp) */
  lastSyncAt: Date | null;
  /** Authoritative timestamp of last successful account-data sync (null if unsynced) */
  lastUpdatedAt: Date | null;
  /** Age of last sync in seconds, if sync timestamp present */
  syncAgeSeconds: number | null;
}

export const DEFAULT_STALE_THRESHOLD_MS = 60_000; // 60 seconds for portfolio data freshness
export const DEFAULT_COMMUNICATION_THRESHOLD_MS = 900_000; // 15 minutes for exchange communication recency

export interface ResolveExchangeStatusOptions {
  keys?: KeySummary[] | null;
  /**
   * Authoritative account-data synchronization timestamp (e.g. balances, positions, orders).
   * Per architecture rules:
   * - activeKey.last_used_at establishes connection health (proof of exchange API communication).
   * - syncTimestamp establishes data freshness (proof that portfolio/account data is current).
   * If syncTimestamp is missing or null, dataFreshness MUST remain 'missing' / 'unverified'.
   */
  syncTimestamp?: Date | string | number | null;
  /** Reference current time (defaults to Date.now()) */
  currentTime?: Date | string | number | null;
  /** Freshness threshold for account-data in milliseconds (defaults to 60,000ms / 60 seconds) */
  staleThresholdMs?: number;
  /**
   * Explicit age threshold for treating the last successful exchange communication as recent.
   * If activeKey.last_used_at exceeds this threshold, connection health is reported as 'stale' (not 'connected').
   * Defaults to 900,000ms (15 minutes).
   */
  communicationThresholdMs?: number;
  /** If a synchronization call is currently in-flight */
  isSyncing?: boolean;
}

/**
 * Authoritatively resolves exchange connection health and data freshness
 * based strictly on verified exchange evidence from backend key telemetry
 * and account-data synchronization timestamps.
 *
 * Distinct signal semantics:
 * - `last_used_at` establishes evidence of successful exchange communication in the past.
 *   Its mere presence does not prove the exchange is currently connected.
 *   If it exceeds `communicationThresholdMs`, connection health is reported as 'stale', not 'connected'.
 * - `syncTimestamp` establishes evidence that portfolio/account data is current (Data Freshness).
 * - A successful API call does not imply balances or positions were synchronized.
 * - If no synchronization timestamp exists, freshness remains missing/unverified,
 *   even when connectivity is verified.
 */
export function resolveExchangeStatus(
  options: ResolveExchangeStatusOptions = {}
): ResolvedExchangeStatus {
  const {
    keys = [],
    syncTimestamp = null,
    currentTime = Date.now(),
    staleThresholdMs = DEFAULT_STALE_THRESHOLD_MS,
    communicationThresholdMs = DEFAULT_COMMUNICATION_THRESHOLD_MS,
    isSyncing = false,
  } = options;

  const now =
    typeof currentTime === "number"
      ? currentTime
      : currentTime
      ? new Date(currentTime).getTime()
      : Date.now();

  // Find active key
  const activeKey = keys?.find((k) => k.status === "active") ?? null;

  if (isSyncing) {
    return {
      state: "syncing",
      label: "Syncing...",
      connectionHealth: activeKey
        ? activeKey.last_used_at
          ? "connected"
          : "unverified"
        : "disconnected",
      dataFreshness: "syncing",
      activeKey,
      lastCommunicationAt: activeKey?.last_used_at
        ? new Date(activeKey.last_used_at)
        : null,
      communicationAgeSeconds: null,
      lastSyncAt: null,
      lastUpdatedAt: null,
      syncAgeSeconds: null,
    };
  }

  // 1. No keys configured at all
  if (!keys || keys.length === 0) {
    return {
      state: "disconnected",
      label: "Not Connected",
      connectionHealth: "disconnected",
      dataFreshness: "missing",
      activeKey: null,
      lastCommunicationAt: null,
      communicationAgeSeconds: null,
      lastSyncAt: null,
      lastUpdatedAt: null,
      syncAgeSeconds: null,
    };
  }

  // 2. No active key, check if there are failed/revoked/invalid keys
  if (!activeKey) {
    const errorKey = keys.find((k) =>
      ["invalid", "revoked", "error", "failed"].includes(k.status.toLowerCase())
    );
    if (errorKey) {
      const exchangeName = (errorKey.exchange || "Exchange").toUpperCase();
      return {
        state: "error",
        label: `${exchangeName} Auth Failed`,
        connectionHealth: "error",
        dataFreshness: "missing",
        activeKey: null,
        lastCommunicationAt: null,
        communicationAgeSeconds: null,
        lastSyncAt: null,
        lastUpdatedAt: null,
        syncAgeSeconds: null,
      };
    }

    // Keys exist but are inactive/disabled
    const inactiveKey = keys[0];
    const exchangeName = (inactiveKey.exchange || "Exchange").toUpperCase();
    return {
      state: "disconnected",
      label: `${exchangeName} Inactive`,
      connectionHealth: "disconnected",
      dataFreshness: "missing",
      activeKey: null,
      lastCommunicationAt: null,
      communicationAgeSeconds: null,
      lastSyncAt: null,
      lastUpdatedAt: null,
      syncAgeSeconds: null,
    };
  }

  // Active key is configured
  const exchangeName = (activeKey.exchange || "Exchange").toUpperCase();
  const networkName = activeKey.is_testnet ? "Testnet" : "Mainnet";

  // -----------------------------------------------------------------
  // SIGNAL 1: Connection Health (derived strictly from activeKey.last_used_at vs communicationThresholdMs)
  // -----------------------------------------------------------------
  let connectionHealth: ConnectionHealth = "unverified";
  let lastCommunicationAt: Date | null = null;
  let communicationAgeSeconds: number | null = null;

  if (activeKey.last_used_at) {
    const parsedComm = new Date(activeKey.last_used_at);
    if (!isNaN(parsedComm.getTime())) {
      lastCommunicationAt = parsedComm;
      const commAgeMs = Math.max(0, now - lastCommunicationAt.getTime());
      communicationAgeSeconds = Math.floor(commAgeMs / 1000);

      if (commAgeMs <= communicationThresholdMs) {
        connectionHealth = "connected";
      } else {
        // Exceeds communication recency threshold:
        // Presence of past request does not prove current connection.
        // Do not report connection health as connected.
        connectionHealth = "stale";
      }
    }
  }

  // -----------------------------------------------------------------
  // SIGNAL 2: Data Freshness (derived strictly from syncTimestamp)
  // last_used_at establishes exchange communication, NOT portfolio data freshness.
  // If no syncTimestamp exists, freshness MUST remain 'missing' or 'unverified'.
  // -----------------------------------------------------------------
  let dataFreshness: DataFreshness = "missing";
  let lastSyncAt: Date | null = null;
  let syncAgeSeconds: number | null = null;

  if (syncTimestamp) {
    const parsedSync = new Date(syncTimestamp);
    if (!isNaN(parsedSync.getTime())) {
      lastSyncAt = parsedSync;
      const syncAgeMs = Math.max(0, now - lastSyncAt.getTime());
      syncAgeSeconds = Math.floor(syncAgeMs / 1000);

      if (syncAgeMs > staleThresholdMs) {
        dataFreshness = "stale";
      } else {
        dataFreshness = "fresh";
      }
    }
  }

  // -----------------------------------------------------------------
  // COMBINED STATE & LABEL FOR TOP UTILITY BAR BEACON
  // -----------------------------------------------------------------

  // Case A: Connection is unverified (key saved in vault, but no exchange communication recorded)
  if (connectionHealth === "unverified") {
    return {
      state: "degraded",
      label: `${exchangeName} Configured (Unverified)`,
      connectionHealth: "unverified",
      dataFreshness: "missing",
      activeKey,
      lastCommunicationAt: null,
      communicationAgeSeconds: null,
      lastSyncAt: null,
      lastUpdatedAt: null,
      syncAgeSeconds: null,
    };
  }

  // Case B: Connection is stale (last_used_at exceeds communication recency threshold)
  // Request occurred in the past, but exchange is not currently verified as connected.
  if (connectionHealth === "stale") {
    return {
      state: "stale",
      label: `${exchangeName} ${networkName} (Connection Stale)`,
      connectionHealth: "stale",
      dataFreshness: lastSyncAt ? "stale" : "missing",
      activeKey,
      lastCommunicationAt,
      communicationAgeSeconds,
      lastSyncAt,
      lastUpdatedAt: lastSyncAt,
      syncAgeSeconds,
    };
  }

  // Case C: Connection is verified (connected), but NO account-data sync timestamp exists
  // Freshness MUST remain missing/unverified even though connectivity is verified.
  if (!lastSyncAt) {
    return {
      state: "degraded",
      label: `${exchangeName} ${networkName} (Unsynced)`,
      connectionHealth: "connected",
      dataFreshness: "missing",
      activeKey,
      lastCommunicationAt,
      communicationAgeSeconds,
      lastSyncAt: null,
      lastUpdatedAt: null,
      syncAgeSeconds: null,
    };
  }

  // Case D: Connection is verified, and syncTimestamp is stale (> staleThresholdMs)
  if (dataFreshness === "stale") {
    return {
      state: "stale",
      label: `${exchangeName} Stale (>60s)`,
      connectionHealth: "connected",
      dataFreshness: "stale",
      activeKey,
      lastCommunicationAt,
      communicationAgeSeconds,
      lastSyncAt,
      lastUpdatedAt: lastSyncAt,
      syncAgeSeconds,
    };
  }

  // Case E: Connection is verified, and syncTimestamp is fresh (<= staleThresholdMs)
  return {
    state: "fresh",
    label: `${exchangeName} ${networkName}`,
    connectionHealth: "connected",
    dataFreshness: "fresh",
    activeKey,
    lastCommunicationAt,
    communicationAgeSeconds,
    lastSyncAt,
    lastUpdatedAt: lastSyncAt,
    syncAgeSeconds,
  };
}
