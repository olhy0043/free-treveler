import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#E3E1DC] bg-[#FFFFFF]">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-4 py-12 md:grid-cols-3 md:px-8 md:py-16">
        <div>
          <h2 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">서비스 소개</h2>
          <p className="mt-3 text-[14px] leading-[1.5] text-[#47474D]">
            Free Traveler는 여행지 탐색, 항공·숙소 조건 정리, 국가별 안전정보, 동행 찾기를 한곳에서
            준비할 수 있는 여행 준비 허브입니다.
          </p>
          <ul className="mt-4 flex flex-col gap-2">
            <li>
              <Link href="/about" className="text-[14px] leading-[1.5] text-[#47474D] hover:text-[#FF6A45]">
                대표 소개
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">이용 안내</h2>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <Link
                href="/travel-tools"
                className="text-[14px] leading-[1.5] text-[#47474D] hover:text-[#FF6A45]"
              >
                여행 도구 이용법
              </Link>
            </li>
            <li>
              <Link href="/mates" className="text-[14px] leading-[1.5] text-[#47474D] hover:text-[#FF6A45]">
                동행 찾기 이용법
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">정책·문의</h2>
          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <Link
                href="/account"
                className="text-[14px] leading-[1.5] text-[#47474D] hover:text-[#FF6A45]"
              >
                신고·차단 문의
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#E3E1DC]">
        <div className="mx-auto max-w-[1280px] px-4 py-6 text-[13px] leading-[1.4] text-[#6E6E75] md:px-8">
          <p>© 2026 Free Traveler. All rights reserved.</p>
          <p className="mt-1">
            이용약관 · 개인정보 처리방침은 계정 설정에서 확인할 수 있습니다. 여행지·안전정보 콘텐츠는
            참고용이며 최신 현지 상황과 다를 수 있습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
