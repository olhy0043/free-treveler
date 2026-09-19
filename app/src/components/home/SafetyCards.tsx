"use client";

import { safetyGuides } from "@/data/safety";

export interface SafetyCardsProps {
  onSelectCountry?: (country: string) => void;
  limit?: number;
}

export default function SafetyCards({ onSelectCountry, limit = 6 }: SafetyCardsProps) {
  const cards = safetyGuides.slice(0, limit);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((guide) => (
        <button
          key={guide.country}
          type="button"
          onClick={() => onSelectCountry?.(guide.country)}
          className="rounded-[14px] border border-[#E3E1DC] bg-[#FFFFFF] p-4 text-left transition-shadow hover:shadow-[0_1px_2px_rgba(0,0,0,.06),0_4px_10px_rgba(0,0,0,.08)]"
        >
          <p className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">{guide.country}</p>
          <span className="mt-2 inline-block rounded-full bg-[#F0EEEA] px-3 py-1 text-[13px] font-medium leading-[1.4] text-[#2A2A2E]">
            경보단계: {guide.alertLevel}
          </span>
          <p className="mt-2 text-[13px] leading-[1.4] text-[#6E6E75]">
            최종 확인일: {guide.officialSource.lastCheckedAt}
          </p>
        </button>
      ))}
    </div>
  );
}
