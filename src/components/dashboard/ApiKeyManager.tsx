"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShieldAlert, KeyRound, CheckCircle2, AlertTriangle, Trash2, Loader2, RefreshCw, ExternalLink } from "lucide-react";

export interface KeyResponse {
  id: string;
  exchange: string;
  api_key_masked: string;
  is_testnet: boolean;
  status: string;
  created_at?: string | null;
  last_used_at?: string | null;
}

export default function ApiKeyManager() {
  const [keys, setKeys] = useState<KeyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Form State
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [isTestnet, setIsTestnet] = useState(false);

  // Form Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isWithdrawalError, setIsWithdrawalError] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Disconnection Confirmation State
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  const fetchKeys = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await apiClient<KeyResponse[]>("/keys");
      setKeys(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load exchange keys";
      setFetchError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim() || !apiSecret.trim()) return;

    setSubmitting(true);
    setSubmitError(null);
    setIsWithdrawalError(false);
    setSubmitSuccess(null);

    try {
      const newKey = await apiClient<KeyResponse>("/keys", {
        method: "POST",
        body: JSON.stringify({
          exchange: "bybit",
          api_key: apiKey.trim(),
          api_secret: apiSecret.trim(),
          is_testnet: isTestnet,
        }),
      });

      setSubmitSuccess("Bybit API key connected successfully! Automated trade execution is active.");
      setApiKey("");
      setApiSecret("");
      
      // Update local state or refetch
      if (newKey && newKey.id) {
        setKeys((prev) => {
          const filtered = prev.filter((k) => k.id !== newKey.id);
          return [newKey, ...filtered];
        });
      } else {
        await fetchKeys();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to connect API key";
      setSubmitError(msg);
      if (msg.toLowerCase().includes("withdrawal")) {
        setIsWithdrawalError(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisconnect = async (keyId: string) => {
    setIsDisconnecting(true);
    try {
      await apiClient(`/keys/${keyId}`, { method: "DELETE" });
      setKeys((prev) => prev.filter((k) => k.id !== keyId));
      setDisconnectingId(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to revoke API key";
      alert(`Error revoking key: ${msg}`);
    } finally {
      setIsDisconnecting(false);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "Recently";
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Recently";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <KeyRound className="h-5 w-5 text-primary" />
          Exchange API Key Management
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Connect your Bybit exchange API keys with trade-only permissions to enable non-custodial signal execution.
        </p>
      </div>

      {/* Security Instruction Panel */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 sm:p-6 text-foreground">
        <div className="flex items-start gap-3">
          <ShieldAlert className="h-6 w-6 text-primary shrink-0 mt-0.5" />
          <div className="space-y-2 text-sm">
            <h3 className="font-semibold text-foreground">Mandatory Security Instructions for Bybit</h3>
            <p className="text-muted-foreground leading-relaxed">
              Tadex is strictly non-custodial and <strong>never requests withdrawal access</strong> to your exchange account. 
              When creating your API key on Bybit, follow these rules:
            </p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground font-medium">
              <li>Key Permission: <span className="text-foreground font-semibold">System-Generated API Key</span></li>
              <li>API Key Usage: <span className="text-foreground font-semibold">Read-Write (Orders & Positions)</span></li>
              <li>Withdrawal Permission: <span className="text-destructive font-bold underline">MUST BE DISABLED</span></li>
            </ul>
            <p className="text-xs text-muted-foreground pt-1">
              For your safety, Tadex automatically verifies permissions directly with Bybit upon submission and will 
              <strong> reject any key</strong> that has withdrawal permissions enabled.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Connected Keys + Connect Form */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Connected Keys Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Connected Exchange Keys</CardTitle>
                <CardDescription>Active API credentials registered for signal execution.</CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchKeys}
                disabled={isLoading}
                title="Refresh keys"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-10 text-muted-foreground space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Loading exchange keys...</p>
              </div>
            ) : fetchError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center justify-between">
                <span>{fetchError}</span>
                <Button variant="outline" size="sm" onClick={fetchKeys}>Retry</Button>
              </div>
            ) : keys.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <KeyRound className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">No exchange connected yet</p>
                  <p className="text-xs text-muted-foreground">Connect your Bybit API key using the form to start automated trading.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {keys.map((k) => (
                  <div
                    key={k.id}
                    className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground capitalize text-lg">{k.exchange}</span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          k.is_testnet
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-primary/10 text-primary"
                        }`}>
                          {k.is_testnet ? "Testnet" : "Mainnet"}
                        </span>
                        <span className="rounded-full bg-emerald-500/10 text-emerald-500 px-2 py-0.5 text-xs font-medium capitalize flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {k.status}
                        </span>
                      </div>

                      {disconnectingId !== k.id ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDisconnectingId(k.id)}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Disconnect
                        </Button>
                      ) : null}
                    </div>

                    {/* Masked Key Display */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/40 rounded-md p-2.5 font-mono">
                      <span>API Key:</span>
                      <span className="font-semibold text-foreground">{k.api_key_masked}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                      <span>Connected: {formatDate(k.created_at)}</span>
                      <span>Permissions: Trade Only (Read/Write)</span>
                    </div>

                    {/* Disconnection Confirmation Inline Banner */}
                    {disconnectingId === k.id && (
                      <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 mt-2 space-y-2">
                        <div className="flex items-center gap-2 text-xs font-semibold text-destructive">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          Confirm Disconnection
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Revoking this key will pause automated trading execution. Are you sure?
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDisconnect(k.id)}
                            disabled={isDisconnecting}
                            className="h-8 text-xs"
                          >
                            {isDisconnecting ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                Revoking...
                              </>
                            ) : (
                              "Yes, Revoke Key"
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDisconnectingId(null)}
                            disabled={isDisconnecting}
                            className="h-8 text-xs"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connect Exchange Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Connect Bybit Exchange</CardTitle>
            <CardDescription>Enter your trade-only API key and secret below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleConnect} className="space-y-4">
              {/* Error Alert Box */}
              {submitError && (
                <div
                  className={`rounded-lg border p-4 text-sm space-y-1.5 ${
                    isWithdrawalError
                      ? "border-destructive/50 bg-destructive/15 text-destructive-foreground"
                      : "border-destructive/30 bg-destructive/10 text-destructive"
                  }`}
                >
                  <div className="flex items-center gap-2 font-semibold text-destructive">
                    <ShieldAlert className="h-5 w-5 shrink-0" />
                    <span>{isWithdrawalError ? "Security Policy Rejection" : "API Verification Failed"}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-foreground">{submitError}</p>
                  {isWithdrawalError && (
                    <div className="pt-2 text-xs font-medium text-muted-foreground border-t border-destructive/20 mt-2">
                      💡 <strong>How to fix:</strong> Go to Bybit API Management, edit or recreate your key, and ensure the <strong>"Withdrawal"</strong> checkbox is completely unchecked.
                    </div>
                  )}
                </div>
              )}

              {/* Success Alert Box */}
              {submitSuccess && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-500 flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">API Key</label>
                <Input
                  type="text"
                  placeholder="e.g. 8x9F...A2b1"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                  disabled={submitting}
                  className="font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-foreground">API Secret</label>
                <Input
                  type="password"
                  placeholder="Enter your Bybit API Secret"
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  required
                  disabled={submitting}
                  className="font-mono text-sm"
                />
              </div>

              {/* Testnet Checkbox */}
              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isTestnet"
                  checked={isTestnet}
                  onChange={(e) => setIsTestnet(e.target.checked)}
                  disabled={submitting}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="isTestnet" className="text-xs font-medium text-foreground cursor-pointer">
                  Use Bybit Testnet environment (<span className="text-muted-foreground">testnet.bybit.com</span>)
                </label>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitting || !apiKey.trim() || !apiSecret.trim()}
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Verifying Bybit Permissions...
                    </>
                  ) : (
                    "Connect Bybit Account"
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                <span>Need help generating a key?</span>
                <a
                  href="https://www.bybit.com/app/user/api-management"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 font-medium"
                >
                  Bybit API Settings
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
