import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProfileHero from "@/components/about/ProfileHero";
import Stats from "@/components/about/Stats";
import Story from "@/components/about/Story";
import Timeline from "@/components/about/Timeline";
import Countries from "@/components/about/Countries";
import Gallery from "@/components/about/Gallery";
import Featured from "@/components/about/Featured";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TITLE = "대표 소개 - Free Traveler";
const DESCRIPTION = "free_traveler의 여행 기록, 여행 철학, 방문 국가와 타임라인을 소개합니다.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `${SITE_URL}/about` },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}/about`,
      type: "website",
    },
  };
}

function Section({
  title,
  ariaLabel,
  children,
}: {
  title?: string;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={ariaLabel} className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16">
      {title ? <h2 className="mb-6 text-2xl font-bold leading-[1.3] text-[#2A2A2E]">{title}</h2> : null}
      {children}
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <ProfileHero />

        <Section ariaLabel="여행 지표">
          <Stats />
        </Section>

        <Section ariaLabel="소개와 철학">
          <Story />
        </Section>

        <Section title="여행 타임라인" ariaLabel="여행 타임라인">
          <Timeline />
        </Section>

        <Section title="방문 국가" ariaLabel="방문 국가">
          <Countries />
        </Section>

        <Section title="여행 사진" ariaLabel="여행 사진 갤러리">
          <Gallery />
        </Section>

        <Section title="기억에 남는 여행지" ariaLabel="기억에 남는 여행지">
          <Featured />
        </Section>
      </main>
      <Footer />
    </>
  );
}
