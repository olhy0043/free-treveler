"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/db/client";
import { updateOutboundUrl, type OutboundUrlKey } from "@/lib/actions/admin";

const FIELDS: { key: OutboundUrlKey; label: string }[] = [
  { key: "flight_outbound_url", label: "항공편 검색 URL" },
  { key: "hotel_outbound_url", label: "숙소 검색 URL" },
];

function UrlField({ fieldKey, label }: { fieldKey: OutboundUrlKey; label: string }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadValue() {
      const supabase = getBrowserClient();
      const { data } = await supabase.from("app_setting").select("value").eq("key", fieldKey).single();
      if (!cancelled && data) setValue(data.value);
    }
    loadValue();
    return () => {
      cancelled = true;
    };
  }, [fieldKey]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    const result = await updateOutboundUrl(fieldKey, value);
    if (!result.ok) {
      setError(result.error ?? "저장에 실패했습니다.");
      return;
    }
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label className="flex flex-col gap-1">
        <span className="text-[14px] leading-[1.4] text-[#6E6E75]">{label}</span>
        <input
          type="url"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="https://..."
          required
          className="h-11 rounded-lg border border-[#E3E1DC] px-3 text-[14px] text-[#2A2A2E]"
        />
      </label>
      {error ? (
        <p role="alert" className="text-[14px] leading-[1.5] text-[#C1272D]">
          {error}
        </p>
      ) : saved ? (
        <p className="text-[14px] leading-[1.5] text-[#2A2A2E]">저장되었습니다.</p>
      ) : null}
      <button
        type="submit"
        className="self-start rounded-lg bg-[#FF6A45] px-4 py-2 text-[14px] font-semibold leading-[1.4] text-white hover:bg-[#E24E29]"
      >
        저장
      </button>
    </form>
  );
}

export default function AdminOutbound() {
  return (
    <div className="flex flex-col gap-4">
      {FIELDS.map((field) => (
        <UrlField key={field.key} fieldKey={field.key} label={field.label} />
      ))}
    </div>
  );
}
