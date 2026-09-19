"use client";

import { useEffect, useState } from "react";
import { getBrowserClient } from "@/lib/db/client";
import { confirmAdult } from "@/lib/actions/auth";
import type { AgeGroup, Gender } from "@/lib/db/types";

const AGE_GROUPS: AgeGroup[] = ["10s", "20s", "30s", "40s", "50s", "60s+"];
const TRAVEL_STYLES = ["힐링", "액티비티", "맛집", "사진", "배낭여행"];

interface Profile {
  nickname: string;
  ageGroup: AgeGroup;
  gender: Gender | null;
  travelStyle: string[];
  isAdult: boolean;
}

export default function ProfilePanel() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load(cancelledRef?: { current: boolean }) {
    const supabase = getBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase
      .from("user_profile")
      .select("nickname, age_group, gender, travel_style, is_adult")
      .eq("id", user.id)
      .single();
    if (data && !cancelledRef?.current) {
      setProfile({
        nickname: data.nickname,
        ageGroup: data.age_group,
        gender: data.gender,
        travelStyle: data.travel_style,
        isAdult: data.is_adult,
      });
    }
  }

  useEffect(() => {
    const cancelledRef = { current: false };
    load(cancelledRef);
    return () => {
      cancelledRef.current = true;
    };
  }, []);

  async function handleConfirmAdult() {
    const result = await confirmAdult();
    if (result.ok) {
      await load();
    } else {
      setError(result.error ?? "성인 확인에 실패했습니다.");
    }
  }

  function toggleStyle(style: string) {
    if (!profile) return;
    setProfile({
      ...profile,
      travelStyle: profile.travelStyle.includes(style)
        ? profile.travelStyle.filter((s) => s !== style)
        : [...profile.travelStyle, style],
    });
  }

  async function handleSave() {
    if (!profile) return;
    if (!profile.nickname.trim()) {
      setError("닉네임을 입력해 주세요.");
      return;
    }
    setError(null);
    const supabase = getBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error: updateError } = await supabase
      .from("user_profile")
      .update({
        nickname: profile.nickname,
        age_group: profile.ageGroup,
        gender: profile.gender,
        travel_style: profile.travelStyle,
      })
      .eq("id", user.id);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    setEditing(false);
  }

  if (!profile) {
    return <div className="h-32 animate-pulse rounded-[14px] bg-[#F7F6F3]" />;
  }

  return (
    <div className="rounded-[14px] border border-[#E3E1DC] bg-[#FFFFFF] p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">내 프로필</h3>
        <span
          className={`rounded-full px-3 py-1 text-[13px] font-semibold ${
            profile.isAdult ? "bg-[#F7F6F3] text-[#2A2A2E]" : "bg-[#FFD7C7] text-[#E24E29]"
          }`}
        >
          {profile.isAdult ? "성인 본인인증 완료" : "성인 인증 필요"}
        </span>
      </div>

      {!profile.isAdult ? (
        <button
          type="button"
          onClick={handleConfirmAdult}
          className="mt-3 rounded-lg bg-[#FF6A45] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#E24E29]"
        >
          성인 인증하기
        </button>
      ) : null}

      <div className="mt-4 flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[14px] leading-[1.4] text-[#6E6E75]">닉네임</span>
          {editing ? (
            <input
              type="text"
              value={profile.nickname}
              onChange={(event) => setProfile({ ...profile, nickname: event.target.value })}
              required
              className="h-11 rounded-lg border border-[#E3E1DC] px-3 text-[14px] text-[#2A2A2E]"
            />
          ) : (
            <p className="text-base leading-[1.6] text-[#2A2A2E]">{profile.nickname}</p>
          )}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[14px] leading-[1.4] text-[#6E6E75]">연령대</span>
          {editing ? (
            <select
              value={profile.ageGroup}
              onChange={(event) => setProfile({ ...profile, ageGroup: event.target.value as AgeGroup })}
              className="h-11 rounded-lg border border-[#E3E1DC] px-3 text-[14px] text-[#2A2A2E]"
            >
              {AGE_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-base leading-[1.6] text-[#2A2A2E]">{profile.ageGroup}</p>
          )}
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[14px] leading-[1.4] text-[#6E6E75]">성별(선택)</span>
          {editing ? (
            <select
              value={profile.gender ?? ""}
              onChange={(event) => setProfile({ ...profile, gender: (event.target.value || null) as Gender | null })}
              className="h-11 rounded-lg border border-[#E3E1DC] px-3 text-[14px] text-[#2A2A2E]"
            >
              <option value="">선택 안 함</option>
              <option value="female">여성</option>
              <option value="male">남성</option>
              <option value="other">기타</option>
            </select>
          ) : (
            <p className="text-base leading-[1.6] text-[#2A2A2E]">{profile.gender ?? "선택 안 함"}</p>
          )}
        </label>

        <div className="flex flex-col gap-1">
          <span className="text-[14px] leading-[1.4] text-[#6E6E75]">여행 스타일</span>
          <div className="flex flex-wrap gap-2">
            {TRAVEL_STYLES.map((style) => {
              const active = profile.travelStyle.includes(style);
              return editing ? (
                <button
                  key={style}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleStyle(style)}
                  className={`rounded-full px-4 py-2 text-[14px] font-semibold ${
                    active ? "bg-[#FF6A45] text-white" : "bg-[#F7F6F3] text-[#2A2A2E]"
                  }`}
                >
                  {style}
                </button>
              ) : active ? (
                <span key={style} className="rounded-full bg-[#F7F6F3] px-4 py-2 text-[14px] text-[#2A2A2E]">
                  {style}
                </span>
              ) : null;
            })}
            {!editing && profile.travelStyle.length === 0 ? (
              <span className="text-[14px] text-[#6E6E75]">등록된 스타일이 없습니다.</span>
            ) : null}
          </div>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-[14px] leading-[1.5] text-[#C1272D]">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={() => (editing ? handleSave() : setEditing(true))}
        className="mt-4 rounded-lg border border-[#E3E1DC] px-6 py-3 text-base font-semibold leading-[1.25] text-[#2A2A2E] hover:bg-[#F7F6F3]"
      >
        {editing ? "저장" : "정보 수정"}
      </button>
    </div>
  );
}
