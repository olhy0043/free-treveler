"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/db/client";
import { updateReportStatus } from "@/lib/actions/admin";
import type { ReportStatus, ReportTargetType } from "@/lib/db/types";

const STATUS_OPTIONS: { value: ReportStatus | "all"; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "OPEN", label: "OPEN" },
  { value: "REVIEWING", label: "REVIEWING" },
  { value: "RESOLVED", label: "RESOLVED" },
  { value: "DISMISSED", label: "DISMISSED" },
];

interface ReportRow {
  id: string;
  target_type: ReportTargetType;
  target_id: string;
  reason: string;
  status: ReportStatus;
  created_at: string;
}

type AccessState = "loading" | "denied" | "granted";

export default function AdminReports() {
  const [access, setAccess] = useState<AccessState>("loading");
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [filter, setFilter] = useState<ReportStatus | "all">("all");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = getBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setAccess("denied");
        return;
      }
      const { data: profile } = await supabase.from("user_profile").select("role").eq("id", user.id).single();
      if (profile?.role !== "admin") {
        if (!cancelled) setAccess("denied");
        return;
      }
      const { data } = await supabase.from("report").select("id, target_type, target_id, reason, status, created_at").order("created_at", { ascending: false });
      if (!cancelled) {
        setReports(data ?? []);
        setAccess("granted");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleStatusChange(reportId: string, status: ReportStatus) {
    setError(null);
    const result = await updateReportStatus(reportId, status);
    if (!result.ok) {
      setError(result.error ?? "상태 변경에 실패했습니다.");
      return;
    }
    setReports((prev) => prev.map((report) => (report.id === reportId ? { ...report, status } : report)));
  }

  if (access !== "granted") {
    return null;
  }

  const visible = filter === "all" ? reports : reports.filter((report) => report.status === filter);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            aria-pressed={filter === option.value}
            className={`rounded-full px-4 py-2 text-[14px] font-semibold leading-[1.4] ${
              filter === option.value ? "bg-[#FF6A45] text-white" : "bg-[#F7F6F3] text-[#2A2A2E]"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-[14px] leading-[1.5] text-[#C1272D]">
          {error}
        </p>
      ) : null}

      {visible.length === 0 ? (
        <p className="mt-4 text-[14px] leading-[1.6] text-[#6E6E75]">해당 상태의 신고가 없습니다.</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {visible.map((report) => (
            <li key={report.id} className="rounded-[14px] border border-[#E3E1DC] p-4">
              <p className="text-[14px] leading-[1.5] text-[#6E6E75]">
                {report.target_type} · {report.created_at.slice(0, 10)}
              </p>
              <p className="mt-1 text-base leading-[1.6] text-[#2A2A2E]">{report.reason}</p>
              <select
                value={report.status}
                onChange={(event) => handleStatusChange(report.id, event.target.value as ReportStatus)}
                className="mt-3 h-10 rounded-lg border border-[#E3E1DC] px-3 text-[14px] text-[#2A2A2E]"
              >
                {STATUS_OPTIONS.filter((option) => option.value !== "all").map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
