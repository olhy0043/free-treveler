"use client";

import { useEffect, useRef } from "react";
import type { MatePostStatus } from "@/lib/db/types";

/** Never includes email/phone - only what mateList.ts's getMatePosts already selects, plus description. */
export interface MatePostDetail {
  id: string;
  title: string;
  country: string;
  region: string | null;
  startDate: string;
  endDate: string;
  capacity: number;
  travelStyle: string[];
  description: string;
  status: MatePostStatus;
  author: { nickname: string; ageGroup: string; gender: string | null } | null;
}

function DetailContent({ post }: { post: MatePostDetail }) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[14px] font-semibold leading-[1.4] text-[#FF6A45]">
          {post.status === "RECRUITING" ? "모집중" : post.status === "CLOSED" ? "마감" : "완료"}
        </p>
        <h3 className="mt-1 text-2xl font-bold leading-[1.3] text-[#2A2A2E]">{post.title}</h3>
      </div>

      <p className="text-[14px] leading-[1.5] text-[#6E6E75]">
        {post.country}
        {post.region ? ` · ${post.region}` : ""} · {post.startDate} ~ {post.endDate} · 모집 {post.capacity}명
      </p>

      {post.travelStyle.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {post.travelStyle.map((style) => (
            <span key={style} className="rounded-full bg-[#F7F6F3] px-3 py-1 text-[13px] font-semibold text-[#2A2A2E]">
              {style}
            </span>
          ))}
        </div>
      ) : null}

      <section>
        <h4 className="text-[16px] font-semibold leading-[1.4] text-[#2A2A2E]">소개</h4>
        <p className="mt-2 whitespace-pre-wrap text-base leading-[1.6] text-[#47474D]">{post.description}</p>
      </section>

      {post.author ? (
        <section className="border-t border-[#E3E1DC] pt-4">
          <p className="text-[14px] leading-[1.5] text-[#6E6E75]">
            작성자: {post.author.nickname} · {post.author.ageGroup}
          </p>
        </section>
      ) : null}
    </div>
  );
}

export default function DetailPanel({ post, onClose }: { post: MatePostDetail | null; onClose: () => void }) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!post) return;
    closeButtonRef.current?.focus();
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [post, onClose]);

  return (
    <>
      {/* Desktop: static right-hand column, part of the left/right split layout. */}
      <div className="hidden rounded-[14px] border border-[#E3E1DC] bg-[#FFFFFF] p-6 md:block">
        {post ? (
          <DetailContent post={post} />
        ) : (
          <p className="text-base leading-[1.6] text-[#6E6E75]">
            왼쪽 목록에서 동행글을 선택하면 상세 내용을 여기에서 볼 수 있습니다.
          </p>
        )}
      </div>

      {/* Mobile: bottom sheet drawer, only rendered when a post is selected. */}
      {post ? (
        <div className="fixed inset-0 z-50 flex items-end bg-[#00000080] md:hidden">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={post.title}
            className="flex max-h-[85vh] w-full flex-col overflow-y-auto rounded-t-[20px] bg-[#FFFFFF] p-6"
          >
            <div className="flex items-center justify-end">
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#2A2A2E] hover:bg-[#F7F6F3]"
              >
                ✕
              </button>
            </div>
            <DetailContent post={post} />
          </div>
        </div>
      ) : null}
    </>
  );
}
