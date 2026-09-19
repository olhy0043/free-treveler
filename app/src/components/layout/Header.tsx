"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "메인", href: "/" },
  { label: "여행 도구", href: "/travel-tools" },
  { label: "동행 찾기", href: "/mates" },
  { label: "대표 소개", href: "/about" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E3E1DC] bg-[#FFFFFF]">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-4 md:h-20 md:px-8">
        <Link href="/" className="text-lg font-bold leading-[1.4] text-[#2A2A2E]">
          Free Traveler
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[18px] font-semibold leading-[1.4] text-[#2A2A2E] transition-colors hover:text-[#FF6A45]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link
            href="/account"
            className="rounded-lg px-4 py-2 text-base font-semibold leading-[1.25] text-[#2A2A2E] transition-colors hover:bg-[#F7F6F3]"
          >
            로그인
          </Link>
        </div>

        <button
          type="button"
          aria-label="메뉴 열기"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-[#2A2A2E] md:hidden"
        >
          <span className="sr-only">메뉴</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-0 top-[72px] z-30 flex flex-col gap-1 bg-[#FFFFFF] px-4 py-6 md:hidden">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-4 py-3 text-[18px] font-semibold leading-[1.4] text-[#2A2A2E] hover:bg-[#F7F6F3]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/account"
            onClick={() => setIsMenuOpen(false)}
            className="mt-2 rounded-lg bg-[#FF6A45] px-4 py-3 text-center text-base font-semibold leading-[1.25] text-white"
          >
            로그인
          </Link>
        </div>
      ) : null}
    </header>
  );
}
