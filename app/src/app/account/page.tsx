import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToastViewport from "@/components/ui/Toast";
import AuthPanel from "@/components/account/AuthPanel";
import AccountSections from "@/components/account/AccountSections";
import { getServerClient } from "@/lib/db/client";
import { getMyActivity } from "@/lib/actions/myActivity";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TITLE = "계정·관리 - Free Traveler";
const DESCRIPTION = "로그인, 내 프로필, 내 동행글과 참가 요청, 차단 목록을 관리하세요.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `${SITE_URL}/account` },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}/account`,
      type: "website",
    },
  };
}

function GuestSections() {
  return (
    <div className="flex flex-col gap-12">
      <section aria-label="계정 소개">
        <h1 className="text-2xl font-bold leading-[1.3] text-[#2A2A2E]">계정·관리</h1>
        <p className="mt-2 max-w-[560px] text-base leading-[1.6] text-[#47474D]">
          로그인하면 동행 구하기 글 작성, 참가 요청, 차단 관리 등 회원 전용 기능을 이용할 수 있습니다.
        </p>
      </section>

      <section aria-label="로그인·가입">
        <AuthPanel />
      </section>

      <section aria-label="회원 전용 기능 안내">
        <h2 className="mb-4 text-2xl font-bold leading-[1.3] text-[#2A2A2E]">로그인하면 이런 것을 할 수 있어요</h2>
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {["동행 구하기 글 작성", "참가 요청 보내기·받기", "부적절한 사용자 신고·차단"].map((item) => (
            <li key={item} className="rounded-[14px] border border-[#E3E1DC] p-4 text-[14px] leading-[1.5] text-[#2A2A2E]">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section aria-label="보안 안내" className="rounded-[14px] bg-[#F7F6F3] p-6">
        <h2 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">보안 안내</h2>
        <p className="mt-2 text-[14px] leading-[1.6] text-[#47474D]">
          비밀번호는 다른 서비스와 다르게 설정해 주세요. 연락처는 채팅 밖에서 공유하지 않는 것이 안전합니다.
        </p>
      </section>
    </div>
  );
}

export default async function AccountPage() {
  const supabase = await getServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16">
          <GuestSections />
        </main>
        <Footer />
        <ToastViewport />
      </>
    );
  }

  const [{ data: profile }, activity] = await Promise.all([
    supabase.from("user_profile").select("role").eq("id", user.id).single(),
    getMyActivity(),
  ]);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16">
        <AccountSections activity={activity} isAdmin={profile?.role === "admin"} />
      </main>
      <Footer />
      <ToastViewport />
    </>
  );
}
