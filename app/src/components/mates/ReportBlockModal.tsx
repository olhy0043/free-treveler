"use client";

import { useRef, useState } from "react";
import { blockUser, submitReport } from "@/lib/actions/reportBlock";
import type { ReportTargetType } from "@/lib/db/types";
import { showToast } from "@/lib/toast";

const REASON_CODES = [
  { value: "CONTACT_SHARING", label: "연락처 공유 시도" },
  { value: "INAPPROPRIATE_CONTENT", label: "부적절한 내용" },
  { value: "SPAM", label: "스팸·광고" },
  { value: "OTHER", label: "기타" },
];

export default function ReportBlockModal({
  open,
  onClose,
  targetType,
  targetId,
  blockedUserId,
}: {
  open: boolean;
  onClose: () => void;
  targetType: ReportTargetType;
  targetId: string;
  blockedUserId?: string;
}) {
  const [reasonCode, setReasonCode] = useState(REASON_CODES[0].value);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [receiptId, setReceiptId] = useState<string | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  if (!open) return null;

  async function handleSubmitReport(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const reasonLabel = REASON_CODES.find((option) => option.value === reasonCode)?.label ?? reasonCode;
    const reason = description.trim() ? `${reasonLabel}: ${description.trim()}` : reasonLabel;

    const result = await submitReport({ targetType, targetId, reason });
    if (!result.ok || !result.data) {
      setError(result.error ?? "신고 접수에 실패했습니다.");
      return;
    }
    setReceiptId(result.data.id);
  }

  async function handleBlock() {
    if (!blockedUserId) return;
    const result = await blockUser(blockedUserId);
    if (!result.ok) {
      setError(result.error ?? "차단에 실패했습니다.");
      return;
    }
    showToast("success", "차단이 완료되었습니다. 이제 서로의 글과 요청이 보이지 않습니다.");
    onClose();
  }

  function handleClose() {
    setReceiptId(null);
    setDescription("");
    setError(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000080] p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="신고·차단"
        className="w-full max-w-[480px] rounded-[20px] bg-[#FFFFFF] p-6"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">신고 및 차단</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            aria-label="닫기"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#2A2A2E] hover:bg-[#F7F6F3]"
          >
            ✕
          </button>
        </div>

        {receiptId ? (
          <div className="mt-4 rounded-[14px] bg-[#F7F6F3] p-4">
            <p className="text-base leading-[1.6] text-[#2A2A2E]">신고가 접수되었습니다.</p>
            <p className="mt-1 text-[14px] leading-[1.5] text-[#6E6E75]">접수번호: {receiptId}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReport} className="mt-4 flex flex-col gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[14px] leading-[1.4] text-[#6E6E75]">신고 사유</span>
              <select
                value={reasonCode}
                onChange={(event) => setReasonCode(event.target.value)}
                className="h-11 rounded-lg border border-[#E3E1DC] px-3 text-[14px] text-[#2A2A2E]"
              >
                {REASON_CODES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[14px] leading-[1.4] text-[#6E6E75]">상세 설명(선택)</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={3}
                className="rounded-lg border border-[#E3E1DC] px-3 py-2 text-[14px] text-[#2A2A2E]"
              />
            </label>
            <button
              type="submit"
              className="rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29]"
            >
              신고 접수
            </button>
          </form>
        )}

        {error ? (
          <p role="alert" className="mt-3 text-[14px] leading-[1.5] text-[#C1272D]">
            {error}
          </p>
        ) : null}

        {blockedUserId ? (
          <button
            type="button"
            onClick={handleBlock}
            className="mt-4 w-full rounded-lg border border-[#E3E1DC] px-6 py-3 text-base font-semibold leading-[1.25] text-[#2A2A2E] hover:bg-[#F7F6F3]"
          >
            이 사용자 차단하기
          </button>
        ) : null}
      </div>
    </div>
  );
}
