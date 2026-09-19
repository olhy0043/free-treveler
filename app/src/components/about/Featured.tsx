import Image from "next/image";
import Link from "next/link";
import { destinations } from "@/data/destinations";
import { featuredDestinationIds } from "@/data/representative";

export default function Featured() {
  const featured = featuredDestinationIds
    .map((id) => destinations.find((d) => d.id === id))
    .filter((d): d is NonNullable<typeof d> => d !== undefined);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((destination) => (
          <Link
            key={destination.id}
            href="/"
            className="overflow-hidden rounded-[14px] border border-[#E3E1DC] bg-[#FFFFFF] transition-shadow hover:shadow-[0_1px_2px_rgba(0,0,0,.06),0_4px_10px_rgba(0,0,0,.08)]"
          >
            <div className="relative h-36 w-full">
              <Image
                src={destination.image.url}
                alt={destination.image.alt}
                fill
                loading="lazy"
                unoptimized
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="p-3">
              <p className="text-[16px] font-semibold leading-[1.4] text-[#2A2A2E]">{destination.name}</p>
              <p className="text-[13px] leading-[1.4] text-[#6E6E75]">{destination.country}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-3 rounded-[14px] bg-[#F7F6F3] p-8 text-center">
        <p className="w-full text-base leading-[1.6] text-[#47474D]">
          다음 여행을 지금 준비해 보세요.
        </p>
        <Link
          href="/travel-tools"
          className="rounded-lg bg-[#FF6A45] px-6 py-3 text-base font-semibold leading-[1.25] text-white hover:bg-[#E24E29]"
        >
          여행 도구 열기
        </Link>
        <Link
          href="/mates"
          className="rounded-lg border border-[#E3E1DC] px-6 py-3 text-base font-semibold leading-[1.25] text-[#2A2A2E] hover:bg-[#FFFFFF]"
        >
          동행 찾기
        </Link>
      </div>
    </div>
  );
}
