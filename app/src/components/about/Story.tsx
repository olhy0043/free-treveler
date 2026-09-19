import { REPRESENTATIVE_PROFILE } from "@/data/representative";

export default function Story() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <h2 className="text-2xl font-bold leading-[1.3] text-[#2A2A2E]">여행을 시작한 이유</h2>
        <p className="mt-4 text-base leading-[1.6] text-[#47474D]">{REPRESENTATIVE_PROFILE.bio}</p>
      </div>
      <div>
        <h2 className="text-2xl font-bold leading-[1.3] text-[#2A2A2E]">여행 철학과 콘텐츠 원칙</h2>
        <p className="mt-4 text-base leading-[1.6] text-[#47474D]">{REPRESENTATIVE_PROFILE.philosophy}</p>
        <p className="mt-4 text-base leading-[1.6] text-[#47474D]">
          {REPRESENTATIVE_PROFILE.editorialPrinciple}
        </p>
      </div>
    </div>
  );
}
