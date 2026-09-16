#!/usr/bin/env python3
"""Audit TASKS/00_TASK_LIST.md and TASKS/TASK-*.md against the Traveler task
generation pipeline's final audit rules.

Inputs (read-only):
  - TASKS/00_TASK_LIST.md
  - TASKS/TASK-*.md
  - docs/PROJECT_SCOPE.md
  - app/design-reference/SCREEN_ROUTE_CONTRACT.json (or design-reference/... fallback)

Outputs (written):
  - TASKS/TASK_MANIFEST.csv
  - TASKS/TASK_AUDIT_REPORT.md

Exits 0 and prints "AUDIT_PASS" + the number of checks run if every check
holds. Exits 1 and prints every violation otherwise. Never touches any other
file (does not create/modify TASKS/00_TASK_LIST.md or any TASK-*.md).
"""

from __future__ import annotations

import csv
import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TASKLIST_PATH = REPO_ROOT / "TASKS" / "00_TASK_LIST.md"
TASKS_DIR = REPO_ROOT / "TASKS"
PROJECT_SCOPE_PATH = REPO_ROOT / "docs" / "PROJECT_SCOPE.md"
CONTRACT_CANDIDATES = [
    REPO_ROOT / "app" / "design-reference" / "SCREEN_ROUTE_CONTRACT.json",
    REPO_ROOT / "design-reference" / "SCREEN_ROUTE_CONTRACT.json",
]
MANIFEST_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
REPORT_PATH = TASKS_DIR / "TASK_AUDIT_REPORT.md"

EXPECTED_SCREENS = ["SCR-001", "SCR-002", "SCR-003", "SCR-004", "SCR-005"]
EXPECTED_FUNC_COUNT = 80
EXPECTED_NF_COUNT = 34
MAX_DB_TABLES = 6

FORBIDDEN_KEYWORDS = [
    "EC2",
    "AWS",
    "auto-merge",
    "automerge",
    "자동 병합",
    "Merge Runner",
    "머지 러너",
]

STARTER_KEYWORDS = ["starter", "boilerplate", "create-next-app", "next.js 기본"]
EXTERNAL_INPUT_NO_STORE_KEYWORDS = ["서버", "url", "저장"]
AUTH_ADULT_KEYWORDS_A = ["인증"]
AUTH_ADULT_KEYWORDS_B = ["성인", "adult"]

REQ_ID_RE = re.compile(r"REQ-(?:FUNC|NF)-\d{3}")


class Check:
    def __init__(self, num: int, description: str) -> None:
        self.num = num
        self.description = description
        self.passed = True
        self.details: list[str] = []

    def fail(self, msg: str) -> None:
        self.passed = False
        self.details.append(msg)


