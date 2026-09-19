"use client";

import { useRouter } from "next/navigation";
import type { MyActivity } from "@/lib/actions/myActivity";
import ProfilePanel from "./ProfilePanel";
import MyPosts from "./MyPosts";
import MyRequestsBlocks from "./MyRequestsBlocks";
import AdminReports from "./AdminReports";
import AdminOutbound from "./AdminOutbound";

export default function AccountSections({ activity, isAdmin }: { activity: MyActivity; isAdmin: boolean }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="flex flex-col gap-12">
      <section aria-label="내 프로필">
        <ProfilePanel />
      </section>

      <section aria-label="내 글 관리">
        <h2 className="mb-4 text-2xl font-bold leading-[1.3] text-[#2A2A2E]">내 글</h2>
        <MyPosts posts={activity.myPosts} receivedApplications={activity.receivedApplications} onChanged={refresh} />
      </section>

      <section aria-label="참가 요청과 차단 관리">
        <h2 className="mb-4 text-2xl font-bold leading-[1.3] text-[#2A2A2E]">참가 요청·차단 관리</h2>
        <MyRequestsBlocks
          sentApplications={activity.sentApplications}
          receivedApplications={activity.receivedApplications}
          blockedUsers={activity.blockedUsers}
          onChanged={refresh}
        />
      </section>

      {isAdmin ? (
        <>
          <section aria-label="관리자: 신고 처리" className="border-t border-[#E3E1DC] pt-10">
            <h2 className="mb-4 text-2xl font-bold leading-[1.3] text-[#2A2A2E]">신고 처리</h2>
            <AdminReports />
          </section>

          <section aria-label="관리자: 외부 URL 설정">
            <h2 className="mb-4 text-2xl font-bold leading-[1.3] text-[#2A2A2E]">외부 URL 설정</h2>
            <AdminOutbound />
          </section>
        </>
      ) : null}
    </div>
  );
}
