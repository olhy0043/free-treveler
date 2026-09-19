import { REPRESENTATIVE_PROFILE, timeline } from "@/data/representative";

export default function Stats() {
  const stats = [
    { label: "누적 여행 횟수", value: REPRESENTATIVE_PROFILE.tripsLabel },
    { label: "방문 국가 수", value: REPRESENTATIVE_PROFILE.countriesLabel },
    { label: "여행 기록 연도", value: `${timeline.length}년` },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-[14px] border border-[#E3E1DC] bg-[#F7F6F3] p-6 text-center"
        >
          <p className="text-2xl font-bold leading-[1.25] text-[#2A2A2E]">{stat.value}</p>
          <p className="mt-2 text-[14px] leading-[1.5] text-[#6E6E75]">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
