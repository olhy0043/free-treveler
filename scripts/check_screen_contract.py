#!/usr/bin/env python3
"""Validate the Traveler Screen Route Contract against planned/implemented Tasks.

Usage:
  python scripts/check_screen_contract.py --mode=plan
  python scripts/check_screen_contract.py --mode=ci
  python scripts/check_screen_contract.py --mode=release

Modes:
  plan    - Page Owner/Route 계획만 검사한다(TASK_MANIFEST.csv + SCREEN_ROUTE_CONTRACT.json).
            app/src/app의 실제 파일 존재 여부는 확인하지 않는다.
  ci      - plan의 모든 검사에 더해 실제 구현된 Page 파일과 공개 경로(app/src/app)를 검사한다.
  release - ci의 모든 검사에 더해 docs/preview-checks/SCR-001.md~SCR-005.md 존재를 확인한다.

Read-only(문서/코드를 만들거나 고치지 않는다). 위반이 있으면 파일/화면 ID/수정 힌트를 출력하고
exit code 1로 끝난다. 위반이 없으면 PASS 메시지를 출력하고 exit code 0으로 끝난다.
"""

from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
APP_DIR = REPO_ROOT / "app"
CONTRACT_PATH = APP_DIR / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
MANIFEST_PATH = REPO_ROOT / "TASKS" / "TASK_MANIFEST.csv"
SRC_APP_DIR = APP_DIR / "src" / "app"
PREVIEW_CHECKS_DIR = REPO_ROOT / "docs" / "preview-checks"

FIXED_SCREENS = {
    "SCR-001": "/",
    "SCR-002": "/about",
    "SCR-003": "/travel-tools",
    "SCR-004": "/mates",
    "SCR-005": "/account",
}
NON_SCREEN_MANIFEST_VALUES = {"", "해당 없음", "전역", "기술 Route"}
FORBIDDEN_NEW_PAGE_SEGMENTS = ["destinations", "safety"]
ALLOWED_TECHNICAL_DIR_NAMES = {"auth", "api"}


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []

    def error(self, file: str, screen_id: str, message: str, hint: str) -> None:
        self.errors.append(f"[{screen_id}] {file}: {message}\n    수정 힌트: {hint}")

    def ok(self) -> bool:
        return not self.errors


def load_contract(report: Report) -> dict | None:
    if not CONTRACT_PATH.exists():
        report.error(
            str(CONTRACT_PATH.relative_to(REPO_ROOT)), "-",
            "SCREEN_ROUTE_CONTRACT.json이 없음",
            "app/design-reference/SCREEN_ROUTE_CONTRACT.json을 생성한다.",
        )
        return None
    try:
        return json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        report.error(
            str(CONTRACT_PATH.relative_to(REPO_ROOT)), "-",
            f"JSON 파싱 실패: {exc}",
            "JSON 문법 오류를 고친다.",
        )
        return None


