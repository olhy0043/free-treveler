import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center gap-6 bg-[#FFFFFF] px-6 text-center">
      <p className="text-[13px] font-medium leading-[1.4] text-[#6E6E75]">오류 404</p>
      <h1 className="text-2xl font-bold leading-[1.3] text-[#2A2A2E]">
        요청하신 페이지를 찾을 수 없습니다
      </h1>
      <p className="max-w-md text-base leading-[1.6] text-[#47474D]">
        주소가 변경되었거나 삭제된 페이지일 수 있습니다. 아래 버튼으로 메인 화면으로 돌아가 여행지 탐색과 동행 찾기를 계속 이용해 주세요.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white transition-colors hover:bg-[#E24E29]"
      >
        홈으로 이동
      </Link>
    </main>
  );
}
