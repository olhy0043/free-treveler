import Link from "next/link";
import { REPRESENTATIVE_PROFILE } from "@/data/representative";

export default function AboutSummary() {
  return (
    <section className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
      <div>
        <p className="text-[14px] font-semibold leading-[1.4] text-[#FF6A45]">
          {REPRESENTATIVE_PROFILE.name}
        </p>
        <h2 className="mt-2 text-2xl font-bold leading-[1.3] text-[#2A2A2E]">
          직접 다녀온 여행만 정리합니다
        </h2>
        <p className="mt-3 text-base leading-[1.6] text-[#47474D]">{REPRESENTATIVE_PROFILE.bio}</p>
        <Link
          href="/about"
          className="mt-4 inline-block rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white transition-colors hover:bg-[#E24E29]"
        >
          대표 소개 더 보기
        </Link>
      </div>

      <div className="flex gap-6 rounded-[14px] bg-[#F7F6F3] p-8">
        <div>
          <p className="text-2xl font-bold leading-[1.25] text-[#2A2A2E]">
            {REPRESENTATIVE_PROFILE.tripsLabel}
          </p>
          <p className="mt-1 text-[14px] leading-[1.5] text-[#6E6E75]">누적 여행 횟수</p>
        </div>
        <div>
          <p className="text-2xl font-bold leading-[1.25] text-[#2A2A2E]">
            {REPRESENTATIVE_PROFILE.countriesLabel}
          </p>
          <p className="mt-1 text-[14px] leading-[1.5] text-[#6E6E75]">방문 국가 수</p>
        </div>
      </div>
    </section>
  );
}
