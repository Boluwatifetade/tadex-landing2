"use client";

import { useState, useEffect } from "react";
import {
  ScrollText,
  Clock,
  User,
  Flame,
  Radio,
  Sliders,
  ShieldAlert,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";

interface ExecutionAuditLogItem {
  id: string;
  admin_user_id?: string | null;
  admin_email?: string | null;
  action_type: string;
  target_entity_type: string;
  target_entity_id?: string | null;
  before_state?: any;
  after_state?: any;
  reason?: string | null;
  ip_address?: string | null;
  created_at: string;
}

interface AdminExecutionAuditFeedProps {
  refreshTrigger?: number;
}

export default function AdminExecutionAuditFeed({
  refreshTrigger = 0,
}: AdminExecutionAuditFeedProps) {
  const [logs, setLogs] = useState<ExecutionAuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuditFeed = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let items: any[] = [];
      try {
        const data = await apiClient<any>(
          "/admin/audit-logs?target_entity_type=system_control&page=1&per_page=10"
        );
        items = data.items || data.audit_logs || [];
      } catch {
        const fallbackData = await apiClient<any>(
          "/admin/audit-logs?page=1&per_page=20"
        );
        const raw = fallbackData.items || fallbackData.audit_logs || [];
        items = raw.filter(
          (item: any) =>
            item.target_entity_type === "system_control" ||
            String(item.action_type || "").includes("kill_switch") ||
            String(item.action_type || "").includes("monitoring") ||
            String(item.action_type || "").includes("cohort")
        );
      }
      setLogs(items.slice(0, 10));
    } catch (err: any) {
      setError(err.message || "Failed to load audit logs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditFeed();
  }, [refreshTrigger]);

  const getActionIcon = (actionType: string) => {
    if (actionType.includes("kill_switch")) {
      return <Flame className="h-3.5 w-3.5 text-destructive" />;
    }
    if (actionType.includes("monitoring")) {
      return <Radio className="h-3.5 w-3.5 text-primary" />;
    }
    if (actionType.includes("cohort")) {
      return <Sliders className="h-3.5 w-3.5 text-amber-500" />;
    }
    return <ShieldAlert className="h-3.5 w-3.5 text-muted-foreground" />;
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs space-y-5">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <ScrollText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Recent System Control Mutations &amp; Audit Trail
            </h3>
            <p className="text-xs text-muted-foreground">
              Front-and-center audit record of all emergency stop, monitoring, and rollout modifications.
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={fetchAuditFeed}
          disabled={isLoading}
          className="text-xs text-muted-foreground hover:text-foreground h-8 px-2.5"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-8 flex flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
          <RefreshCw className="h-5 w-5 animate-spin text-primary" />
          <span>Loading system control audit records...</span>
        </div>
      ) : error ? (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchAuditFeed} className="h-7 text-xs">
            Retry
          </Button>
        </div>
      ) : logs.length === 0 ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          <p>No recent system control mutations found in audit logs.</p>
        </div>
      ) : (
        <div className="divide-y divide-border/60">
          {logs.map((log) => (
            <div key={log.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-muted">{getActionIcon(log.action_type)}</div>
                  <span className="font-mono font-bold text-xs text-foreground">
                    {log.action_type}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                    {log.target_entity_type}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{new Date(log.created_at).toLocaleString()}</span>
                </div>
              </div>

              {log.reason && (
                <p className="text-xs text-foreground bg-muted/40 p-2.5 rounded-lg border border-border/40 italic">
                  &ldquo;{log.reason}&rdquo;
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-0.5">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>
                    Actor:{" "}
                    <strong className="text-foreground">
                      {log.admin_email || (log.admin_user_id ? String(log.admin_user_id).slice(0, 8) + "..." : "System")}
                    </strong>
                  </span>
                </div>

                {log.target_entity_id && (
                  <div>
                    Target:{" "}
                    <span className="font-mono text-foreground">{log.target_entity_id}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
