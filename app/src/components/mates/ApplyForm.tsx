"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/db/client";
import { submitApplication } from "@/lib/actions/mateApplication";

const MESSAGE_MAX_LENGTH = 500;

type EligibilityState = "loading" | "guest" | "minor" | "eligible";

export default function ApplyForm({ postId }: { postId: string }) {
  const [eligibility, setEligibility] = useState<EligibilityState>("loading");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmed = message.trim();
    if (!trimmed) {
      setError("참가 메시지를 입력해 주세요.");
      return;
    }
    if (trimmed.length > MESSAGE_MAX_LENGTH) {
      setError(`참가 메시지는 ${MESSAGE_MAX_LENGTH}자 이내로 입력해 주세요.`);
      return;
    }

    const result = await submitApplication(postId, trimmed);
    if (!result.ok) {
      setError(result.error ?? "참가 요청 전송에 실패했습니다.");
      return;
    }
    setSubmitted(true);
  }

  if (eligibility === "loading") {
    return <div className="h-16 animate-pulse rounded-[14px] bg-[#F7F6F3]" />;
  }

  if (eligibility === "guest" || eligibility === "minor") {
    return (
      <div className="rounded-[14px] border border-[#E3E1DC] bg-[#F7F6F3] p-4 text-center">
        <p className="text-[14px] leading-[1.6] text-[#2A2A2E]">
          {eligibility === "guest"
            ? "참가 요청은 로그인 후 보낼 수 있습니다."
            : "참가 요청은 성인 인증 후 보낼 수 있습니다."}
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="rounded-[14px] border border-[#E3E1DC] bg-[#F7F6F3] p-4 text-center">
        <p className="text-[14px] leading-[1.6] text-[#2A2A2E]">참가 요청을 보냈습니다. 승인 결과는 화면 알림으로 안내됩니다.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label className="flex flex-col gap-1">
        <span className="text-[14px] leading-[1.4] text-[#6E6E75]">참가 메시지 (최대 {MESSAGE_MAX_LENGTH}자)</span>
        <textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={MESSAGE_MAX_LENGTH}
          rows={3}
          className="rounded-lg border border-[#E3E1DC] px-3 py-2 text-[14px] text-[#2A2A2E]"
        />
      </label>

      {error ? (
        <p role="alert" className="text-[14px] leading-[1.5] text-[#C1272D]">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        className="self-start rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29]"
      >
        참가 요청 보내기
      </button>
    </form>
  );
}
