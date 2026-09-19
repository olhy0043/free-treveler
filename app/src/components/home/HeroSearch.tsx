"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { destinations } from "@/data/destinations";
import type { Destination } from "@/data/types";

export interface HeroSearchProps {
  onSelect?: (destination: Destination) => void;
}

export default function HeroSearch({ onSelect }: HeroSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return destinations.filter((d) => d.name.includes(trimmed) || d.country.includes(trimmed)).slice(0, 6);
  }, [query]);

  const showResults = query.trim().length > 0;

  return (
    <section className="flex min-h-[50vh] max-h-[65vh] flex-col items-center justify-center gap-6 bg-[#FFFFFF] px-4 py-16 text-center">
      <h1 className="text-2xl font-bold leading-[1.25] text-[#2A2A2E] md:text-[32px]">
        다음 여행지를 찾고, 준비까지 한 번에
      </h1>
      <p className="max-w-lg text-base leading-[1.6] text-[#47474D]">
        국내외 여행지를 검색하고, 항공·숙소 조건 정리와 동행 찾기까지 Free Traveler에서 이어가세요.
      </p>

      <div className="relative w-full max-w-md">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="여행지 이름이나 국가를 검색해 보세요"
          aria-label="여행지 검색"
          className="w-full rounded-full border border-[#E3E1DC] bg-[#FFFFFF] px-5 py-3 text-base text-[#2A2A2E] shadow-sm outline-none focus:border-[#FF6A45]"
        />

        {showResults ? (
          <div className="absolute left-0 right-0 top-full z-10 mt-2 rounded-[14px] border border-[#E3E1DC] bg-[#FFFFFF] p-2 text-left shadow-[0_1px_2px_rgba(0,0,0,.06),0_4px_10px_rgba(0,0,0,.08)]">
            {results.length === 0 ? (
              <p className="px-3 py-4 text-[14px] leading-[1.5] text-[#6E6E75]">
                일치하는 여행지가 없습니다. 다른 키워드로 검색해 보세요.
              </p>
            ) : (
              <ul>
                {results.map((destination) => (
                  <li key={destination.id}>
                    <button
                      type="button"
                      onClick={() => onSelect?.(destination)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-[#F7F6F3]"
                    >
                      <span className="text-[16px] font-semibold leading-[1.4] text-[#2A2A2E]">
                        {destination.name}
                      </span>
                      <span className="text-[14px] leading-[1.5] text-[#6E6E75]">{destination.country}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}
      </div>

      <Link
        href="/travel-tools"
        className="rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white transition-colors hover:bg-[#E24E29]"
      >
        여행 준비 시작하기
      </Link>
    </section>
  );
}
