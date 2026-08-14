export interface ProviderDetailOut {
  id: string;
  name: string;
  description?: string | null;
  email?: string | null;
  status: "active" | "suspended" | "deleted" | string;
  is_verified: boolean;
  verification_level: "unverified" | "basic" | "intermediate" | "advanced" | string;
  verification_submitted_at?: string | null;
  verification_approved_at?: string | null;
  total_signals_sent: number;
  win_rate?: number | null;
  subscriber_count: number;
  created_at?: string | null;
}

export interface ProviderApplicationOut {
  id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected" | string;
  display_name: string;
  contact_email: string;
  bio?: string | null;
  experience_level: string;
  trading_focus: string[];
  referral_source: string;
  submitted_at: string;
  reviewed_at?: string | null;
  rejection_reason?: string | null;
}

export interface ProviderMeResponse {
  role: "provider" | "applicant";
  provider?: ProviderDetailOut | null;
  application?: ProviderApplicationOut | null;
}

export interface ProviderApplyRequest {
  display_name: string;
  contact_email: string;
  bio?: string;
  experience_level: string;
  trading_focus: string[];
  referral_source: string;
  terms_accepted: boolean;
}

export interface ProviderPlanOut {
  id: string;
  provider_id: string;
  name: string;
  description?: string | null;
  monthly_price_cents: number;
  currency: string;
  max_duration_days: number;
  features_json?: Record<string, any>;
  is_active: boolean;
  status: "draft" | "active" | "paused" | "archived" | string;
  public_plan_code?: number | null;
  status_updated_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface ProviderPlanCreateRequest {
  name: string;
  description?: string;
  monthly_price_cents: number;
  currency: string;
  max_duration_days: number;
  features_json?: Record<string, any>;
  is_active: boolean;
  status?: "draft" | "active" | "paused" | "archived";
}

export interface ProviderPlanUpdateRequest {
  name?: string;
  description?: string;
  monthly_price_cents?: number;
  currency?: string;
  max_duration_days?: number;
  features_json?: Record<string, any>;
  is_active?: boolean;
  status?: "draft" | "active" | "paused" | "archived";
}

export interface ProviderPlanDeleteResponse {
  message: string;
  plan_id: string;
  status: string;
}

export interface VerificationIdentity {
  full_name: string;
  telegram_username: string;
  telegram_channel_link: string;
  email: string;
  country_region: string;
  display_name: string;
  service_description: string;
}

export interface VerificationSignalOperation {
  telegram_channel_link: string;
  approx_subscriber_count: number;
  time_providing_signals: string;
  markets_traded: string[];
  exchanges_supported: string[];
  manual_or_automated: string;
  typical_signal_frequency: string;
}

export interface VerificationTradingEvidence {
  exchange_name?: string;
  exchange_uid?: string;
  trading_profile_link?: string;
  performance_report_link?: string;
  third_party_performance_link?: string;
}

export interface HistoricalSignalItem {
  symbol: string;
  entry: string;
  stop_loss: string;
  take_profit: string;
  datetime: string;
  result?: string;
  original_message_link?: string;
}

export interface VerificationDeclarations {
  owns_channel: boolean;
  info_accurate: boolean;
  understands_no_guarantee: boolean;
  agrees_to_rules: boolean;
  no_fabricated_results: boolean;
}

export interface ProviderVerificationRequestPayload {
  identity: VerificationIdentity;
  signal_operation: VerificationSignalOperation;
  trading_evidence?: VerificationTradingEvidence;
  historical_signals: HistoricalSignalItem[];
  declarations: VerificationDeclarations;
}

export interface VerificationRequestResponse {
  status: string;
  verification_submitted_at: string;
  message: string;
}
