import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToastViewport from "@/components/ui/Toast";
import Intro from "@/components/mates/Intro";
import Guidance from "@/components/mates/Guidance";
import MatesBrowser from "@/components/mates/MatesBrowser";
import { getMatePosts } from "@/lib/actions/mateList";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TITLE = "동행 조회 - Free Traveler";
const DESCRIPTION = "공개 연락처 없이 안전하게, 채팅으로만 연결되는 동행 구하기 글을 찾아보세요.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `${SITE_URL}/mates` },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}/mates`,
      type: "website",
    },
  };
}

export default async function MatesPage() {
  const posts = await getMatePosts();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16">
        <section aria-label="동행 조회 소개">
          <Intro />
        </section>

        <section aria-label="동행 목록과 상세" className="mt-10">
          <MatesBrowser initialPosts={posts} />
        </section>

        <section aria-label="신청 방법과 신고·차단 안내" className="mt-16 border-t border-[#E3E1DC] pt-10">
          <Guidance />
        </section>
      </main>
      <Footer />
      <ToastViewport />
    </>
  );
}
