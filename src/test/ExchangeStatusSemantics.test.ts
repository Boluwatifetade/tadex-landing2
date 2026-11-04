import { describe, it, expect } from "vitest";
import {
  resolveExchangeStatus,
} from "@/lib/exchange-status";

describe("Exchange Status Semantics — Authoritative Telemetry Derivation", () => {
  const baseTime = 1700000000000; // Fixed epoch reference

  it("1. No active key: returns disconnected state with 'Not Connected' label and missing freshness", () => {
    // Empty key list
    const resEmpty = resolveExchangeStatus({ keys: [] });
    expect(resEmpty.state).toBe("disconnected");
    expect(resEmpty.label).toBe("Not Connected");
    expect(resEmpty.connectionHealth).toBe("disconnected");
    expect(resEmpty.dataFreshness).toBe("missing");
    expect(resEmpty.lastCommunicationAt).toBeNull();
    expect(resEmpty.communicationAgeSeconds).toBeNull();
    expect(resEmpty.lastSyncAt).toBeNull();
    expect(resEmpty.lastUpdatedAt).toBeNull();
    expect(resEmpty.activeKey).toBeNull();

    // Null key list
    const resNull = resolveExchangeStatus({ keys: null });
    expect(resNull.state).toBe("disconnected");
    expect(resNull.label).toBe("Not Connected");

    // Keys exist but none are active (e.g. inactive)
    const resInactive = resolveExchangeStatus({
      keys: [
        {
          id: "key-1",
          exchange: "bybit",
          api_key_masked: "****1234",
          is_testnet: false,
          status: "inactive",
        },
      ],
    });
    expect(resInactive.state).toBe("disconnected");
    expect(resInactive.label).toBe("BYBIT Inactive");
    expect(resInactive.connectionHealth).toBe("disconnected");
    expect(resInactive.dataFreshness).toBe("missing");
  });

  it("2. Active key with unverified connectivity (last_used_at: null): returns honest unverified state, NEVER labeled fresh", () => {
    const res = resolveExchangeStatus({
      keys: [
        {
          id: "key-1",
          exchange: "bybit",
          api_key_masked: "****1234",
          is_testnet: false,
          status: "active",
          last_used_at: null, // No recorded successful exchange communication
        },
      ],
      syncTimestamp: null,
      currentTime: baseTime,
    });

    expect(res.state).toBe("degraded");
    expect(res.label).toBe("BYBIT Configured (Unverified)");
    expect(res.connectionHealth).toBe("unverified");
    expect(res.dataFreshness).toBe("missing");
    expect(res.lastCommunicationAt).toBeNull();
    expect(res.communicationAgeSeconds).toBeNull();
    expect(res.lastSyncAt).toBeNull();
    expect(res.lastUpdatedAt).toBeNull();
    expect(res.state).not.toBe("fresh");
  });

  it("3. Verified communication (last_used_at present & recent) but NO sync timestamp: connection is connected, but freshness remains missing and state is degraded (never fresh)", () => {
    const recentCommTime = new Date(baseTime - 10_000).toISOString(); // 10s ago API call (well within 15m threshold)
    const res = resolveExchangeStatus({
      keys: [
        {
          id: "key-1",
          exchange: "bybit",
          api_key_masked: "****1234",
          is_testnet: false,
          status: "active",
          last_used_at: recentCommTime,
        },
      ],
      syncTimestamp: null, // NO account data synchronization has occurred!
      currentTime: baseTime,
    });

    // Connection is proven via recent last_used_at
    expect(res.connectionHealth).toBe("connected");
    expect(res.lastCommunicationAt).toEqual(new Date(recentCommTime));
    expect(res.communicationAgeSeconds).toBe(10);

    // Data freshness MUST remain missing/unverified per user rule
    expect(res.dataFreshness).toBe("missing");
    expect(res.lastSyncAt).toBeNull();
    expect(res.lastUpdatedAt).toBeNull();
    expect(res.syncAgeSeconds).toBeNull();

    // Visual beacon must NEVER be fresh without actual data sync
    expect(res.state).toBe("degraded");
    expect(res.state).not.toBe("fresh");
    expect(res.label).toBe("BYBIT Mainnet (Unsynced)");
  });

  it("4. Old last_used_at timestamp exceeding communication threshold: does NOT report connection health as connected, returns stale connection state", () => {
    // 25 minutes ago API call (> 15 minutes / DEFAULT_COMMUNICATION_THRESHOLD_MS)
    const oldCommTime = new Date(baseTime - 25 * 60 * 1000).toISOString();
    const res = resolveExchangeStatus({
      keys: [
        {
          id: "key-1",
          exchange: "bybit",
          api_key_masked: "****1234",
          is_testnet: false,
          status: "active",
          last_used_at: oldCommTime,
        },
      ],
      syncTimestamp: null,
      currentTime: baseTime,
    });

    // Mere presence of a past request does not prove current connectivity
    expect(res.connectionHealth).not.toBe("connected");
    expect(res.connectionHealth).toBe("stale");
    expect(res.lastCommunicationAt).toEqual(new Date(oldCommTime));
    expect(res.communicationAgeSeconds).toBe(25 * 60);

    // Visual badge reflects stale connection
    expect(res.state).toBe("stale");
    expect(res.label).toBe("BYBIT Mainnet (Connection Stale)");
    expect(res.dataFreshness).toBe("missing");

    // Also verify with custom threshold (e.g. 5 minutes)
    const resCustom = resolveExchangeStatus({
      keys: [
        {
          id: "key-1",
          exchange: "bybit",
          api_key_masked: "****1234",
          is_testnet: true,
          status: "active",
          last_used_at: new Date(baseTime - 6 * 60 * 1000).toISOString(), // 6 mins ago
        },
      ],
      communicationThresholdMs: 5 * 60 * 1000, // 5 mins threshold
      currentTime: baseTime,
    });

    expect(resCustom.connectionHealth).toBe("stale");
    expect(resCustom.state).toBe("stale");
    expect(resCustom.label).toBe("BYBIT Testnet (Connection Stale)");
  });

  it("5. Verified exchange connectivity AND fresh account-data sync timestamp: returns fresh state with exchange network name", () => {
    const recentCommTime = new Date(baseTime - 25_000).toISOString(); // 25s ago
    const recentSyncTime = new Date(baseTime - 15_000).toISOString(); // 15s ago account data sync

    const resMainnet = resolveExchangeStatus({
      keys: [
        {
          id: "key-1",
          exchange: "bybit",
          api_key_masked: "****1234",
          is_testnet: false,
          status: "active",
          last_used_at: recentCommTime,
        },
      ],
      syncTimestamp: recentSyncTime,
      currentTime: baseTime,
    });

    expect(resMainnet.state).toBe("fresh");
    expect(resMainnet.label).toBe("BYBIT Mainnet");
    expect(resMainnet.connectionHealth).toBe("connected");
    expect(resMainnet.dataFreshness).toBe("fresh");
    expect(resMainnet.lastCommunicationAt).toEqual(new Date(recentCommTime));
    expect(resMainnet.communicationAgeSeconds).toBe(25);
    expect(resMainnet.lastSyncAt).toEqual(new Date(recentSyncTime));
    expect(resMainnet.lastUpdatedAt).toEqual(new Date(recentSyncTime));
    expect(resMainnet.syncAgeSeconds).toBe(15);

    // Testnet verification
    const resTestnet = resolveExchangeStatus({
      keys: [
        {
          id: "key-2",
          exchange: "bybit",
          api_key_masked: "****5678",
          is_testnet: true,
          status: "active",
          last_used_at: recentCommTime,
        },
      ],
      syncTimestamp: recentSyncTime,
      currentTime: baseTime,
    });
    expect(resTestnet.state).toBe("fresh");
    expect(resTestnet.label).toBe("BYBIT Testnet");
    expect(resTestnet.connectionHealth).toBe("connected");
    expect(resTestnet.dataFreshness).toBe("fresh");
  });

  it("6. Stale account-data synchronization: returns stale state when sync timestamp is older than threshold (>60s)", () => {
    const recentCommTime = new Date(baseTime - 10_000).toISOString();
    const staleSyncTime = new Date(baseTime - 95_000).toISOString(); // 95s ago (>60s)

    const res = resolveExchangeStatus({
      keys: [
        {
          id: "key-1",
          exchange: "bybit",
          api_key_masked: "****1234",
          is_testnet: false,
          status: "active",
          last_used_at: recentCommTime,
        },
      ],
      syncTimestamp: staleSyncTime,
      currentTime: baseTime,
      staleThresholdMs: 60_000,
    });

    expect(res.state).toBe("stale");
    expect(res.label).toBe("BYBIT Stale (>60s)");
    expect(res.connectionHealth).toBe("connected");
    expect(res.dataFreshness).toBe("stale");
    expect(res.lastCommunicationAt).toEqual(new Date(recentCommTime));
    expect(res.lastSyncAt).toEqual(new Date(staleSyncTime));
    expect(res.lastUpdatedAt).toEqual(new Date(staleSyncTime));
    expect(res.syncAgeSeconds).toBe(95);
  });

  it("7. Failed exchange authentication: returns error state when key is revoked or invalid", () => {
    const resRevoked = resolveExchangeStatus({
      keys: [
        {
          id: "key-1",
          exchange: "bybit",
          api_key_masked: "****1234",
          is_testnet: false,
          status: "revoked",
        },
      ],
    });

    expect(resRevoked.state).toBe("error");
    expect(resRevoked.label).toBe("BYBIT Auth Failed");
    expect(resRevoked.connectionHealth).toBe("error");
    expect(resRevoked.dataFreshness).toBe("missing");

    const resInvalid = resolveExchangeStatus({
      keys: [
        {
          id: "key-2",
          exchange: "bybit",
          api_key_masked: "****5678",
          is_testnet: false,
          status: "invalid",
        },
      ],
    });
    expect(resInvalid.state).toBe("error");
    expect(resInvalid.label).toBe("BYBIT Auth Failed");
  });

  it("8. Active synchronization in-flight: returns syncing state with 'Syncing...' label", () => {
    const resSyncing = resolveExchangeStatus({
      isSyncing: true,
      keys: [
        {
          id: "key-1",
          exchange: "bybit",
          api_key_masked: "****1234",
          is_testnet: false,
          status: "active",
        },
      ],
    });

    expect(resSyncing.state).toBe("syncing");
    expect(resSyncing.label).toBe("Syncing...");
    expect(resSyncing.dataFreshness).toBe("syncing");
  });
});
