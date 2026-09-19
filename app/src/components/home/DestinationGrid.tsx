"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { destinations } from "@/data/destinations";
import type { Destination, DestinationRegion } from "@/data/types";
import { isFavorite, subscribeFavorites, toggleFavorite } from "@/lib/favorites";

const SEASON_KEYWORDS = ["봄", "여름", "가을", "겨울"];
const ALL = "all";

export interface DestinationGridProps {
  /** Optional max number of cards to render (homepage preview sections use 6). */
  limit?: number;
  onSelect?: (destination: Destination) => void;
  /** External AND-filter (e.g. from ThemeChips), matched against name/description/attractions. */
  themeKeyword?: string | null;
}

export default function DestinationGrid({ limit, onSelect, themeKeyword }: DestinationGridProps) {
  const [scope, setScope] = useState<DestinationRegion>("domestic");
  const [country, setCountry] = useState(ALL);
  const [season, setSeason] = useState(ALL);
  const [keyword, setKeyword] = useState("");
  const [, forceRerender] = useState(0);

  useEffect(() => subscribeFavorites(() => forceRerender((v) => v + 1)), []);

  function handleScopeChange(next: DestinationRegion) {
    setScope(next);
    setCountry(ALL);
  }

  const scoped = useMemo(() => destinations.filter((d) => d.region === scope), [scope]);
  const countries = useMemo(
    () => Array.from(new Set(scoped.map((d) => d.country))).sort((a, b) => a.localeCompare(b)),
    [scoped],
  );

  const filtered = useMemo(() => {
    const trimmedKeyword = keyword.trim().toLowerCase();
    return scoped.filter((d) => {
      if (country !== ALL && d.country !== country) return false;
      if (season !== ALL && !d.bestSeason.includes(season)) return false;
      const haystack = `${d.name} ${d.description} ${d.attractions.join(" ")}`.toLowerCase();
      if (trimmedKeyword && !haystack.includes(trimmedKeyword)) return false;
      if (themeKeyword && !haystack.includes(themeKeyword.toLowerCase())) return false;
      return true;
    });
  }, [scoped, country, season, keyword, themeKeyword]);

  const visible = limit ? filtered.slice(0, limit) : filtered;

  function resetFilters() {
    setCountry(ALL);
    setSeason(ALL);
    setKeyword("");
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {(["domestic", "international"] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => handleScopeChange(tab)}
            aria-pressed={scope === tab}
            className={`rounded-full px-4 py-2 text-[14px] font-semibold leading-[1.4] transition-colors ${
              scope === tab
                ? "bg-[#FF6A45] text-white"
                : "bg-[#F7F6F3] text-[#2A2A2E] hover:bg-[#F0EEEA]"
            }`}
          >
            {tab === "domestic" ? "국내" : "해외"}
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          className="rounded-lg border border-[#E3E1DC] px-3 py-2 text-[14px] text-[#2A2A2E]"
          aria-label="국가 필터"
        >
          <option value={ALL}>국가 전체</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={season}
          onChange={(event) => setSeason(event.target.value)}
          className="rounded-lg border border-[#E3E1DC] px-3 py-2 text-[14px] text-[#2A2A2E]"
          aria-label="추천 계절 필터"
        >
          <option value={ALL}>계절 전체</option>
          {SEASON_KEYWORDS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="여행지·테마 검색"
          className="min-w-[160px] flex-1 rounded-lg border border-[#E3E1DC] px-3 py-2 text-[14px] text-[#2A2A2E]"
          aria-label="여행지 키워드 검색"
        />
      </div>

      {visible.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-[14px] bg-[#F7F6F3] px-6 py-12 text-center">
          <p className="text-base leading-[1.6] text-[#47474D]">
            조건에 맞는 여행지가 없습니다. 필터를 조정하거나 초기화해 다시 찾아보세요.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29]"
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((destination) => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onSelect={onSelect}
              onFavoriteToggled={() => forceRerender((v) => v + 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DestinationCard({
  destination,
  onSelect,
  onFavoriteToggled,
}: {
  destination: Destination;
  onSelect?: (destination: Destination) => void;
  onFavoriteToggled: () => void;
}) {
  const favorite = isFavorite(destination.id);

  return (
    <div className="group relative overflow-hidden rounded-[14px] border border-[#E3E1DC] bg-[#FFFFFF] transition-shadow hover:shadow-[0_1px_2px_rgba(0,0,0,.06),0_4px_10px_rgba(0,0,0,.08)]">
      <button
        type="button"
        onClick={() => onSelect?.(destination)}
        className="block w-full text-left"
      >
        <div className="relative h-44 w-full">
          <Image
            src={destination.image.url}
            alt={destination.image.alt}
            fill
            loading="lazy"
            unoptimized
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <p className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">{destination.name}</p>
          <p className="mt-1 text-[14px] leading-[1.5] text-[#6E6E75]">{destination.country}</p>
        </div>
      </button>

      <button
        type="button"
        aria-label={favorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        aria-pressed={favorite}
        onClick={() => {
          toggleFavorite(destination.id);
          onFavoriteToggled();
        }}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFFFF]/90 text-[#FF6A45]"
      >
        {favorite ? "♥" : "♡"}
      </button>
    </div>
  );
}

/** REQ-FUNC-009: same-country related destinations for the detail view, max `limit`. */
export function getRelatedDestinations(
  current: Destination,
  limit = 6,
  pool: Destination[] = destinations,
): Destination[] {
  return pool.filter((d) => d.id !== current.id && d.country === current.country).slice(0, limit);
}
