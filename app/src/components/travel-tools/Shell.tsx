"use client";

import { useState, type ReactNode } from "react";
import Tabs, { type TravelToolTab } from "./Tabs";

const TIPS = [
  "항공·숙소는 평일 오전에 예약하면 더 저렴한 경우가 많습니다.",
  "출발 최소 2주 전에는 여권 유효기간을 확인하세요.",
  "동행 구하기 글에는 연락처를 직접 남기지 마세요 — 채팅으로 안전하게 연결됩니다.",
];

export default function Shell({
  flightPanel,
  hotelPanel,
  matePanel,
}: {
  flightPanel: ReactNode;
  hotelPanel: ReactNode;
  matePanel: ReactNode;
}) {
  const [tab, setTab] = useState<TravelToolTab>("flight");

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold leading-[1.3] text-[#2A2A2E]">통합 여행 준비</h1>
        <p className="mt-2 text-base leading-[1.6] text-[#47474D]">
          항공편·숙소 조건을 확인하고, 함께 떠날 동행을 구해보세요. 1) 조건 입력 2) 요약 확인 3) 외부 서비스 또는 동행 글 작성 순서로 진행됩니다.
        </p>
      </div>

      <div className="mt-8">
        <Tabs active={tab} onChange={setTab} />
      </div>

      <div className="mt-6">
        <div hidden={tab !== "flight"}>{flightPanel}</div>
        <div hidden={tab !== "hotel"}>{hotelPanel}</div>
        <div hidden={tab !== "mate"}>{matePanel}</div>
      </div>

      <div className="mt-8 rounded-[14px] bg-[#F7F6F3] p-6">
        <p className="text-[14px] font-semibold leading-[1.5] text-[#2A2A2E]">여행 준비 Tip</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] leading-[1.5] text-[#47474D]">
          {TIPS.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
