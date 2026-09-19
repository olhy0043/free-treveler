import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToastViewport from "@/components/ui/Toast";
import HomeSections from "@/components/home/HomeSections";
import MatePreview from "@/components/home/MatePreview";
import AboutSummary from "@/components/home/AboutSummary";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TITLE = "Free Traveler - 여행지 탐색과 동행 찾기";
const DESCRIPTION =
  "국내외 여행지를 검색하고, 항공·숙소 조건을 정리하고, 국가별 안전정보를 확인하고, 동행을 찾는 여행 준비 허브 Free Traveler.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: SITE_URL },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: SITE_URL,
      type: "website",
    },
  };
}

function MatePreviewSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-busy="true" aria-label="동행글 불러오는 중">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-28 animate-pulse rounded-[14px] bg-[#F0EEEA]" />
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HomeSections />

        <section
          aria-label="최근 동행글"
          className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16"
        >
          <h2 className="text-2xl font-bold leading-[1.3] text-[#2A2A2E]">최근 동행글</h2>
          <p className="mt-2 text-base leading-[1.6] text-[#47474D]">
            지금 모집 중인 동행글을 확인하고 함께할 동행을 찾아보세요.
          </p>
          <div className="mt-6">
            <Suspense fallback={<MatePreviewSkeleton />}>
              <MatePreview />
            </Suspense>
          </div>
        </section>

        <section
          aria-label="free_traveler 소개"
          className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16"
        >
          <AboutSummary />
        </section>
      </main>
      <Footer />
      <ToastViewport />
    </>
  );
}
