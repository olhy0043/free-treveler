import Link from "next/link";

const STEPS = [
  { title: "모집글 확인", description: "국가·기간·모집 인원과 여행 스타일을 확인하세요." },
  { title: "메시지 전송", description: "참가 메시지를 보내면 작성자에게 전달됩니다." },
  { title: "승인 알림", description: "작성자가 승인하면 화면 알림으로 결과를 안내합니다." },
];

export default function Guidance() {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div>
        <h2 className="text-2xl font-bold leading-[1.3] text-[#2A2A2E]">신청 방법</h2>
        <ol className="mt-4 flex flex-col gap-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6A45] text-[14px] font-semibold text-white">
                {index + 1}
              </span>
              <div>
                <p className="text-[16px] font-semibold leading-[1.4] text-[#2A2A2E]">{step.title}</p>
                <p className="mt-1 text-[14px] leading-[1.5] text-[#6E6E75]">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-[14px] bg-[#F7F6F3] p-6">
        <h2 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">신고·차단은 이렇게 하세요</h2>
        <p className="mt-2 text-[14px] leading-[1.6] text-[#47474D]">
          부적절한 글이나 메시지를 받았다면 상세 화면의 신고 아이콘으로 접수하고, 더 이상 보고 싶지 않은 작성자는 차단할 수 있습니다. 차단 후에는 서로의 글과 요청이 보이지 않습니다.
        </p>
        <Link
          href="/travel-tools"
          className="mt-4 inline-block rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29]"
        >
          동행 구하기 글 쓰러 가기
        </Link>
      </div>
    </div>
  );
}
