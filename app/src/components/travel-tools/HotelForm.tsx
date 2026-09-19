"use client";

import { useMemo, useState } from "react";

const COUNTRY_REGIONS: Record<string, string[]> = {
  일본: ["도쿄", "오사카", "후쿠오카", "삿포로"],
  베트남: ["다낭", "하노이", "호치민", "나트랑"],
  태국: ["방콕", "치앙마이", "푸켓"],
  프랑스: ["파리", "니스"],
  이탈리아: ["로마", "밀라노", "베니스"],
};
const COUNTRIES = Object.keys(COUNTRY_REGIONS);

const OUTBOUND_URL = process.env.NEXT_PUBLIC_HOTEL_OUTBOUND_URL;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function HotelForm() {
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{ country: string; region: string; checkIn: string; checkOut: string } | null>(null);

  const regions = useMemo(() => (country ? COUNTRY_REGIONS[country] ?? [] : []), [country]);

  function handleCountryChange(next: string) {
    setCountry(next);
    setRegion("");
    setSummary(null);
  }

  function validate(): string | null {
    if (!country || !region || !checkIn || !checkOut) return "국가·지역·체크인·체크아웃을 모두 입력해 주세요.";
    if (checkIn < todayIso()) return "체크인은 오늘 이후여야 합니다.";
    if (checkOut <= checkIn) return "체크아웃은 체크인보다 늦어야 합니다.";
    return null;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      setSummary(null);
      return;
    }
    setError(null);
    setSummary({ country, region, checkIn, checkOut });
  }

  function handleOutbound() {
    if (!OUTBOUND_URL) {
      setError("숙소 검색 서비스 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    window.open(OUTBOUND_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-[14px] leading-[1.4] text-[#6E6E75]">목적 국가</span>
          <select
            value={country}
            onChange={(event) => handleCountryChange(event.target.value)}
            required
            className="h-12 rounded-lg border border-[#E3E1DC] px-3 text-[16px] text-[#2A2A2E] focus:border-2 focus:border-[#2A2A2E] focus:outline-none"
          >
            <option value="">선택</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[14px] leading-[1.4] text-[#6E6E75]">지역·도시</span>
          <select
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            required
            disabled={!country}
            className="h-12 rounded-lg border border-[#E3E1DC] px-3 text-[16px] text-[#2A2A2E] focus:border-2 focus:border-[#2A2A2E] focus:outline-none disabled:bg-[#F7F6F3]"
          >
            <option value="">선택</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[14px] leading-[1.4] text-[#6E6E75]">체크인</span>
          <input
            type="date"
            value={checkIn}
            min={todayIso()}
            onChange={(event) => setCheckIn(event.target.value)}
            required
            className="h-12 rounded-lg border border-[#E3E1DC] px-3 text-[16px] text-[#2A2A2E] focus:border-2 focus:border-[#2A2A2E] focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[14px] leading-[1.4] text-[#6E6E75]">체크아웃</span>
          <input
            type="date"
            value={checkOut}
            min={checkIn || todayIso()}
            onChange={(event) => setCheckOut(event.target.value)}
            required
            className="h-12 rounded-lg border border-[#E3E1DC] px-3 text-[16px] text-[#2A2A2E] focus:border-2 focus:border-[#2A2A2E] focus:outline-none"
          />
        </label>
      </div>

      {error ? (
        <p role="alert" className="text-[14px] leading-[1.5] text-[#C1272D]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="self-start rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29]"
      >
        조건 확인
      </button>

      {summary ? (
        <div className="rounded-[14px] border border-[#E3E1DC] bg-[#F7F6F3] p-4">
          <p className="text-base leading-[1.6] text-[#2A2A2E]">
            {summary.country} {summary.region} · {summary.checkIn} ~ {summary.checkOut}
          </p>
          <p className="mt-2 text-[14px] leading-[1.5] text-[#6E6E75]">
            입력하신 조건은 서버로 전송되거나 저장되지 않으며, 이 화면에서만 사용됩니다.
          </p>
          <button
            type="button"
            onClick={handleOutbound}
            className="mt-3 rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29]"
          >
            호텔 보러 가기
          </button>
        </div>
      ) : null}
    </form>
  );
}
