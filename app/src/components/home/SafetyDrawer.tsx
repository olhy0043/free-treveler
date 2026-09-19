"use client";

import { safetyGuides } from "@/data/safety";
import { DrawerShell } from "./DestinationDrawer";

const STALE_DAYS = 7;
const SEVERE_LEVELS = new Set(["철수권고", "여행금지"]);

function isStale(dateString: string): boolean {
  const checked = new Date(dateString).getTime();
  const diffDays = (Date.now() - checked) / (1000 * 60 * 60 * 24);
  return diffDays > STALE_DAYS;
}

export interface SafetyDrawerProps {
  country: string | null;
  onClose: () => void;
}

export default function SafetyDrawer({ country, onClose }: SafetyDrawerProps) {
  const guide = country ? safetyGuides.find((s) => s.country === country) : undefined;

  return (
    <DrawerShell open={country !== null} title={country ? `${country} 안전정보` : ""} onClose={onClose}>
      {guide ? (
        <div className="flex flex-col gap-6">
          {SEVERE_LEVELS.has(guide.alertLevel) ? (
            <div className="rounded-[14px] border-l-4 border-[#C1272D] bg-[#F7F6F3] p-4 text-[14px] font-semibold leading-[1.5] text-[#C1272D]">
              중대 경보: 현재 {guide.country}는 &ldquo;{guide.alertLevel}&rdquo; 단계입니다. 방문 전
              최신 공식 정보를 반드시 확인하세요.
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#F0EEEA] px-3 py-1 text-[13px] font-medium leading-[1.4] text-[#2A2A2E]">
              경보단계: {guide.alertLevel}
            </span>
            <span className="rounded-full bg-[#F0EEEA] px-3 py-1 text-[13px] font-medium leading-[1.4] text-[#2A2A2E]">
              적용 범위: {guide.scopeType === "country" ? "국가 전역" : guide.scopeText}
            </span>
            {isStale(guide.officialSource.lastCheckedAt) ? (
              <span className="rounded-full bg-[#FFD7C7] px-3 py-1 text-[13px] font-semibold leading-[1.4] text-[#E24E29]">
                최근 확인 후 {STALE_DAYS}일 경과 - 공식 링크에서 최신 정보를 확인하세요
              </span>
            ) : null}
          </div>

          {Object.values(guide.categories).map((category) => (
            <section key={category.title}>
              <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">{category.title}</h3>
              <p className="mt-2 text-base leading-[1.6] text-[#47474D]">{category.content}</p>
            </section>
          ))}

          <section>
            <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">긴급 연락처</h3>
            <p className="mt-2 text-base leading-[1.6] text-[#47474D]">
              현지 긴급전화: {guide.emergencyContactInfo.localEmergencyPhone}
            </p>
            <p className="mt-1 text-base leading-[1.6] text-[#47474D]">
              영사 지원: {guide.emergencyContactInfo.koreanConsulateOrCallCenter}
            </p>
          </section>

          <section className="border-t border-[#E3E1DC] pt-4 text-[13px] leading-[1.4] text-[#6E6E75]">
            <p>
              출처:{" "}
              <a
                href={guide.officialSource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2563AC] underline"
              >
                {guide.officialSource.name}
              </a>
            </p>
            <p>최종 확인일: {guide.officialSource.lastCheckedAt}</p>
            <p>편집자: {guide.officialSource.editor}</p>
          </section>
        </div>
      ) : null}
    </DrawerShell>
  );
}
