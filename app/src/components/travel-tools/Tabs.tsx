"use client";

export type TravelToolTab = "flight" | "hotel" | "mate";

const TAB_LABELS: Record<TravelToolTab, string> = {
  flight: "항공편",
  hotel: "숙소",
  mate: "동행 구하기",
};

export default function Tabs({
  active,
  onChange,
}: {
  active: TravelToolTab;
  onChange: (tab: TravelToolTab) => void;
}) {
  return (
    <div role="tablist" aria-label="여행 준비 탭" className="flex gap-6 border-b border-[#E3E1DC]">
      {(Object.keys(TAB_LABELS) as TravelToolTab[]).map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={active === tab}
          onClick={() => onChange(tab)}
          className={`-mb-px border-b-2 px-1 py-3 text-[16px] font-semibold leading-[1.4] transition-colors ${
            active === tab ? "border-[#FF6A45] text-[#FF6A45]" : "border-transparent text-[#6E6E75]"
          }`}
        >
          {TAB_LABELS[tab]}
        </button>
      ))}
    </div>
  );
}
