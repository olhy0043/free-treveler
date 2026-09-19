"use client";

import { useState } from "react";

export interface Theme {
  id: string;
  label: string;
  /** Keyword matched against destination name/description/attractions by the consumer. */
  keyword: string;
}

export const THEMES: Theme[] = [
  { id: "healing", label: "힐링", keyword: "휴양" },
  { id: "activity", label: "액티비티", keyword: "트레킹" },
  { id: "food", label: "미식", keyword: "음식" },
  { id: "culture", label: "문화·역사", keyword: "유적" },
  { id: "nature", label: "자연·풍경", keyword: "자연" },
  { id: "photo", label: "사진 명소", keyword: "야경" },
];

export interface ThemeChipsProps {
  /** Called with the selected theme's keyword, or null when deselected. */
  onThemeChange?: (keyword: string | null) => void;
}

export default function ThemeChips({ onThemeChange }: ThemeChipsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function handleClick(theme: Theme) {
    const next = selectedId === theme.id ? null : theme.id;
    setSelectedId(next);
    onThemeChange?.(next ? theme.keyword : null);
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="여행 동기·테마 선택">
      {THEMES.map((theme) => {
        const selected = selectedId === theme.id;
        return (
          <button
            key={theme.id}
            type="button"
            aria-pressed={selected}
            onClick={() => handleClick(theme)}
            className={`rounded-full px-4 py-2 text-[14px] font-semibold leading-[1.4] transition-colors ${
              selected
                ? "bg-[#FF6A45] text-white"
                : "bg-[#F7F6F3] text-[#2A2A2E] hover:bg-[#F0EEEA]"
            }`}
          >
            {theme.label}
          </button>
        );
      })}
    </div>
  );
}
