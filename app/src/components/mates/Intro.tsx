import Link from "next/link";

export default function Intro() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold leading-[1.3] text-[#2A2A2E]">동행 조회</h1>
        <p className="mt-2 max-w-[560px] text-base leading-[1.6] text-[#47474D]">
          공개 연락처 없이 안전하게, 채팅으로만 연결되는 동행 구하기 글을 둘러보세요.
        </p>
      </div>
      <Link
        href="/travel-tools"
        className="shrink-0 self-start rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29] md:self-auto"
      >
        동행 구하기 글 쓰러 가기
      </Link>
    </div>
  );
}
