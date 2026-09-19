"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Destination } from "@/data/types";
import { safetyGuides } from "@/data/safety";
import { getRelatedDestinations } from "./DestinationGrid";

export function DrawerShell({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#00000080] md:items-stretch">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="flex h-full w-full flex-col overflow-y-auto rounded-t-[20px] bg-[#FFFFFF] p-6 md:h-full md:w-[420px] md:rounded-t-none md:rounded-l-[20px]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-bold leading-[1.3] text-[#2A2A2E]">{title}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#2A2A2E] hover:bg-[#F7F6F3]"
          >
            ✕
          </button>
        </div>
        <div className="mt-4 flex-1">{children}</div>
      </div>
    </div>
  );
}

export interface DestinationDrawerProps {
  destination: Destination | null;
  onClose: () => void;
  onShowSafety?: (country: string) => void;
  onSelectRelated?: (destination: Destination) => void;
}

export default function DestinationDrawer({
  destination,
  onClose,
  onShowSafety,
  onSelectRelated,
}: DestinationDrawerProps) {
  const hasSafety = destination
    ? safetyGuides.some((s) => s.country === destination.country)
    : false;
  const related = destination ? getRelatedDestinations(destination) : [];

  return (
    <DrawerShell open={destination !== null} title={destination?.name ?? ""} onClose={onClose}>
      {destination ? (
        <div className="flex flex-col gap-6">
          <div className="relative h-48 w-full overflow-hidden rounded-[14px]">
            <Image
              src={destination.image.url}
              alt={destination.image.alt}
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          {hasSafety ? (
            <button
              type="button"
              onClick={() => onShowSafety?.(destination.country)}
              className="self-start rounded-lg border border-[#E3E1DC] px-4 py-2 text-[14px] font-semibold leading-[1.4] text-[#2A2A2E] hover:bg-[#F7F6F3]"
            >
              {destination.country} 안전정보 보기
            </button>
          ) : null}

          <section>
            <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">소개</h3>
            <p className="mt-2 text-base leading-[1.6] text-[#47474D]">{destination.description}</p>
          </section>

          <section>
            <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">추천 시기</h3>
            <p className="mt-2 text-base leading-[1.6] text-[#47474D]">{destination.bestSeason}</p>
          </section>

          <section>
            <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">명소</h3>
            <ul className="mt-2 list-inside list-disc text-base leading-[1.6] text-[#47474D]">
              {destination.attractions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">추천 일정</h3>
            <p className="mt-2 text-[14px] font-semibold leading-[1.5] text-[#2A2A2E]">1일 코스</p>
            <ul className="mt-1 list-inside list-disc text-base leading-[1.6] text-[#47474D]">
              {destination.itinerary.oneDay.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-3 text-[14px] font-semibold leading-[1.5] text-[#2A2A2E]">3일 코스</p>
            <ul className="mt-1 list-inside list-disc text-base leading-[1.6] text-[#47474D]">
              {destination.itinerary.threeDay.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">예산</h3>
            <p className="mt-2 text-base leading-[1.6] text-[#47474D]">{destination.budget}</p>
          </section>

          <section>
            <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">교통</h3>
            <p className="mt-2 text-base leading-[1.6] text-[#47474D]">{destination.transport}</p>
          </section>

          <section>
            <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">음식</h3>
            <ul className="mt-2 list-inside list-disc text-base leading-[1.6] text-[#47474D]">
              {destination.food.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">에티켓</h3>
            <ul className="mt-2 list-inside list-disc text-base leading-[1.6] text-[#47474D]">
              {destination.etiquette.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="border-t border-[#E3E1DC] pt-4 text-[13px] leading-[1.4] text-[#6E6E75]">
            <p>출처: {destination.source}</p>
            <p>수정일: {destination.updatedAt}</p>
          </section>

          {related.length > 0 ? (
            <section>
              <h3 className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E]">관련 여행지</h3>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {related.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectRelated?.(item)}
                    className="rounded-[14px] border border-[#E3E1DC] p-3 text-left hover:bg-[#F7F6F3]"
                  >
                    <p className="text-[14px] font-semibold leading-[1.4] text-[#2A2A2E]">{item.name}</p>
                    <p className="text-[13px] leading-[1.4] text-[#6E6E75]">{item.country}</p>
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </DrawerShell>
  );
}
