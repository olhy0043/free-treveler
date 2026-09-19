"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/db/client";
import { containsContactInfo, createMatePost, type MatePostInput } from "@/lib/actions/matePost";
import { showToast } from "@/lib/toast";

const TRAVEL_STYLES = ["힐링", "액티비티", "맛집", "사진", "배낭여행"];

type EligibilityState = "loading" | "guest" | "minor" | "eligible";

export default function MateTab() {
  const [eligibility, setEligibility] = useState<EligibilityState>("loading");

  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [capacity, setCapacity] = useState(2);
  const [travelStyle, setTravelStyle] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [safetyAgreed, setSafetyAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function loadEligibility() {
      const supabase = getBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (!cancelled) setEligibility("guest");
        return;
      }
      const { data: profile } = await supabase.from("user_profile").select("is_adult").eq("id", user.id).single();
      if (!cancelled) setEligibility(profile?.is_adult ? "eligible" : "minor");
    }
    loadEligibility();
    return () => {
      cancelled = true;
    };
  }, []);

  function toggleTravelStyle(style: string) {
    setTravelStyle((prev) => (prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if ((await containsContactInfo(title)) || (await containsContactInfo(description))) {
      setError("제목·소개에 연락처로 보이는 정보를 포함할 수 없습니다. 연락은 채팅으로 진행해 주세요.");
      return;
    }
    if (!safetyAgreed) {
      setError("동행 이용수칙에 동의해야 작성할 수 있습니다.");
      return;
    }

    const input: MatePostInput = {
      title,
      country,
      region: region || undefined,
      startDate,
      endDate,
      capacity,
      travelStyle,
      description,
      safetyAgreed,
    };

    const result = await createMatePost(input);
    if (!result.ok) {
      setError(result.error ?? "동행글 작성에 실패했습니다.");
      return;
    }
    setSuccess(true);
  }

  if (eligibility === "loading") {
    return <div className="h-24 animate-pulse rounded-[14px] bg-[#F7F6F3]" />;
  }

  if (eligibility === "guest" || eligibility === "minor") {
    return (
      <div className="rounded-[14px] border border-[#E3E1DC] bg-[#F7F6F3] p-6 text-center">
        <p className="text-base leading-[1.6] text-[#2A2A2E]">
          {eligibility === "guest"
            ? "동행 구하기 글 작성은 로그인 후 이용할 수 있습니다."
            : "동행 구하기 글 작성은 성인 인증 후 이용할 수 있습니다."}
        </p>
        <button
          type="button"
          onClick={() =>
            showToast(
              "neutral",
              eligibility === "guest"
                ? "로그인/회원가입 화면은 아직 준비 중입니다. 계정 기능이 열리면 다시 안내해 드릴게요."
                : "성인 인증 화면은 아직 준비 중입니다. 계정 기능이 열리면 다시 안내해 드릴게요.",
            )
          }
          className="mt-4 rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29]"
        >
          {eligibility === "guest" ? "로그인하러 가기" : "성인 인증하러 가기"}
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-[14px] border border-[#E3E1DC] bg-[#F7F6F3] p-6 text-center">
        <p className="text-base leading-[1.6] text-[#2A2A2E]">동행 구하기 글이 등록되었습니다.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="text-[14px] leading-[1.4] text-[#6E6E75]">제목</span>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          className="h-12 rounded-lg border border-[#E3E1DC] px-3 text-[16px] text-[#2A2A2E] focus:border-2 focus:border-[#2A2A2E] focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1">
          <span className="text-[14px] leading-[1.4] text-[#6E6E75]">국가</span>
          <input
            type="text"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            required
            className="h-12 rounded-lg border border-[#E3E1DC] px-3 text-[16px] text-[#2A2A2E] focus:border-2 focus:border-[#2A2A2E] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[14px] leading-[1.4] text-[#6E6E75]">지역(선택)</span>
          <input
            type="text"
            value={region}
            onChange={(event) => setRegion(event.target.value)}
            className="h-12 rounded-lg border border-[#E3E1DC] px-3 text-[16px] text-[#2A2A2E] focus:border-2 focus:border-[#2A2A2E] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[14px] leading-[1.4] text-[#6E6E75]">시작일</span>
          <input
            type="date"
            value={startDate}
            onChange={(event) => setStartDate(event.target.value)}
            required
            className="h-12 rounded-lg border border-[#E3E1DC] px-3 text-[16px] text-[#2A2A2E] focus:border-2 focus:border-[#2A2A2E] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[14px] leading-[1.4] text-[#6E6E75]">종료일</span>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(event) => setEndDate(event.target.value)}
            required
            className="h-12 rounded-lg border border-[#E3E1DC] px-3 text-[16px] text-[#2A2A2E] focus:border-2 focus:border-[#2A2A2E] focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[14px] leading-[1.4] text-[#6E6E75]">모집 인원</span>
          <input
            type="number"
            min={1}
            value={capacity}
            onChange={(event) => setCapacity(Number(event.target.value))}
            required
            className="h-12 rounded-lg border border-[#E3E1DC] px-3 text-[16px] text-[#2A2A2E] focus:border-2 focus:border-[#2A2A2E] focus:outline-none"
          />
        </label>
      </div>

      <fieldset className="flex flex-wrap gap-2">
        <legend className="mb-1 text-[14px] leading-[1.4] text-[#6E6E75]">여행 스타일</legend>
        {TRAVEL_STYLES.map((style) => (
          <button
            key={style}
            type="button"
            aria-pressed={travelStyle.includes(style)}
            onClick={() => toggleTravelStyle(style)}
            className={`rounded-full px-4 py-2 text-[14px] font-semibold leading-[1.4] ${
              travelStyle.includes(style) ? "bg-[#FF6A45] text-white" : "bg-[#F7F6F3] text-[#2A2A2E]"
            }`}
          >
            {style}
          </button>
        ))}
      </fieldset>

      <label className="flex flex-col gap-1">
        <span className="text-[14px] leading-[1.4] text-[#6E6E75]">소개 (연락처를 남기지 마세요)</span>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
          rows={4}
          className="rounded-lg border border-[#E3E1DC] px-3 py-2 text-[16px] text-[#2A2A2E] focus:border-2 focus:border-[#2A2A2E] focus:outline-none"
        />
      </label>

      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={safetyAgreed}
          onChange={(event) => setSafetyAgreed(event.target.checked)}
          className="mt-1 h-4 w-4"
        />
        <span className="text-[14px] leading-[1.5] text-[#47474D]">
          동행 이용수칙(연락처 비공개, 안전 수칙 준수)에 동의합니다.
        </span>
      </label>

      {error ? (
        <p role="alert" className="text-[14px] leading-[1.5] text-[#C1272D]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!safetyAgreed}
        className="self-start rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29] disabled:bg-[#FFD7C7]"
      >
        동행 구하기 글 등록
      </button>
    </form>
  );
}