def load_manifest(report: Report) -> list[dict] | None:
    if not MANIFEST_PATH.exists():
        report.error(
            str(MANIFEST_PATH.relative_to(REPO_ROOT)), "-",
            "TASK_MANIFEST.csv가 없음",
            "python scripts/audit_tasks.py로 생성한다.",
        )
        return None
    with MANIFEST_PATH.open(encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    for row in rows:
        row["_screens"] = [s for s in row.get("Screen", "").split(";") if s]
    return rows


def check_1_fixed_screens_exist(contract: dict, report: Report) -> None:
    """검사 1: 고정 화면 5개가 정확히 존재한다."""
    screens = {s["screen_id"]: s for s in contract.get("screens", [])}
    for sid, route in FIXED_SCREENS.items():
        if sid not in screens:
            report.error(
                str(CONTRACT_PATH.relative_to(REPO_ROOT)), sid,
                "고정 화면이 SCREEN_ROUTE_CONTRACT.json에 없음",
                f"{sid} 항목을 route='{route}'로 추가한다.",
            )
            continue
        actual_route = screens[sid].get("route")
        if actual_route != route:
            report.error(
                str(CONTRACT_PATH.relative_to(REPO_ROOT)), sid,
                f"route가 '{actual_route}'이며 기대값 '{route}'와 다름",
                f"{sid}의 route를 '{route}'로 고정한다.",
            )
    extra = sorted(set(screens) - set(FIXED_SCREENS))
    for sid in extra:
        report.error(
            str(CONTRACT_PATH.relative_to(REPO_ROOT)), sid,
            "고정 5개 화면 목록에 없는 화면이 추가됨",
            "5개 고정 화면(SCR-001~005) 외의 새 Screen을 임의로 추가하지 않는다.",
        )


def check_2_one_page_owner_per_screen(rows: list[dict], report: Report) -> None:
    """검사 2: 각 화면 Page Owner Task가 정확히 하나다."""
    owners: dict[str, list[str]] = {sid: [] for sid in FIXED_SCREENS}
    for row in rows:
        if row["Category"] != "PAGE_OWNER":
            continue
        for sid in row["_screens"]:
            if sid in owners:
                owners[sid].append(row["TaskID"])
    for sid, task_ids in owners.items():
        if len(task_ids) == 0:
            report.error(
                "TASKS/TASK_MANIFEST.csv", sid,
                "Page Owner Task가 없음",
                f"{sid}(Route {FIXED_SCREENS[sid]})의 Page Owner Task를 추가한다.",
            )
        elif len(task_ids) > 1:
            report.error(
                "TASKS/TASK_MANIFEST.csv", sid,
                f"Page Owner Task가 {len(task_ids)}개({', '.join(task_ids)})",
                "화면당 Page Owner Task는 정확히 1개여야 한다 — 나머지는 COMPONENT로 재분류하거나 병합한다.",
            )


def check_3_technical_routes_not_screens(contract: dict, rows: list[dict], report: Report) -> None:
    """검사 3: 기술 경로를 사용자 화면으로 세지 않는다."""
    screen_routes = {s["route"] for s in contract.get("screens", [])}
    for t in contract.get("technical_routes", []):
        if t.get("counted_as_screen"):
            report.error(
                str(CONTRACT_PATH.relative_to(REPO_ROOT)), "-",
                f"기술 Route '{t.get('route')}'가 counted_as_screen=true로 표시됨",
                "기술 Route(auth_callback/api_routes/not_found/error_boundary)는 counted_as_screen=false여야 한다.",
            )
        if t.get("route") in screen_routes:
            report.error(
                str(CONTRACT_PATH.relative_to(REPO_ROOT)), "-",
                f"기술 Route '{t.get('route')}'가 화면 Route와 겹침",
                "기술 Route는 5개 고정 화면 Route와 겹치지 않아야 한다.",
            )
    for row in rows:
        for sid in row["_screens"]:
            if sid not in FIXED_SCREENS and sid not in NON_SCREEN_MANIFEST_VALUES:
                report.error(
                    "TASKS/TASK_MANIFEST.csv", sid,
                    f"Task {row['TaskID']}가 알 수 없는 Screen 값 '{sid}'을 사용",
                    "Screen 열은 5개 고정 화면 ID, '전역', '기술 Route', '해당 없음' 중 하나여야 한다.",
                )


def check_4_no_destination_safety_pages(rows: list[dict], require_files: bool, report: Report) -> None:
    """검사 4: 여행지 상세와 안전정보를 새 Page로 만들지 않았는지 검사한다."""
    forbidden_route_prefixes = tuple(f"/{seg}" for seg in FORBIDDEN_NEW_PAGE_SEGMENTS)
    for row in rows:
        for r in (row.get("Route") or "").split(";"):
            if r and r.startswith(forbidden_route_prefixes):
                screen_id = row["_screens"][0] if row["_screens"] else "SCR-001"
                report.error(
                    "TASKS/TASK_MANIFEST.csv", screen_id,
                    f"Task {row['TaskID']}가 금지된 Route '{r}'를 사용",
                    "여행지 상세·안전정보는 SCR-001 안의 Drawer 컴포넌트로 구현한다 — 새 Route/Page를 만들지 않는다.",
                )
    if require_files and SRC_APP_DIR.exists():
        for segment in FORBIDDEN_NEW_PAGE_SEGMENTS:
            seg_dir = SRC_APP_DIR / segment
            if seg_dir.exists():
                report.error(
                    str(seg_dir.relative_to(REPO_ROOT)), "SCR-001",
                    f"app/src/app/{segment} 디렉터리(Page)가 실제로 존재함",
                    f"{segment}는 새 Route가 아니라 SCR-001의 Drawer 컴포넌트로 구현해야 한다 — 이 디렉터리를 제거한다.",
                )


def check_5_scr003_covers_travel_and_mate(rows: list[dict], report: Report) -> None:
    """검사 5: SCR-003 Task가 여행 입력과 동행 작성 양쪽 요구를 포함한다."""
    scr003_tasks = [r for r in rows if "SCR-003" in r["_screens"]]
    has_travel_input = any(("FLIGHT" in r["TaskID"] or "HOTEL" in r["TaskID"]) for r in scr003_tasks)
    has_mate_write = any("MATE" in r["TaskID"] for r in scr003_tasks)
    if not has_travel_input:
        report.error(
            "TASKS/TASK_MANIFEST.csv", "SCR-003",
            "여행 입력(항공/숙소) 관련 Task가 SCR-003에 없음",
            "항공/숙소 입력 Component Task를 Screen=SCR-003으로 추가한다.",
        )
    if not has_mate_write:
        report.error(
            "TASKS/TASK_MANIFEST.csv", "SCR-003",
            "동행 작성 관련 Task가 SCR-003에 없음",
            "동행 작성(로그인 안내/작성 Form) Component Task를 Screen=SCR-003으로 추가한다.",
        )


def check_ci_page_files_exist(contract: dict, report: Report) -> None:
    """ci/release 전용: 고정 화면 5개의 Page Entry 파일이 실제로 존재한다."""
    for s in contract.get("screens", []):
        page_entry = s.get("page_entry", "")
        full_path = APP_DIR / page_entry
        if not full_path.exists():
            report.error(
                page_entry, s["screen_id"],
                "Page Entry 파일이 아직 구현되지 않음",
                f"app/{page_entry}를 생성해 {s['screen_id']}({s['route']})를 조립한다.",
            )


def check_ci_no_extra_public_pages(contract: dict, report: Report) -> None:
    """ci/release 전용: 5개 고정 화면·허용 기술 경로 외의 새 공개 Page 디렉터리가 없다."""
    if not SRC_APP_DIR.exists():
        return
    allowed_dirs = ALLOWED_TECHNICAL_DIR_NAMES.copy()
    for s in contract.get("screens", []):
        parts = Path(s["page_entry"]).relative_to("src/app").parts[:-1]
        if parts:
            allowed_dirs.add(parts[0])
    for entry in sorted(SRC_APP_DIR.iterdir()):
        if not entry.is_dir() or entry.name.startswith(("(", "_", ".")):
            continue
        if entry.name in allowed_dirs:
            continue
        if any(entry.rglob("page.tsx")):
            report.error(
                str(entry.relative_to(REPO_ROOT)), "-",
                f"고정 5개 화면·허용 기술 경로(/auth/callback, /api/**)에 없는 새 Page 디렉터리 'src/app/{entry.name}'",
                "5개 고정 화면과 허용 기술 경로 외의 새 사용자 화면 Route를 만들지 않는다.",
            )


def check_6_preview_checkpoints(report: Report) -> None:
    """검사 6(release 전용): docs/preview-checks/SCR-001.md부터 SCR-005.md까지 확인한다."""
    for sid in FIXED_SCREENS:
        p = PREVIEW_CHECKS_DIR / f"{sid}.md"
        if not p.exists():
            report.error(
                str(p.relative_to(REPO_ROOT)), sid,
                "Preview Checkpoint 문서가 없음",
                f"사람이 Vercel Preview로 {sid}({FIXED_SCREENS[sid]})를 확인한 뒤 "
                f"docs/preview-checks/{sid}.md에 결과를 기록한다(CLAUDE.md 규칙 22).",
            )


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

    mode = None
    for arg in sys.argv[1:]:
        if arg.startswith("--mode="):
            mode = arg.split("=", 1)[1]
    if mode not in ("plan", "ci", "release"):
        print("사용법: python scripts/check_screen_contract.py --mode=plan|ci|release")
        return 1

    report = Report()
    contract = load_contract(report)
    rows = load_manifest(report)
    if contract is None or rows is None:
        print(f"SCREEN_CONTRACT_{mode.upper()}_FAIL: 입력 파일을 읽을 수 없음")
        for e in report.errors:
            print(f"- {e}")
        return 1

    # plan 단계 검사(1~5) — 모든 mode에서 공통으로 수행한다.
    check_1_fixed_screens_exist(contract, report)
    check_2_one_page_owner_per_screen(rows, report)
    check_3_technical_routes_not_screens(contract, rows, report)
    check_4_no_destination_safety_pages(rows, require_files=(mode != "plan"), report=report)
    check_5_scr003_covers_travel_and_mate(rows, report)

    if mode in ("ci", "release"):
        check_ci_page_files_exist(contract, report)
        check_ci_no_extra_public_pages(contract, report)

    if mode == "release":
        check_6_preview_checkpoints(report)

    if report.ok():
        print(f"SCREEN_CONTRACT_{mode.upper()}_PASS")
        return 0

    print(f"SCREEN_CONTRACT_{mode.upper()}_FAIL: {len(report.errors)}건 위반")
    for e in report.errors:
        print(f"- {e}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
