"use client";

import { useState } from "react";
import type { Destination } from "@/data/types";
import HeroSearch from "./HeroSearch";
import DestinationGrid from "./DestinationGrid";
import ThemeChips from "./ThemeChips";
import SafetyCards from "./SafetyCards";
import DestinationDrawer from "./DestinationDrawer";
import SafetyDrawer from "./SafetyDrawer";

function Section({
  title,
  description,
  children,
  ariaLabel,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <section
      aria-label={ariaLabel}
      className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16"
    >
      <h2 className="text-2xl font-bold leading-[1.3] text-[#2A2A2E]">{title}</h2>
      <p className="mt-2 text-base leading-[1.6] text-[#47474D]">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function HomeSections() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedSafetyCountry, setSelectedSafetyCountry] = useState<string | null>(null);
  const [themeKeyword, setThemeKeyword] = useState<string | null>(null);

  return (
    <>
      <HeroSearch onSelect={setSelectedDestination} />

      <Section
        ariaLabel="국내·해외 인기 여행지"
        title="국내·해외 인기 여행지"
        description="국내와 해외 탭을 눌러 여행지를 둘러보고, 마음에 드는 곳은 즐겨찾기에 담아보세요."
      >
        <DestinationGrid limit={6} onSelect={setSelectedDestination} themeKeyword={themeKeyword} />
      </Section>

      <Section
        ariaLabel="여행 동기·테마"
        title="어떤 여행을 떠나고 싶으세요?"
        description="관심있는 테마를 선택하면 위 여행지 목록이 함께 좁혀져요."
      >
        <ThemeChips onThemeChange={setThemeKeyword} />
      </Section>

      <Section
        ariaLabel="국가별 주의사항"
        title="국가별 주의사항"
        description="여행 전 최신 안전정보와 긴급 연락처를 확인하세요."
      >
        <SafetyCards onSelectCountry={setSelectedSafetyCountry} />
      </Section>

      <DestinationDrawer
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onShowSafety={(country) => {
          setSelectedDestination(null);
          setSelectedSafetyCountry(country);
        }}
        onSelectRelated={setSelectedDestination}
      />
      <SafetyDrawer country={selectedSafetyCountry} onClose={() => setSelectedSafetyCountry(null)} />
    </>
  );
}
