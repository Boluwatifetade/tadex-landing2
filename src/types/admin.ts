export interface AdminOverviewUsers {
  total: number;
  active: number;
  suspended: number;
  banned: number;
}

export interface AdminOverviewProviders {
  total: number;
  active: number;
  suspended: number;
  deleted: number;
  verified: number;
  pending_applications: number;
  pending_verifications: number;
  by_status: Record<string, number>;
}

export interface AdminOverviewAccounts {
  total: number;
  bybit: number;
  active: number;
  revoked: number;
}

export interface AdminOverviewSubscriptions {
  total: number;
  active: number;
  trialing: number;
  cancelled: number;
  expired: number;
  by_status: Record<string, number>;
}

export interface AdminOverviewPayments {
  total: number;
  completed: number;
  pending: number;
  failed: number;
  by_status: Record<string, number>;
}

export interface AdminOverviewSystemState {
  kill_switch_enabled: boolean;
  kill_switch_status: string;
  trades_24h: number;
  failed_trades_24h: number;
  success_rate_24h: number;
  pending_tasks: number;
  processing_tasks: number;
}

export interface AdminOverviewResponse {
  users: AdminOverviewUsers;
  providers: AdminOverviewProviders;
  exchange_accounts: AdminOverviewAccounts;
  subscriptions: AdminOverviewSubscriptions;
  payments: AdminOverviewPayments;
  system_state: AdminOverviewSystemState;
}

// --- Provider Directory Models ---

export interface AdminProviderDetailOut {
  id: string;
  user_id?: string | null;
  user_email?: string | null;
  name: string;
  slug?: string | null;
  description?: string | null;
  status: "active" | "suspended" | "deleted" | string;
  is_active: boolean;
  is_suspended: boolean;
  suspended_at?: string | null;
  suspension_reason?: string | null;
  is_verified: boolean;
  verification_level: "unverified" | "basic" | "intermediate" | "advanced" | "premium" | "verified" | string;
  verification_submitted_at?: string | null;
  verification_approved_at?: string | null;
  telegram_channel_id?: string | null;
  telegram_username?: string | null;
  subscriber_count: number;
  total_signals_sent: number;
  win_rate?: number | null;
  created_at: string;
  updated_at?: string | null;
  deleted_at?: string | null;
}

export interface AdminProviderListResponse {
  items: AdminProviderDetailOut[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// --- Provider Application Models ---

export interface AdminProviderApplicationOut {
  id: string;
  user_id: string;
  user_email?: string | null;
  status: "pending" | "approved" | "rejected" | string;
  display_name: string;
  contact_email: string;
  bio?: string | null;
  experience_level: string;
  trading_focus: string[];
  referral_source?: string | null;
  submitted_at?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
  rejection_reason?: string | null;
  rejection_reason_code?: string | null;
  approval_time_seconds?: number | null;
  provider_activation_status?: string | null;
}

export interface AdminProviderApplicationListResponse {
  items: AdminProviderApplicationOut[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface AdminApproveApplicationRequest {
  notes?: string;
  provider_name?: string;
}

export interface AdminRejectApplicationRequest {
  reason: string;
  rejection_reason_code?: string;
}

// --- Verification Queue & Dossier Models ---

export interface HistoricalSignalDossier {
  symbol?: string;
  entry?: string | number;
  stop_loss?: string | number;
  take_profit?: string | number;
  datetime?: string;
  result?: string;
  original_message_link?: string;
  [key: string]: unknown;
}

export interface AdminVerificationEvidenceDossier {
  identity?: {
    full_name?: string;
    telegram_username?: string;
    telegram_channel_link?: string;
    email?: string;
    country_region?: string;
    display_name?: string;
    service_description?: string;
    [key: string]: unknown;
  };
  signal_operation?: {
    telegram_channel_link?: string;
    approx_subscriber_count?: number | string;
    time_providing_signals?: string;
    markets_traded?: string[];
    exchanges_supported?: string[];
    manual_or_automated?: string;
    typical_signal_frequency?: string;
    [key: string]: unknown;
  };
  trading_evidence?: {
    exchange_name?: string;
    exchange_uid?: string;
    trading_profile_link?: string;
    performance_report_link?: string;
    third_party_performance_link?: string;
    [key: string]: unknown;
  };
  historical_signals?: HistoricalSignalDossier[];
  declarations?: {
    owns_channel?: boolean;
    info_accurate?: boolean;
    understands_no_guarantee?: boolean;
    agrees_to_rules?: boolean;
    no_fabricated_results?: boolean;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface AdminVerificationQueueItem {
  provider_id: string;
  provider_name: string;
  provider_status: string;
  user_id?: string | null;
  user_email?: string | null;
  telegram_username?: string | null;
  verification_submitted_at?: string | null;
  dossier: AdminVerificationEvidenceDossier;
}

export interface AdminVerificationQueueResponse {
  items: AdminVerificationQueueItem[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface AdminVerifyProviderRequest {
  verification_level: "basic" | "intermediate" | "advanced" | "premium" | "verified" | string;
  notes?: string;
  risk_flags?: string;
}

export interface AdminRejectVerificationRequest {
  reason: string;
}

export interface AdminSuspendProviderRequest {
  reason: string;
}
