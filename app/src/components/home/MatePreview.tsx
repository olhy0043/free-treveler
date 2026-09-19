import Link from "next/link";
import { getMatePosts } from "@/lib/actions/mateList";

export default async function MatePreview() {
  const posts = await getMatePosts({ status: "RECRUITING" });
  const recent = posts.slice(0, 3);

  if (recent.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[14px] bg-[#F7F6F3] px-6 py-12 text-center">
        <p className="text-base leading-[1.6] text-[#47474D]">
          아직 등록된 동행글이 없어요. 여행 국가와 기간을 정하고 동행을 직접 모집해 보세요.
        </p>
        <p className="text-[14px] leading-[1.5] text-[#6E6E75]">
          `/travel-tools`의 동행 구하기 탭에서 제목·기간·모집 인원을 입력하면 바로 등록할 수 있습니다.
        </p>
        <Link
          href="/travel-tools"
          className="rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white transition-colors hover:bg-[#E24E29]"
        >
          동행 글 작성하기
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {recent.map((post) => (
        <Link
          key={post.id}
          href="/mates"
          className="rounded-[14px] border border-[#E3E1DC] bg-[#FFFFFF] p-4 transition-shadow hover:shadow-[0_1px_2px_rgba(0,0,0,.06),0_4px_10px_rgba(0,0,0,.08)]"
        >
          <p className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">{post.title}</p>
          <p className="mt-1 text-[14px] leading-[1.5] text-[#6E6E75]">
            {post.country}
            {post.region ? ` · ${post.region}` : ""}
          </p>
          <p className="mt-1 text-[13px] leading-[1.4] text-[#6E6E75]">
            {post.startDate} ~ {post.endDate}
          </p>
        </Link>
      ))}
    </div>
  );
}
