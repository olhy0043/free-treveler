"use client";

import Link from "next/link";

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-[#FFFFFF] px-6 text-center">
      <p className="text-[13px] font-medium leading-[1.4] text-[#C1272D]">오류 발생</p>
      <h1 className="text-2xl font-bold leading-[1.3] text-[#2A2A2E]">
        일시적인 문제가 발생했습니다
      </h1>
      <p className="max-w-md text-base leading-[1.6] text-[#47474D]">
        요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도하거나 메인 화면으로 이동해 주세요.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white transition-colors hover:bg-[#E24E29]"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="rounded-lg border border-[#E3E1DC] px-6 py-3 text-base font-semibold leading-[1.25] text-[#2A2A2E] transition-colors hover:bg-[#F7F6F3]"
        >
          홈으로 이동
        </Link>
      </div>
    </main>
  );
}
