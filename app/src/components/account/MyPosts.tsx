"use client";

import Link from "next/link";
import { useState } from "react";
import type { MyPostSummary, ReceivedApplicationSummary } from "@/lib/actions/myActivity";
import { closeMatePost, deleteMatePost, updateMatePost } from "@/lib/actions/matePost";

const STATUS_LABEL: Record<MyPostSummary["status"], string> = {
  RECRUITING: "모집중",
  CLOSED: "마감",
  COMPLETED: "완료",
};

function PostRow({
  post,
  acceptedCount,
  onChanged,
}: {
  post: MyPostSummary;
  acceptedCount: number;
  onChanged: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [confirmingClose, setConfirmingClose] = useState(false);

  async function handleClose() {
    const result = await closeMatePost(post.id);
    if (!result.ok) {
      setError(result.error ?? "마감에 실패했습니다.");
      return;
    }
    setConfirmingClose(false);
    onChanged();
  }

  async function handleDelete() {
    const result = await deleteMatePost(post.id);
    if (!result.ok) {
      setError(result.error ?? "삭제에 실패했습니다.");
      return;
    }
    onChanged();
  }

  async function handleSaveTitle() {
    if (!title.trim()) {
      setError("제목을 입력해 주세요.");
      return;
    }
    const result = await updateMatePost(post.id, {
      title,
      country: post.country,
      startDate: post.startDate,
      endDate: post.endDate,
      capacity: 1,
      travelStyle: [],
      description: "",
      safetyAgreed: true,
    });
    if (!result.ok) {
      setError(result.error ?? "수정에 실패했습니다.");
      return;
    }
    setEditing(false);
    onChanged();
  }

  return (
    <li className="rounded-[14px] border border-[#E3E1DC] p-4">
      <div className="flex items-center justify-between gap-2">
        {editing ? (
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-10 flex-1 rounded-lg border border-[#E3E1DC] px-3 text-[16px] text-[#2A2A2E]"
          />
        ) : (
          <p className="text-[16px] font-semibold leading-[1.4] text-[#2A2A2E]">{post.title}</p>
        )}
        <span className="shrink-0 text-[13px] font-semibold leading-[1.4] text-[#FF6A45]">
          {STATUS_LABEL[post.status]}
        </span>
      </div>
      <p className="mt-1 text-[14px] leading-[1.5] text-[#6E6E75]">
        {post.country} · {post.startDate} ~ {post.endDate}
      </p>

      {confirmingClose ? (
        <div className="mt-3 rounded-lg bg-[#F7F6F3] p-3">
          <p className="text-[14px] leading-[1.5] text-[#2A2A2E]">
            {acceptedCount > 0
              ? `이미 승인한 참가자가 ${acceptedCount}명 있습니다. 마감하시겠습니까?`
              : "이 동행글을 마감하시겠습니까?"}
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg bg-[#FF6A45] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#E24E29]"
            >
              마감 확정
            </button>
            <button
              type="button"
              onClick={() => setConfirmingClose(false)}
              className="rounded-lg border border-[#E3E1DC] px-4 py-2 text-[14px] font-semibold text-[#2A2A2E] hover:bg-[#FFFFFF]"
            >
              취소
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {editing ? (
            <button
              type="button"
              onClick={handleSaveTitle}
              className="rounded-lg bg-[#FF6A45] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#E24E29]"
            >
              저장
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-lg border border-[#E3E1DC] px-4 py-2 text-[14px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F3]"
            >
              수정
            </button>
          )}
          {post.status === "RECRUITING" ? (
            <button
              type="button"
              onClick={() => setConfirmingClose(true)}
              className="rounded-lg border border-[#E3E1DC] px-4 py-2 text-[14px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F3]"
            >
              수동 마감
            </button>
          ) : null}
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-[#E3E1DC] px-4 py-2 text-[14px] font-semibold text-[#C1272D] hover:bg-[#F7F6F3]"
          >
            삭제
          </button>
        </div>
      )}

      {error ? (
        <p role="alert" className="mt-2 text-[14px] leading-[1.5] text-[#C1272D]">
          {error}
        </p>
      ) : null}
    </li>
  );
}

export default function MyPosts({
  posts,
  receivedApplications,
  onChanged,
}: {
  posts: MyPostSummary[];
  receivedApplications: ReceivedApplicationSummary[];
  onChanged: () => void;
}) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[14px] bg-[#F7F6F3] px-6 py-12 text-center">
        <p className="text-base leading-[1.6] text-[#47474D]">
          아직 작성한 동행글이 없습니다. 동행을 구하는 글을 남기고 함께할 여행자를 찾아보세요.
        </p>
        <Link
          href="/travel-tools"
          className="rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29]"
        >
          새 동행글 작성
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Link
          href="/travel-tools"
          className="rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29]"
        >
          새 동행글 작성
        </Link>
      </div>
      <ul className="flex flex-col gap-3">
        {posts.map((post) => (
          <PostRow
            key={post.id}
            post={post}
            acceptedCount={receivedApplications.filter((app) => app.postId === post.id && app.status === "ACCEPTED").length}
            onChanged={onChanged}
          />
        ))}
      </ul>
    </div>
  );
}
