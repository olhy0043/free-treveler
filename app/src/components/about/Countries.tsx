import { visitedCountries } from "@/data/representative";

export default function Countries() {
  const regions = Array.from(new Set(visitedCountries.map((c) => c.region)));

  return (
    <div className="flex flex-col gap-6">
      {regions.map((region) => (
        <div key={region}>
          <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">{region}</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {visitedCountries
              .filter((c) => c.region === region)
              .map((c) => (
                <span
                  key={c.name}
                  className="rounded-full bg-[#F7F6F3] px-4 py-2 text-[14px] font-medium leading-[1.4] text-[#2A2A2E]"
                >
                  {c.name}
                </span>
              ))}
          </div>
        </div>
      ))}
      <p className="text-[13px] leading-[1.4] text-[#6E6E75]">총 {visitedCountries.length}개국 방문</p>
    </div>
  );
}
