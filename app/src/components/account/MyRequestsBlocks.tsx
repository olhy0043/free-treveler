"use client";

import Link from "next/link";
import { useState } from "react";
import type {
  BlockedUserSummary,
  MyApplicationSummary,
  ReceivedApplicationSummary,
} from "@/lib/actions/myActivity";
import { respondToApplication } from "@/lib/actions/mateApplication";
import { unblockUser } from "@/lib/actions/reportBlock";

const STATUS_LABEL: Record<MyApplicationSummary["status"], string> = {
  PENDING: "대기중",
  ACCEPTED: "승인됨",
  REJECTED: "거절됨",
};

function EmptyState({ message, ctaHref, ctaLabel }: { message: string; ctaHref?: string; ctaLabel?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[14px] bg-[#F7F6F3] px-6 py-8 text-center">
      <p className="text-[14px] leading-[1.6] text-[#47474D]">{message}</p>
      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29]"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}

function SentRequests({ sentApplications }: { sentApplications: MyApplicationSummary[] }) {
  if (sentApplications.length === 0) {
    return (
      <EmptyState
        message="아직 보낸 참가 요청이 없습니다. 동행 조회에서 마음에 드는 동행글을 찾아 참가를 요청해 보세요."
        ctaHref="/mates"
        ctaLabel="동행 조회하러 가기"
      />
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {sentApplications.map((application) => (
        <li key={application.id} className="rounded-[14px] border border-[#E3E1DC] p-4">
          <p className="text-[16px] font-semibold leading-[1.4] text-[#2A2A2E]">{application.postTitle}</p>
          <p className="mt-1 text-[14px] leading-[1.5] text-[#6E6E75]">{application.message}</p>
          <span className="mt-2 inline-block text-[13px] font-semibold text-[#FF6A45]">
            {STATUS_LABEL[application.status]}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ReceivedRequests({
  receivedApplications,
  onChanged,
}: {
  receivedApplications: ReceivedApplicationSummary[];
  onChanged: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  async function handleRespond(id: string, decision: "ACCEPTED" | "REJECTED") {
    const result = await respondToApplication(id, decision);
    if (!result.ok) {
      setError(result.error ?? "처리에 실패했습니다.");
      return;
    }
    onChanged();
  }

  if (receivedApplications.length === 0) {
    return (
      <EmptyState
        message="아직 받은 참가 요청이 없습니다. 동행 구하기 글을 작성하면 참가 요청을 받을 수 있습니다."
        ctaHref="/travel-tools"
        ctaLabel="동행 구하기 글 쓰러 가기"
      />
    );
  }

  return (
    <div>
      {error ? (
        <p role="alert" className="mb-3 text-[14px] leading-[1.5] text-[#C1272D]">
          {error}
        </p>
      ) : null}
      <ul className="flex flex-col gap-3">
        {receivedApplications.map((application) => (
          <li key={application.id} className="rounded-[14px] border border-[#E3E1DC] p-4">
            <p className="text-[16px] font-semibold leading-[1.4] text-[#2A2A2E]">{application.postTitle}</p>
            <p className="mt-1 text-[14px] leading-[1.5] text-[#6E6E75]">
              {application.applicantNickname} · {application.message}
            </p>
            {application.status === "PENDING" ? (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleRespond(application.id, "ACCEPTED")}
                  className="rounded-lg bg-[#FF6A45] px-4 py-2 text-[14px] font-semibold text-white hover:bg-[#E24E29]"
                >
                  승인
                </button>
                <button
                  type="button"
                  onClick={() => handleRespond(application.id, "REJECTED")}
                  className="rounded-lg border border-[#E3E1DC] px-4 py-2 text-[14px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F3]"
                >
                  거절
                </button>
              </div>
            ) : (
              <span className="mt-2 inline-block text-[13px] font-semibold text-[#FF6A45]">
                {STATUS_LABEL[application.status]}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BlockedList({ blockedUsers, onChanged }: { blockedUsers: BlockedUserSummary[]; onChanged: () => void }) {
  const [error, setError] = useState<string | null>(null);

  async function handleUnblock(id: string) {
    const result = await unblockUser(id);
    if (!result.ok) {
      setError(result.error ?? "차단 해제에 실패했습니다.");
      return;
    }
    onChanged();
  }

  if (blockedUsers.length === 0) {
    return <EmptyState message="차단한 사용자가 없습니다. 동행 조회 화면에서 사용자를 차단할 수 있습니다." />;
  }

  return (
    <div>
      {error ? (
        <p role="alert" className="mb-3 text-[14px] leading-[1.5] text-[#C1272D]">
          {error}
        </p>
      ) : null}
      <ul className="flex flex-col gap-2">
        {blockedUsers.map((user) => (
          <li key={user.id} className="flex items-center justify-between rounded-[14px] border border-[#E3E1DC] p-4">
            <span className="text-[16px] leading-[1.4] text-[#2A2A2E]">{user.nickname}</span>
            <button
              type="button"
              onClick={() => handleUnblock(user.id)}
              className="rounded-lg border border-[#E3E1DC] px-4 py-2 text-[14px] font-semibold text-[#2A2A2E] hover:bg-[#F7F6F3]"
            >
              차단 해제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function MyRequestsBlocks({
  sentApplications,
  receivedApplications,
  blockedUsers,
  onChanged,
}: {
  sentApplications: MyApplicationSummary[];
  receivedApplications: ReceivedApplicationSummary[];
  blockedUsers: BlockedUserSummary[];
  onChanged: () => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">보낸 참가 요청</h3>
        <div className="mt-3">
          <SentRequests sentApplications={sentApplications} />
        </div>
      </section>

      <section>
        <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">받은 참가 요청</h3>
        <div className="mt-3">
          <ReceivedRequests receivedApplications={receivedApplications} onChanged={onChanged} />
        </div>
      </section>

      <section>
        <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">차단 목록</h3>
        <div className="mt-3">
          <BlockedList blockedUsers={blockedUsers} onChanged={onChanged} />
        </div>
      </section>
    </div>
  );
}
