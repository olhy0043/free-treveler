"use client";

import type { MatePostStatus } from "@/lib/db/types";

export const MATE_STATUS_ALL = "all" as const;
export type MateStatusFilter = MatePostStatus | typeof MATE_STATUS_ALL;

export interface MateFilterValue {
  country: string;
  region: string;
  dateFrom: string;
  dateTo: string;
  status: MateStatusFilter;
}

export const EMPTY_MATE_FILTER: MateFilterValue = {
  country: "",
  region: "",
  dateFrom: "",
  dateTo: "",
  status: MATE_STATUS_ALL,
};

const STATUS_OPTIONS: { value: MateStatusFilter; label: string }[] = [
  { value: "all", label: "전체" },
  { value: "RECRUITING", label: "모집중" },
  { value: "CLOSED", label: "마감" },
  { value: "COMPLETED", label: "완료" },
];

export default function Filter({
  value,
  onChange,
  resultCount,
}: {
  value: MateFilterValue;
  onChange: (next: MateFilterValue) => void;
  resultCount: number;
}) {
  function update(patch: Partial<MateFilterValue>) {
    onChange({ ...value, ...patch });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          value={value.country}
          onChange={(event) => update({ country: event.target.value })}
          placeholder="국가"
          aria-label="국가 필터"
          className="h-11 rounded-lg border border-[#E3E1DC] px-3 text-[14px] text-[#2A2A2E]"
        />
        <input
          type="text"
          value={value.region}
          onChange={(event) => update({ region: event.target.value })}
          placeholder="지역"
          aria-label="지역 필터"
          className="h-11 rounded-lg border border-[#E3E1DC] px-3 text-[14px] text-[#2A2A2E]"
        />
        <input
          type="date"
          value={value.dateFrom}
          onChange={(event) => update({ dateFrom: event.target.value })}
          aria-label="기간 시작"
          className="h-11 rounded-lg border border-[#E3E1DC] px-3 text-[14px] text-[#2A2A2E]"
        />
        <input
          type="date"
          value={value.dateTo}
          onChange={(event) => update({ dateTo: event.target.value })}
          aria-label="기간 끝"
          className="h-11 rounded-lg border border-[#E3E1DC] px-3 text-[14px] text-[#2A2A2E]"
        />
        <select
          value={value.status}
          onChange={(event) => update({ status: event.target.value as MateStatusFilter })}
          aria-label="모집 상태 필터"
          className="h-11 rounded-lg border border-[#E3E1DC] px-3 text-[14px] text-[#2A2A2E]"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <p className="mt-3 text-[14px] leading-[1.5] text-[#6E6E75]">총 {resultCount}개를 찾았어요</p>
    </div>
  );
}
