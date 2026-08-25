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

// --- User Management Models (Phase Admin-2) ---

export interface AdminUserSummaryOut {
  id: string;
  email?: string | null;
  email_verified: boolean;
  telegram_id?: number | null;
  username?: string | null;
  telegram_username?: string | null;
  phone?: string | null;
  role: string;
  status: "active" | "suspended" | "banned" | "deleted" | string;
  registration_source?: string | null;
  created_at: string;
  last_seen?: string | null;
  connected_accounts_count: number;
  active_subscriptions_count: number;
}

export interface AdminUserListResponse {
  items: AdminUserSummaryOut[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface AdminUserExchangeAccountOut {
  id: string;
  exchange: string;
  account_name?: string | null;
  account_type: string;
  trading_mode: string;
  risk_level: string;
  current_leverage: number;
  is_testnet: boolean;
  status: "active" | "invalid" | "error" | "revoked" | "deleted" | string;
  last_validated_at?: string | null;
  validation_error?: string | null;
  api_key_masked: string;
  created_at: string;
}

export interface AdminUserSubscriptionOut {
  id: string;
  provider_id?: string | null;
  provider_name?: string | null;
  plan_id?: string | null;
  plan_name?: string | null;
  tier?: string | null;
  status: "active" | "trialing" | "canceled" | "cancelled" | "expired" | string;
  is_active: boolean;
  started_at?: string | null;
  expires_at?: string | null;
  current_period_end?: string | null;
  canceled_at?: string | null;
}

export interface AdminUserProviderProfileOut {
  id: string;
  name: string;
  slug?: string | null;
  status: "active" | "suspended" | "deleted" | string;
  is_verified: boolean;
  verification_level: string;
  subscriber_count: number;
  total_signals_sent: number;
  win_rate?: number | null;
  created_at: string;
}

export interface AdminUserPaymentOut {
  id: string;
  amount_cents?: number | null;
  amount_minor?: number | null;
  currency?: string | null;
  payment_method?: string | null;
  status: "completed" | "successful" | "success" | "pending" | "failed" | string;
  provider?: string | null;
  created_at: string;
}

export interface AdminAuditLogOut {
  id: string;
  action_type: string;
  target_entity_type: string;
  target_entity_id?: string | null;
  admin_user_id?: string | null;
  admin_telegram_id?: number | null;
  reason?: string | null;
  before_state?: Record<string, unknown> | null;
  after_state?: Record<string, unknown> | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at: string;
}

export interface AdminUserDetail360Out {
  id: string;
  email?: string | null;
  email_verified: boolean;
  telegram_id?: number | null;
  username?: string | null;
  phone?: string | null;
  role: string;
  status: "active" | "suspended" | "banned" | "deleted" | string;
  is_beta_tester: boolean;
  terms_accepted: boolean;
  terms_accepted_at?: string | null;
  registration_source?: string | null;
  created_at: string;
  updated_at?: string | null;
  last_seen?: string | null;
  connected_exchanges: AdminUserExchangeAccountOut[];
  subscriptions: AdminUserSubscriptionOut[];
  provider_profile?: AdminUserProviderProfileOut | null;
  payment_history: AdminUserPaymentOut[];
  recent_audit_logs: AdminAuditLogOut[];
}

export interface AdminBanUserRequest {
  reason: string;
}

export interface AdminUnbanUserRequest {
  reason?: string | null;
}

export interface AdminLogoutAllRequest {
  reason: string;
}

export interface AdminForceVerifyEmailRequest {
  reason: string;
}

// --- Billing & Revenue Models (Phase Admin-3) ---

export interface AdminTransactionItemOut {
  id: string;
  user_id?: string | null;
  user_email?: string | null;
  user_username?: string | null;
  user_telegram_id?: number | null;
  provider?: string | null;
  provider_reference?: string | null;
  amount_minor?: number | null;
  fee_minor?: number | null;
  provider_amount_minor?: number | null;
  total_amount_minor?: number | null;
  amount_cents?: number | null;
  currency?: string | null;
  status: "success" | "successful" | "completed" | "pending" | "failed" | string;
  payment_method?: string | null;
  provider_name?: string | null;
  plan_id?: string | null;
  provider_plan_id?: string | null;
  platform_tier_id?: string | null;
  is_test?: boolean;
  created_at: string;
  updated_at?: string | null;
}

export interface AdminTransactionListResponse {
  items: AdminTransactionItemOut[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AdminTransactionDetailOut {
  id: string;
  user_id?: string | null;
  user_email?: string | null;
  user_username?: string | null;
  user_telegram_id?: number | null;
  provider?: string | null;
  provider_reference?: string | null;
  amount_minor?: number | null;
  fee_minor?: number | null;
  provider_amount_minor?: number | null;
  total_amount_minor?: number | null;
  amount_cents?: number | null;
  currency?: string | null;
  status: "success" | "successful" | "completed" | "pending" | "failed" | string;
  payment_method?: string | null;
  provider_name?: string | null;
  plan_id?: string | null;
  provider_plan_id?: string | null;
  platform_tier_id?: string | null;
  is_test?: boolean;
  error_message?: string | null;
  manual_review_status?: string | null;
  meta?: Record<string, unknown> | null;
  raw_webhook_payload?: Record<string, unknown> | null;
  created_at: string;
  updated_at?: string | null;
  associated_subscription?: AdminUserSubscriptionOut | null;
  user?: AdminUserSummaryOut | null;
  provider_profile?: AdminUserProviderProfileOut | null;
  recent_audit_logs: AdminAuditLogOut[];
}

export interface AdminReconcilePaymentRequest {
  reason: string;
}

export interface AdminReconcilePaymentResponse {
  success: boolean;
  status: string;
  applied: boolean;
  transaction_id?: string | null;
  provider_reference?: string | null;
  message: string;
  audit_log_id?: string | null;
}

export interface AdminSubscriptionLedgerItemOut {
  id: string;
  user_id: string;
  user_email?: string | null;
  user_username?: string | null;
  user_telegram_id?: number | null;
  provider_id?: string | null;
  provider_name?: string | null;
  provider_slug?: string | null;
  provider_plan_id?: string | null;
  platform_tier_id?: string | null;
  tier?: string | null;
  status: "active" | "trialing" | "past_due" | "paused" | "canceled" | "expired" | string;
  is_active: boolean;
  auto_renew: boolean;
  current_period_start?: string | null;
  current_period_end?: string | null;
  expires_at?: string | null;
  trial_ends_at?: string | null;
  canceled_at?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface AdminSubscriptionListResponse {
  items: AdminSubscriptionLedgerItemOut[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface AdminCancelSubscriptionRequest {
  mode: "immediate" | "period_end";
  reason: string;
}

export interface AdminSetSubscriptionStatusRequest {
  status: string;
  reason: string;
}

export interface AdminPlatformFeeConfigOut {
  id: string;
  settlement_method: string;
  currency_code: string;
  amount_minor: number;
  amount: number;
  active: boolean;
  created_by_admin_id?: number | null;
  type?: string | null;
  rate?: number | null;
  created_at: string;
  updated_at?: string | null;
}

export interface AdminPlatformFeesResponse {
  active_fees: AdminPlatformFeeConfigOut[];
  history: AdminPlatformFeeConfigOut[];
}

export interface AdminSetPlatformFeeRequest {
  currency: string;
  amount_minor?: number;
  amount?: number;
  reason: string;
}

// ============================================================================
// Phase Admin-4a / Admin-4b: Execution & System Controls Types
// ============================================================================

export interface SystemControlDbRow {
  id: string;
  control_type: string;
  is_enabled: boolean;
  enabled_at?: string | null;
  enabled_by?: string | null;
  reason?: string | null;
  metadata?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface SystemControlState {
  control_type: string;
  effective_value: any;
  source: 'database' | 'env_fallback' | 'default_fallback' | string;
  is_db_override: boolean;
  db_row?: SystemControlDbRow | null;
  env_default?: any;
  description?: string | null;
}

export interface ExecutionOverviewSummary {
  kill_switch_active: boolean;
  trading_allowed: boolean;
  monitoring_active: boolean;
  monitoring_actions_allowed: boolean;
  effective_cohort_percent: number;
  total_controls_tracked: number;
  db_overrides_count: number;
  timestamp: string;
}

export interface ExecutionOverviewResponse {
  controls: Record<string, SystemControlState>;
  summary: ExecutionOverviewSummary;
}

export interface ExecutionHealthSignaling {
  total_signals: number;
  dispatched_signals: number;
  failed_signals: number;
  parsing_success_rate: number;
  avg_ingest_latency_seconds: number;
}

export interface ExecutionHealthDispatch {
  total_dispatches: number;
  completed_dispatches: number;
  failed_dispatches: number;
  dispatch_success_rate: number;
  avg_dispatch_latency_seconds: number;
}

export interface ExecutionHealthOrdering {
  total_orders: number;
  filled_orders: number;
  failed_orders: number;
  ordering_success_rate: number;
}

export interface ExecutionHealthResponse {
  window_hours: number;
  signaling: ExecutionHealthSignaling;
  dispatch: ExecutionHealthDispatch;
  ordering: ExecutionHealthOrdering;
  overall_healthy: boolean;
}

export interface ExecutionReconciliationResponse {
  active_monitors_count: number;
  open_positions_count: number;
  monitors_by_status: Record<string, number>;
  monitors_by_mode: Record<string, number>;
  drift_status: 'CLEAN' | 'DRIFT_DETECTED' | string;
  is_consistent: boolean;
  invariants_check: Record<string, any>;
  recent_corrective_actions: Array<{
    id?: string;
    action_type?: string;
    target_entity_type?: string;
    target_entity_id?: string;
    before_state?: any;
    after_state?: any;
    reason?: string;
    created_at?: string;
    source_table?: string;
  }>;
}

export interface ExecutionCohortResponse {
  cohort_percent: number;
  source: 'database' | 'env_fallback' | string;
  is_db_override: boolean;
  total_users: number;
  users_in_cohort: number;
  users_excluded: number;
  enabled_environments: string[];
}

export interface ExchangeConnectivityResponse {
  exchange: string;
  status: 'online' | 'degraded' | 'offline' | string;
  latency_ms: number;
  server_time?: string | number | null;
  checked_at: string;
  status_code?: number;
}

export interface SystemKillSwitchRequest {
  enable: boolean;
  reason: string;
  confirmation_phrase?: string;
  expected_updated_at?: string | null;
}

export interface SystemMonitoringRequest {
  control: 'monitoring_enabled' | 'monitoring_actions_kill_switch';
  enable: boolean;
  reason: string;
  expected_updated_at?: string | null;
}

export interface SystemCohortRequest {
  percent: number;
  reason: string;
  expected_updated_at?: string | null;
}

export interface SystemControlMutationResponse {
  success: boolean;
  control: SystemControlState;
  exchange_connectivity?: ExchangeConnectivityResponse | null;
  audit_log_id?: string | null;
  message: string;
}


