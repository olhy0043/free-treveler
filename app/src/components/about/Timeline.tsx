import { timeline } from "@/data/representative";

const MIN_TIMELINE_ITEMS = 6;

export default function Timeline() {
  if (timeline.length < MIN_TIMELINE_ITEMS) {
    throw new Error(
      `Timeline requires at least ${MIN_TIMELINE_ITEMS} entries, got ${timeline.length}. Add more entries to src/data/representative.ts.`,
    );
  }

  return (
    <ol className="relative flex flex-col gap-8 border-l border-[#E3E1DC] pl-6">
      {timeline.map((entry) => (
        <li key={entry.year} className="relative">
          <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full bg-[#FF6A45]" />
          <p className="text-[14px] font-semibold leading-[1.4] text-[#FF6A45]">{entry.year}</p>
          <p className="mt-1 text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">{entry.place}</p>
          <p className="mt-1 text-base leading-[1.6] text-[#47474D]">{entry.summary}</p>
        </li>
      ))}
    </ol>
  );
}