def split_row(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def split_top_level(field: str, sep: str = ",") -> list[str]:
    field = field.strip()
    if field in ("", "-", "없음"):
        return []
    parts: list[str] = []
    depth = 0
    buf = ""
    for ch in field:
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
        if ch == sep and depth == 0:
            parts.append(buf.strip())
            buf = ""
        else:
            buf += ch
    if buf.strip():
        parts.append(buf.strip())
    return [p for p in parts if p]


def strip_backticks(s: str) -> str:
    return s.strip().strip("`").strip()


def extract_table_generic(lines: list[str], start_idx: int) -> list[list[str]]:
    """Parse a pipe-table starting search from start_idx; stop at next '## ' heading."""
    rows: list[list[str]] = []
    seen_header = False
    for line in lines[start_idx:]:
        stripped = line.strip()
        if stripped.startswith("## "):
            break
        if not stripped.startswith("|"):
            continue
        cells = split_row(stripped)
        if not seen_header:
            seen_header = True
            continue
        if set("".join(cells)) <= {"-", ":"}:
            continue
        rows.append(cells)
    return rows


def classify(status: str) -> str:
    status = status.strip()
    if status.startswith("IMPLEMENT"):
        return "IMPLEMENT"
    if status.startswith("EXCLUDED"):
        return "EXCLUDED"
    return "UNKNOWN"


def parse_task_list(text: str) -> tuple[dict[str, dict], dict[str, dict]]:
    lines = text.splitlines()
    non_impl_idx = None
    for i, l in enumerate(lines):
        if l.strip().startswith("## ") and "NON_IMPLEMENTATION" in l:
            non_impl_idx = i
            break

    task_lines = lines[: non_impl_idx if non_impl_idx is not None else len(lines)]
    tasks: dict[str, dict] = {}
    for l in task_lines:
        if not l.startswith("|"):
            continue
        cells = split_row(l)
        if len(cells) != 16:
            continue
        if cells[0] == "Seq" or set("".join(cells)) <= {"-", ":"}:
            continue
        if not cells[0].isdigit():
            continue
        (seq, tid, title, category, impl_status, req_ref, screen, route, page_entry,
         depends_on, expected_files, functional_ac, visual_ac, security_ac, verify,
         priority) = cells
        # A REQ ID immediately followed by "(EXCLUDED" is a documentation cross-reference
        # to an excluded requirement's topic area, not a claim that this task implements it.
        implement_refs = []
        for m in REQ_ID_RE.finditer(req_ref):
            tail = req_ref[m.end():m.end() + 10]
            if tail.startswith("(EXCLUDED") or tail.lower().startswith("(exclu"):
                continue
            implement_refs.append(m.group(0))
        tasks[tid] = {
            "seq": seq,
            "title": title,
            "category": category,
            "impl_status": impl_status,
            "req_refs": implement_refs,
            "req_ref_raw": req_ref,
            "screens": [s.strip() for s in split_top_level(screen) or ([screen] if screen not in ("-", "없음") else [])],
            "routes": [strip_backticks(r) for r in split_top_level(route) or ([route] if route not in ("-", "없음") else [])],
            "page_entries": [strip_backticks(p) for p in split_top_level(page_entry) or ([page_entry] if page_entry not in ("-", "없음") else [])],
            "depends_on": [re.sub(r"\(.*\)", "", d).strip() for d in split_top_level(depends_on)],
            "expected_files": split_top_level(expected_files),
            "functional_ac": functional_ac,
            "visual_ac": visual_ac,
            "security_ac": security_ac,
            "verify": verify,
            "priority": priority,
        }

    non_impl: dict[str, dict] = {}
    if non_impl_idx is not None:
        rows = extract_table_generic(lines, non_impl_idx + 1)
        for cells in rows:
            if len(cells) < 4:
                continue
            req_id, classification_val, reason, followup = cells[:4]
            non_impl[req_id] = {"classification": classification_val, "reason": reason, "followup": followup}

    return tasks, non_impl


def load_contract() -> dict | None:
    for path in CONTRACT_CANDIDATES:
        if path.exists():
            try:
                return json.loads(path.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                return None
    return None


def load_project_scope_classes() -> dict[str, str]:
    if not PROJECT_SCOPE_PATH.exists():
        return {}
    text = PROJECT_SCOPE_PATH.read_text(encoding="utf-8")
    result: dict[str, str] = {}
    for line in text.splitlines():
        if not re.match(r"^\|\s*REQ-(FUNC|NF)-\d{3}\s", line):
            continue
        cells = split_row(line)
        if len(cells) < 3:
            continue
        result[cells[0].split()[0]] = cells[2]
    return result


def find_cycle(tasks: dict[str, dict]) -> list[str] | None:
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {tid: WHITE for tid in tasks}
    stack: list[str] = []

    def dfs(node: str) -> list[str] | None:
        color[node] = GRAY
        stack.append(node)
        for dep in tasks.get(node, {}).get("depends_on", []):
            if dep not in tasks:
                continue
            if color.get(dep, WHITE) == GRAY:
                cycle_start = stack.index(dep)
                return stack[cycle_start:] + [dep]
            if color.get(dep, WHITE) == WHITE:
                result = dfs(dep)
                if result:
                    return result
        stack.pop()
        color[node] = BLACK
        return None

    for tid in tasks:
        if color[tid] == WHITE:
            result = dfs(tid)
            if result:
                return result
    return None


def detail_file_for(task_id: str) -> Path:
    return TASKS_DIR / f"TASK-{task_id}.md"


def read_detail(task_id: str) -> str:
    path = detail_file_for(task_id)
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8")


def combined_text_for(task: dict, detail_text: str) -> str:
    return " ".join([
        task.get("functional_ac", ""), task.get("visual_ac", ""),
        task.get("security_ac", ""), task.get("verify", ""), detail_text,
    ])


def write_manifest(tasks: dict[str, dict], detail_exists: dict[str, bool]) -> None:
    with MANIFEST_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        writer.writerow([
            "Seq", "TaskID", "Category", "ImplementationStatus", "Screen", "Route",
            "PageEntry", "DependsOn", "DetailFile", "DetailFileExists", "RequirementRef",
        ])
        for tid, t in sorted(tasks.items(), key=lambda kv: int(kv[1]["seq"])):
            writer.writerow([
                t["seq"], tid, t["category"], t["impl_status"],
                ";".join(t["screens"]), ";".join(t["routes"]), ";".join(t["page_entries"]),
                ";".join(t["depends_on"]), f"TASK-{tid}.md", detail_exists.get(tid, False),
                ";".join(t["req_refs"]),
            ])


def write_report(checks: list[Check], overall_pass: bool) -> None:
    lines = ["# Task Audit Report", "", f"**Result:** {'AUDIT_PASS' if overall_pass else 'AUDIT_FAIL'}",
             f"**Checks run:** {len(checks)}", ""]
    for c in checks:
        status = "PASS" if c.passed else "FAIL"
        lines.append(f"## {c.num}. {c.description} — {status}")
        if c.details:
            for d in c.details:
                lines.append(f"- {d}")
        else:
            lines.append("- 위반 없음")
        lines.append("")
    REPORT_PATH.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

    if not TASKLIST_PATH.exists():
        print("FAIL: TASKS/00_TASK_LIST.md not found.")
        return 1

    text = TASKLIST_PATH.read_text(encoding="utf-8")
    tasks, non_impl = parse_task_list(text)
    contract = load_contract()
    scope_classes = load_project_scope_classes()

    detail_files = {p.name for p in TASKS_DIR.glob("TASK-*.md")}
    detail_exists = {tid: (f"TASK-{tid}.md" in detail_files) for tid in tasks}

    checks: list[Check] = []

    # 1. Task List 구현 ID와 상세 Task 파일 1:1
    c = Check(1, "Task List 구현 ID와 상세 Task 파일 1:1")
    expected_names = {f"TASK-{tid}.md" for tid in tasks}
    missing = expected_names - detail_files
    orphan = detail_files - expected_names
    if missing:
        c.fail(f"상세 파일 누락: {sorted(missing)}")
    if orphan:
        c.fail(f"Task List에 없는 잉여 상세 파일: {sorted(orphan)}")
    checks.append(c)

    # 2. 중복 Task ID 0
    c = Check(2, "중복 Task ID 0")
    all_ids = []
    for l in text.splitlines():
        if not l.startswith("|"):
            continue
        cells = split_row(l)
        if len(cells) == 16 and cells[0].isdigit():
            all_ids.append(cells[1])
    dupes = sorted({i for i in all_ids if all_ids.count(i) > 1})
    if dupes:
        c.fail(f"중복 Task ID: {dupes}")
    checks.append(c)

    # 3. Depends On 누락 0
    c = Check(3, "Depends On 누락 0 (참조 무결성)")
    for tid, t in tasks.items():
        for dep in t["depends_on"]:
            if dep not in tasks:
                c.fail(f"{tid} -> 존재하지 않는 Depends On '{dep}'")
    checks.append(c)

    # 4. Dependency Cycle 0
    c = Check(4, "Dependency Cycle 0")
    cycle = find_cycle(tasks)
    if cycle:
        c.fail(f"순환 의존 발견: {' -> '.join(cycle)}")
    checks.append(c)

    # 5. Screen 5개 모두 Page Owner 정확히 1개
    c = Check(5, "Screen 5개 모두 Page Owner 정확히 1개")
    owners_by_screen: dict[str, list[str]] = {s: [] for s in EXPECTED_SCREENS}
    for tid, t in tasks.items():
        if t["category"] == "PAGE_OWNER":
            for s in t["screens"]:
                owners_by_screen.setdefault(s, []).append(tid)
    for s in EXPECTED_SCREENS:
        owners = owners_by_screen.get(s, [])
        if len(owners) != 1:
            c.fail(f"{s}: Page Owner {len(owners)}개 ({owners})")
    extra_screens = set(owners_by_screen) - set(EXPECTED_SCREENS)
    if extra_screens:
        c.fail(f"정의되지 않은 Screen에 Page Owner 존재: {sorted(extra_screens)}")
    checks.append(c)

    # 6. Route·Page Entry·Expected Files 일치
    c = Check(6, "Route·Page Entry·Expected Files 일치 (SCREEN_ROUTE_CONTRACT.json 대조)")
    if contract is None:
        c.fail("SCREEN_ROUTE_CONTRACT.json을 찾거나 파싱하지 못함")
    else:
        contract_by_screen = {s["screen_id"]: s for s in contract.get("screens", [])}
        for tid, t in tasks.items():
            if t["category"] != "PAGE_OWNER":
                continue
            for s in t["screens"]:
                cs = contract_by_screen.get(s)
                if cs is None:
                    c.fail(f"{tid}: 계약에 없는 Screen '{s}'")
                    continue
                # TASKS/00_TASK_LIST.md paths are repo-root-relative (app/src/app/...)
                # while SCREEN_ROUTE_CONTRACT.json paths are Next.js-project-relative
                # (src/app/...). Both name the same physical file, so compare by suffix.
                if t["routes"] and t["routes"][0] != cs["route"]:
                    c.fail(f"{tid}: Route 불일치 (Task List='{t['routes']}', 계약='{cs['route']}')")
                if t["page_entries"] and not t["page_entries"][0].endswith(cs["page_entry"]):
                    c.fail(f"{tid}: Page Entry 불일치 (Task List='{t['page_entries']}', 계약='{cs['page_entry']}')")
                joined_files = " ".join(t["expected_files"])
                if cs["page_entry"] not in joined_files:
                    c.fail(f"{tid}: Expected Files에 Page Entry({cs['page_entry']})가 없음")
    checks.append(c)

    # 7. Component-only Screen 0 (Page Owner 없이 Component만 있는 Screen 없음)
    c = Check(7, "Component-only Screen 0")
    all_screens_referenced: set[str] = set()
    for t in tasks.values():
        for s in t["screens"]:
            if s.startswith("SCR-"):
                all_screens_referenced.add(s)
    for s in all_screens_referenced:
        if s not in EXPECTED_SCREENS:
            continue
        if len(owners_by_screen.get(s, [])) == 0:
            c.fail(f"{s}: Component/기타 Task는 있으나 Page Owner가 없음")
    checks.append(c)

    def page_owner_for_screen(screen: str) -> str | None:
        owners = owners_by_screen.get(screen, [])
        return owners[0] if owners else None

    # 8. SCR-001 Starter 제거 AC 존재
    c = Check(8, "SCR-001 Starter 제거 AC 존재")
    owner = page_owner_for_screen("SCR-001")
    if owner is None:
        c.fail("SCR-001 Page Owner를 찾지 못함")
    else:
        combined = combined_text_for(tasks[owner], read_detail(owner)).lower()
        if not any(kw in combined for kw in STARTER_KEYWORDS):
            c.fail(f"{owner}: starter 제거 관련 문구를 찾지 못함")
    checks.append(c)

    # 9. SCR-003 세 탭 조립 AC 존재
    c = Check(9, "SCR-003 세 탭(항공/숙소/동행) 조립 AC 존재")
    owner = page_owner_for_screen("SCR-003")
    if owner is None:
        c.fail("SCR-003 Page Owner를 찾지 못함")
    else:
        combined = combined_text_for(tasks[owner], read_detail(owner))
        for kw in ("항공", "숙소", "동행"):
            if kw not in combined:
                c.fail(f"{owner}: '{kw}' 탭 조립 언급을 찾지 못함")
    checks.append(c)

    # 10. SCR-005 역할별 상태 조립 AC 존재
    c = Check(10, "SCR-005 Guest/Member/Admin 역할별 상태 조립 AC 존재")
    owner = page_owner_for_screen("SCR-005")
    if owner is None:
        c.fail("SCR-005 Page Owner를 찾지 못함")
    else:
        combined = combined_text_for(tasks[owner], read_detail(owner))
        for kw in ("Guest", "Member", "Admin"):
            if kw not in combined:
                c.fail(f"{owner}: '{kw}' 역할 조립 언급을 찾지 못함")
    checks.append(c)

    # 11. DB Schema·RLS·Access·Seed Task 존재
    c = Check(11, "DB Schema·RLS·Access·Seed Task 존재")
    db_tasks = {tid: t for tid, t in tasks.items() if t["category"] == "DB"}
    needed = {"SCHEMA": False, "RLS": False, "ACCESS": False, "SEED": False}
    for tid in db_tasks:
        upper = tid.upper()
        for key in needed:
            if key in upper:
                needed[key] = True
    for key, found in needed.items():
        if not found:
            c.fail(f"DB {key} Task를 찾지 못함")
    checks.append(c)

    # 12. DB Table 범위가 6개 기본 테이블을 크게 넘지 않음
    c = Check(12, "DB Table 수가 6개 기본 테이블을 넘지 않음")
    schema_task_id = next((tid for tid in db_tasks if "SCHEMA" in tid.upper()), None)
    if schema_task_id is None:
        c.fail("DB Schema Task를 찾지 못해 테이블 수를 확인할 수 없음")
    else:
        schema_text = tasks[schema_task_id]["functional_ac"]
        # Only count table names in the specific "정확히 N개 테이블만 생성:" clause,
        # not every backticked identifier in the whole AC (which also includes column
        # names like `is_adult`, `adult_verified_at`).
        m = re.search(r"테이블만 생성\s*:\s*([^;]+)", schema_text)
        scope_text = m.group(1) if m else schema_text
        table_names = sorted(set(re.findall(r"`([a-z_]+)`", scope_text)))
        table_names = [n for n in table_names if "/" not in n and "." not in n]
        if len(table_names) > MAX_DB_TABLES:
            c.fail(f"'테이블만 생성' 목록에서 {len(table_names)}개 식별자 발견(6개 초과): {table_names}")
    checks.append(c)

    # 13. 외부 입력 비저장 AC 존재 (flight/hotel)
    c = Check(13, "외부(항공·호텔) 입력 비저장 AC 존재")
    fh_tasks = {tid: t for tid, t in tasks.items() if "FLIGHT" in tid.upper() or "HOTEL" in tid.upper()}
    if not fh_tasks:
        c.fail("Flight/Hotel 관련 Task를 찾지 못함")
    for tid, t in fh_tasks.items():
        combined = combined_text_for(t, read_detail(tid)).lower()
        if not all(kw in combined for kw in EXTERNAL_INPUT_NO_STORE_KEYWORDS):
            c.fail(f"{tid}: 서버/URL/저장 관련 비전달·비저장 문구가 불완전함")
    checks.append(c)

    # 14. Auth·성인·기본 RLS AC 존재
    c = Check(14, "Auth·성인 확인·기본 RLS AC 존재")
    auth_tasks = {tid: t for tid, t in tasks.items() if "AUTH" in tid.upper() and t["category"] != "DB"}
    if not auth_tasks:
        c.fail("Auth 관련 Task를 찾지 못함")
    else:
        found_auth = False
        found_adult = False
        for tid, t in auth_tasks.items():
            combined = combined_text_for(t, read_detail(tid))
            if any(kw in combined for kw in AUTH_ADULT_KEYWORDS_A):
                found_auth = True
            if any(kw.lower() in combined.lower() for kw in AUTH_ADULT_KEYWORDS_B):
                found_adult = True
        if not found_auth:
            c.fail("인증 관련 AC 문구를 찾지 못함")
        if not found_adult:
            c.fail("성인(adult) 확인 관련 AC 문구를 찾지 못함")
    if not any("RLS" in tid.upper() for tid in db_tasks):
        c.fail("기본 RLS Task를 찾지 못함")
    checks.append(c)

    # 15. Playwright Chromium Smoke Task 존재
    c = Check(15, "Playwright Chromium Smoke Task 존재")
    e2e_tasks = {tid: t for tid, t in tasks.items() if t["category"] == "E2E_TEST"}
    if not e2e_tasks:
        c.fail("E2E_TEST Task를 찾지 못함")
    else:
        found = False
        for tid, t in e2e_tasks.items():
            combined = combined_text_for(t, read_detail(tid)).lower()
            if "chromium" in combined and "playwright" in combined:
                found = True
        if not found:
            c.fail("chromium + playwright 언급이 있는 E2E Task를 찾지 못함")
    checks.append(c)

    # 16. AWS·EC2·자동 Merge 구현 Task 0
    # A forbidden keyword mentioned inside a prohibition clause ("...하지 않는다",
    # "...추가하지 않는다", "...금지") is the opposite of an implementation — only flag
    # affirmative mentions (no negation marker in the same sentence).
    c = Check(16, "AWS·EC2·자동 Merge 구현 Task 0")
    NEGATION_MARKERS = ["하지 않는다", "않는다", "금지", "제외", "없다", "만들지"]
    SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?다])\s+|\n")
    haystacks = [("TASKS/00_TASK_LIST.md", text)]
    for tid in tasks:
        haystacks.append((f"TASK-{tid}.md", read_detail(tid)))
    for name, content in haystacks:
        for sentence in SENTENCE_SPLIT_RE.split(content):
            lowered = sentence.lower()
            for kw in FORBIDDEN_KEYWORDS:
                if kw.lower() in lowered and not any(neg in sentence for neg in NEGATION_MARKERS):
                    c.fail(f"{name}: 금지 키워드 '{kw}'가 금지 문구 없이 등장 - '{sentence.strip()[:80]}'")
    checks.append(c)

    # 17. REQ-FUNC 80개, REQ-NF 34개가 Task 또는 EXCLUDED 표에 존재
    c = Check(17, "REQ-FUNC 80개 + REQ-NF 34개 전수 커버리지")
    func_ids = {f"REQ-FUNC-{i:03d}" for i in range(1, EXPECTED_FUNC_COUNT + 1)}
    nf_ids = {f"REQ-NF-{i:03d}" for i in range(1, EXPECTED_NF_COUNT + 1)}
    expected_ids = func_ids | nf_ids
    implement_ids: set[str] = set()
    for t in tasks.values():
        implement_ids.update(t["req_refs"])
    excluded_ids = set(non_impl.keys())
    covered = implement_ids | excluded_ids
    missing = expected_ids - covered
    if missing:
        c.fail(f"어디에도 없는 Requirement: {sorted(missing)}")
    conflict = implement_ids & excluded_ids
    if conflict:
        c.fail(f"Task와 EXCLUDED 표에 동시에 존재(모순): {sorted(conflict)}")
    extra = covered - expected_ids
    if extra:
        c.fail(f"114개 범위를 벗어난 ID: {sorted(extra)}")
    for rid, row in non_impl.items():
        scope_status = scope_classes.get(rid)
        if scope_status and classify(scope_status) != "EXCLUDED":
            c.fail(f"{rid}: NON_IMPLEMENTATION표는 EXCLUDED이나 PROJECT_SCOPE.md는 '{scope_status}'")
    checks.append(c)

    # 18. EXCLUDED 상세 구현 파일이 생성되지 않음
    c = Check(18, "EXCLUDED Requirement의 상세 구현 파일 미생성")
    for rid in non_impl:
        if rid in tasks:
            c.fail(f"{rid}가 Task ID로 존재함(EXCLUDED인데 구현 Task화됨)")
        if (TASKS_DIR / f"TASK-{rid}.md").exists():
            c.fail(f"TASK-{rid}.md 상세 파일이 존재함(EXCLUDED 대상)")
    checks.append(c)

    write_manifest(tasks, detail_exists)
    overall_pass = all(c.passed for c in checks)
    write_report(checks, overall_pass)

    print(f"Wrote {MANIFEST_PATH.relative_to(REPO_ROOT)}")
    print(f"Wrote {REPORT_PATH.relative_to(REPO_ROOT)}")

    if overall_pass:
        print(f"AUDIT_PASS ({len(checks)} checks)")
        return 0

    failed = [c for c in checks if not c.passed]
    print(f"AUDIT_FAIL: {len(failed)}/{len(checks)} check(s) failed:")
    for c in failed:
        print(f"  [{c.num}] {c.description}")
        for d in c.details:
            print(f"      - {d}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
