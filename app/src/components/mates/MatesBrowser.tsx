"use client";

import { useMemo, useState } from "react";
import type { MatePostSummary } from "@/lib/actions/mateList";
import Filter, { EMPTY_MATE_FILTER, type MateFilterValue } from "./Filter";
import MateList from "./MateList";
import DetailPanel, { type MatePostDetail } from "./DetailPanel";
import ApplyForm from "./ApplyForm";
import ReportBlockModal from "./ReportBlockModal";

function matchesFilter(post: MatePostSummary, filter: MateFilterValue): boolean {
  if (filter.country && !post.country.toLowerCase().includes(filter.country.toLowerCase())) return false;
  if (filter.region && !(post.region ?? "").toLowerCase().includes(filter.region.toLowerCase())) return false;
  if (filter.status !== "all" && post.status !== filter.status) return false;
  if (filter.dateFrom && post.endDate < filter.dateFrom) return false;
  if (filter.dateTo && post.startDate > filter.dateTo) return false;
  return true;
}

export default function MatesBrowser({ initialPosts }: { initialPosts: MatePostSummary[] }) {
  const [filter, setFilter] = useState<MateFilterValue>(EMPTY_MATE_FILTER);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);

  const filtered = useMemo(() => initialPosts.filter((post) => matchesFilter(post, filter)), [initialPosts, filter]);
  const selected = filtered.find((post) => post.id === selectedId) ?? null;

  const detail: MatePostDetail | null = selected
    ? {
        id: selected.id,
        title: selected.title,
        country: selected.country,
        region: selected.region,
        startDate: selected.startDate,
        endDate: selected.endDate,
        capacity: selected.capacity,
        travelStyle: selected.travelStyle,
        description: selected.description,
        status: selected.status,
        author: selected.author,
      }
    : null;

  function resetFilter() {
    setFilter(EMPTY_MATE_FILTER);
  }

  return (
    <div>
      <Filter value={filter} onChange={setFilter} resultCount={filtered.length} />

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[1fr_1fr]">
        <div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-[14px] bg-[#F7F6F3] px-6 py-12 text-center">
              <p className="text-base leading-[1.6] text-[#47474D]">
                조건에 맞는 동행이 아직 없어요. 필터를 조정하거나 직접 동행 구하기 글을 남겨보세요.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={resetFilter}
                  className="rounded-lg border border-[#E3E1DC] px-6 py-3 text-base font-semibold leading-[1.25] text-[#2A2A2E] hover:bg-[#FFFFFF]"
                >
                  필터 초기화
                </button>
                <a
                  href="/travel-tools"
                  className="rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29]"
                >
                  동행 구하기 글 쓰러 가기
                </a>
              </div>
            </div>
          ) : (
            <MateList posts={filtered} selectedId={selectedId} onSelect={(post) => setSelectedId(post.id)} />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <DetailPanel post={detail} onClose={() => setSelectedId(null)}>
            {detail ? (
              <div>
                <ApplyForm postId={detail.id} />
                <button
                  type="button"
                  onClick={() => setReportOpen(true)}
                  className="mt-3 text-[14px] font-semibold leading-[1.4] text-[#6E6E75] underline"
                >
                  이 글 신고·작성자 차단
                </button>
              </div>
            ) : null}
          </DetailPanel>
        </div>
      </div>

      {selected ? (
        <ReportBlockModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          targetType="mate_post"
          targetId={selected.id}
          blockedUserId={selected.authorId}
        />
      ) : null}
    </div>
  );
}
