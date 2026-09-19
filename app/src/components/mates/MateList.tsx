"use client";

import { useState } from "react";
import type { MatePostSummary } from "@/lib/actions/mateList";

const PAGE_SIZE = 8;

const STATUS_LABEL: Record<MatePostSummary["status"], string> = {
  RECRUITING: "모집중",
  CLOSED: "마감",
  COMPLETED: "완료",
};

export default function MateList({
  posts,
  selectedId,
  onSelect,
}: {
  posts: MatePostSummary[];
  selectedId: string | null;
  onSelect: (post: MatePostSummary) => void;
}) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = posts.slice(0, visibleCount);

  return (
    <div>
      <ul className="flex flex-col gap-3">
        {visible.map((post) => (
          <li key={post.id}>
            <button
              type="button"
              onClick={() => onSelect(post)}
              aria-pressed={selectedId === post.id}
              className={`w-full rounded-[14px] border p-4 text-left transition-colors ${
                selectedId === post.id ? "border-[#FF6A45]" : "border-[#E3E1DC] hover:bg-[#F7F6F3]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">{post.title}</p>
                <span className="shrink-0 text-[13px] font-semibold leading-[1.4] text-[#FF6A45]">
                  {STATUS_LABEL[post.status]}
                </span>
              </div>
              <p className="mt-1 text-[14px] leading-[1.5] text-[#6E6E75]">
                {post.country}
                {post.region ? ` · ${post.region}` : ""} · {post.startDate} ~ {post.endDate} · 모집 {post.capacity}명
              </p>
              {post.travelStyle.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.travelStyle.map((style) => (
                    <span key={style} className="rounded-full bg-[#F7F6F3] px-3 py-1 text-[13px] text-[#2A2A2E]">
                      {style}
                    </span>
                  ))}
                </div>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      {visibleCount < posts.length ? (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          className="mt-4 w-full rounded-lg border border-[#E3E1DC] px-6 py-3 text-base font-semibold leading-[1.25] text-[#2A2A2E] hover:bg-[#F7F6F3]"
        >
          더보기
        </button>
      ) : null}
    </div>
  );
}
