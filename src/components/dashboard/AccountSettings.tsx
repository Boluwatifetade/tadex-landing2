"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Settings, KeyRound, ShieldAlert, CheckCircle2, AlertTriangle, Loader2, LogOut, Send, Unlink, ExternalLink, Mail, ShieldCheck, ShieldX } from "lucide-react";
import { useEffect, useCallback } from "react";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function AccountSettings() {
  const router = useRouter();
  const { clear } = useAuthStore();

  // Change Password State
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  // User Identity & Telegram State
  const [userInfo, setUserInfo] = useState<{
    id?: string;
    email?: string;
    status?: string;
    email_verified?: boolean;
    telegram_linked?: boolean;
    telegram_username?: string | null;
  } | null>(null);

  const [linkLoading, setLinkLoading] = useState(false);
  const [deepLinkUrl, setDeepLinkUrl] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);

  // Unlink State
  const [isUnlinking, setIsUnlinking] = useState(false);
  const [unlinkPassword, setUnlinkPassword] = useState("");
  const [unlinkConfirmOpen, setUnlinkConfirmOpen] = useState(false);
  const [unlinkError, setUnlinkError] = useState<string | null>(null);
  const [unlinkSuccess, setUnlinkSuccess] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiClient<any>("/me");
      if (data) setUserInfo(data);
    } catch {
      /* non-blocking */
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleRequestTelegramLink = async () => {
    setLinkLoading(true);
    setLinkError(null);
    try {
      const res = await apiClient<{ deep_link: string }>("/auth/telegram-link/request", {
        method: "POST",
      });
      if (res?.deep_link) {
        setDeepLinkUrl(res.deep_link);
      }
    } catch (err: any) {
      setLinkError(err?.message || "Failed to generate Telegram connection link.");
    } finally {
      setLinkLoading(false);
    }
  };

  const handleUnlinkTelegram = async () => {
    if (!unlinkPassword) {
      setUnlinkError("Current password is required to unlink Telegram.");
      return;
    }
    setIsUnlinking(true);
    setUnlinkError(null);
    setUnlinkSuccess(null);
    try {
      await apiClient("/auth/telegram/unlink", {
        method: "POST",
        body: JSON.stringify({ current_password: unlinkPassword }),
      });
      setUnlinkSuccess("Telegram unlinked successfully. Active trading paused.");
      setUnlinkConfirmOpen(false);
      setUnlinkPassword("");
      await refreshUser();
    } catch (err: any) {
      setUnlinkError(err?.message || "Failed to unlink Telegram account.");
    } finally {
      setIsUnlinking(false);
    }
  };

  // Logout All State
  const [isConfirmingLogoutAll, setIsConfirmingLogoutAll] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);
  const [logoutAllError, setLogoutAllError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onPasswordSubmit = async (values: ChangePasswordFormValues) => {
    setIsSubmittingPassword(true);
    setPasswordSuccess(null);
    setPasswordError(null);

    try {
      await apiClient("/auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          current_password: values.currentPassword,
          new_password: values.newPassword,
        }),
      });

      setPasswordSuccess(
        "Your password has been changed successfully. You've been logged out of all other devices."
      );
      reset();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to change password";
      setPasswordError(msg);
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const handleLogoutAll = async () => {
    setIsLoggingOutAll(true);
    setLogoutAllError(null);

    try {
      await apiClient("/auth/logout-all", { method: "POST" });
      clear();
      router.push("/login");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to log out of all devices";
      setLogoutAllError(msg);
      setIsLoggingOutAll(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Account & Security Settings
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your password credentials and active session security.
        </p>
      </div>

      {/* Main Settings Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Section 1: Change Password Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base font-semibold">Change Password</CardTitle>
                <CardDescription>Update your login credentials across Tadex services.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
              {/* Success Alert */}
              {passwordSuccess && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-500 flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{passwordSuccess}</span>
                </div>
              )}

              {/* Error Alert */}
              {passwordError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{passwordError}</span>
                </div>
              )}

              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Current Password</label>
                <Input
                  type="password"
                  placeholder="Enter your current password"
                  {...register("currentPassword")}
                  disabled={isSubmittingPassword}
                  className="text-sm"
                />
                {errors.currentPassword && (
                  <p className="text-xs text-destructive">{errors.currentPassword.message}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">New Password</label>
                <Input
                  type="password"
                  placeholder="Minimum 8 characters"
                  {...register("newPassword")}
                  disabled={isSubmittingPassword}
                  className="text-sm"
                />
                {errors.newPassword && (
                  <p className="text-xs text-destructive">{errors.newPassword.message}</p>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Confirm New Password</label>
                <Input
                  type="password"
                  placeholder="Re-enter your new password"
                  {...register("confirmPassword")}
                  disabled={isSubmittingPassword}
                  className="text-sm"
                />
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmittingPassword}
                  className="w-full text-xs font-semibold py-2.5 flex items-center justify-center gap-2"
                >
                  {isSubmittingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Section 0: Identity & Telegram Connection Card */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-base font-semibold">Account Identity & Telegram Integration</CardTitle>
                <CardDescription>Authoritative trading identity, email verification, and bot connectivity.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Account Email & Verification State */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5" /> Account Email
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    userInfo?.email_verified
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-amber-500/10 text-amber-500"
                  }`}>
                    {userInfo?.email_verified ? "Email Verified" : "Unverified"}
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground truncate" title={userInfo?.email}>
                  {userInfo?.email || "Loading..."}
                </p>
                <p className={`text-xs ${userInfo?.email_verified ? "text-emerald-500" : "text-amber-500 font-medium"}`}>
                  {userInfo?.email_verified
                    ? "✓ Authoritative financial execution authorized"
                    : "⚠️ Action Required: Email Unverified. Trading Disabled"}
                </p>
              </div>

              {/* Telegram Connection State */}
              <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                    <Send className="h-3.5 w-3.5 text-sky-400" /> Telegram Account
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    userInfo?.telegram_linked
                      ? "bg-sky-500/10 text-sky-400"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {userInfo?.telegram_linked ? "Connected" : "Not Linked"}
                  </span>
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {userInfo?.telegram_linked
                    ? `@${userInfo?.telegram_username || "Connected Telegram ID"}`
                    : "No Telegram account paired"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {userInfo?.telegram_linked
                    ? "Receiving instant execution signals & trade alerts"
                    : "Pair with @TadexBot to execute signals on Telegram"}
                </p>
              </div>
            </div>

            {/* Telegram Actions */}
            <div className="pt-2 border-t border-border space-y-4">
              {linkError && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{linkError}</span>
                </div>
              )}

              {unlinkSuccess && (
                <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-500 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{unlinkSuccess}</span>
                </div>
              )}

              {!userInfo?.telegram_linked ? (
                <div className="space-y-3">
                  {!deepLinkUrl ? (
                    <Button
                      onClick={handleRequestTelegramLink}
                      disabled={linkLoading}
                      className="text-xs font-semibold flex items-center gap-2"
                    >
                      {linkLoading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Generating Connection Link...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Connect Telegram Account
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 space-y-3">
                      <div className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                        <Send className="h-4 w-4" /> Single-Use Pairing Link (Valid for 10 minutes)
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Click the button below to launch Telegram and securely connect your account without exposing credentials:
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href={deepLinkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-600 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> Open Telegram to Link
                        </a>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeepLinkUrl(null)}
                          className="text-xs h-8"
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {!unlinkConfirmOpen ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setUnlinkConfirmOpen(true);
                        setUnlinkError(null);
                        setUnlinkSuccess(null);
                      }}
                      className="text-xs font-semibold flex items-center gap-2 text-destructive hover:bg-destructive/10"
                    >
                      <Unlink className="h-3.5 w-3.5" />
                      Disconnect Telegram Account
                    </Button>
                  ) : (
                    <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 space-y-3 max-w-md">
                      <div className="text-xs font-bold text-destructive flex items-center gap-1.5">
                        <AlertTriangle className="h-4 w-4" /> Confirm Disconnect Telegram
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Disconnecting Telegram will deactivate trade dispatch and pause all executions until re-linked. Enter your current password to confirm:
                      </p>
                      {unlinkError && (
                        <div className="text-xs text-destructive font-medium">{unlinkError}</div>
                      )}
                      <Input
                        type="password"
                        placeholder="Current password"
                        value={unlinkPassword}
                        onChange={(e) => setUnlinkPassword(e.target.value)}
                        className="text-xs h-9 bg-background"
                        disabled={isUnlinking}
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleUnlinkTelegram}
                          disabled={isUnlinking || !unlinkPassword}
                          className="text-xs h-8"
                        >
                          {isUnlinking ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin mr-1" />
                              Disconnecting...
                            </>
                          ) : (
                            "Confirm Disconnect"
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUnlinkConfirmOpen(false);
                            setUnlinkPassword("");
                          }}
                          disabled={isUnlinking}
                          className="text-xs h-8"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Log Out Everywhere / Active Sessions */}
        <Card className="flex flex-col justify-between border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              <div>
                <CardTitle className="text-base font-semibold">Active Sessions & Security</CardTitle>
                <CardDescription>Revoke access tokens across all devices and browsers.</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 space-y-2 text-xs text-foreground">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
                <LogOut className="h-4 w-4 text-destructive" />
                Log Out of All Devices
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                If you suspect unauthorized access or want to terminate all active sessions, logging out everywhere will invalidate all refresh tokens across all mobile devices, web browsers, and locations.
              </p>
              <p className="text-destructive font-medium pt-1">
                Note: This action will immediately terminate your current session and redirect you to the login screen.
              </p>
            </div>

            {logoutAllError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center justify-between">
                <span>{logoutAllError}</span>
              </div>
            )}

            {!isConfirmingLogoutAll ? (
              <Button
                variant="destructive"
                onClick={() => setIsConfirmingLogoutAll(true)}
                className="w-full text-xs font-semibold py-2.5 flex items-center justify-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Log Out of All Devices
              </Button>
            ) : (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  Confirm Log Out Everywhere
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Are you sure you want to terminate all active sessions? You will be logged out immediately.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogoutAll}
                    disabled={isLoggingOutAll}
                    className="flex-1 text-xs h-9"
                  >
                    {isLoggingOutAll ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                        Logging Out Everywhere...
                      </>
                    ) : (
                      "Yes, Log Out Everywhere"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsConfirmingLogoutAll(false)}
                    disabled={isLoggingOutAll}
                    className="h-9 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
