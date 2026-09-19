import { REPRESENTATIVE_PROFILE, contactLinks } from "@/data/representative";

export default function ProfileHero() {
  const visibleLinks = contactLinks.filter(
    (link) => link.url.trim().length > 0 && (link.url.startsWith("https://") || link.url.startsWith("mailto:")),
  );

  return (
    <section className="flex min-h-[50vh] max-h-[65vh] flex-col items-center justify-center gap-6 bg-[#FFFFFF] px-4 py-16 text-center">
      <p className="text-[14px] font-semibold leading-[1.4] text-[#FF6A45]">
        {REPRESENTATIVE_PROFILE.name}
      </p>
      <h1 className="max-w-2xl text-2xl font-bold leading-[1.25] text-[#2A2A2E] md:text-[32px]">
        직접 걸었던 길만 기록하는 여행 아카이브
      </h1>
      <p className="max-w-xl text-base leading-[1.6] text-[#47474D]">{REPRESENTATIVE_PROFILE.bio}</p>

      {visibleLinks.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-3">
          {visibleLinks.map((link) =>
            link.url.startsWith("https://") ? (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-[#E3E1DC] px-4 py-2 text-[14px] font-semibold leading-[1.4] text-[#2A2A2E] hover:bg-[#F7F6F3]"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.label}
                href={link.url}
                className="rounded-lg border border-[#E3E1DC] px-4 py-2 text-[14px] font-semibold leading-[1.4] text-[#2A2A2E] hover:bg-[#F7F6F3]"
              >
                {link.label}
              </a>
            ),
          )}
        </div>
      ) : null}
    </section>
  );
}
