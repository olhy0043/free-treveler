#!/usr/bin/env python3
"""Build the Wave execution plan for the Traveler Task pipeline.

Reads (read-only):
  - TASKS/TASK_MANIFEST.csv
  - TASKS/TASK-*.md (detail files; falls back to TASKS/details/TASK-*.md if present)
  - app/design-reference/SCREEN_ROUTE_CONTRACT.json

Writes:
  - TASKS/TASK_DAG.md
  - TASKS/WAVE_PLAN.md
  - TASKS/WAVE_STATE.json
  - TASKS/TASK_MANIFEST.csv (rewritten in place with a wave_id column added)

This script never creates a git branch/PR and never merges. It only computes
a deterministic Wave assignment from the dependency graph declared in
TASK_MANIFEST.csv's DependsOn column plus the fixed Wave Group order below.
"""

from __future__ import annotations

import csv
import json
import re
import sys
from collections import defaultdict, deque
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
TASKS_DIR = REPO_ROOT / "TASKS"
MANIFEST_PATH = TASKS_DIR / "TASK_MANIFEST.csv"
DETAILS_DIR = TASKS_DIR / "details" if (TASKS_DIR / "details").is_dir() else TASKS_DIR
CONTRACT_PATH = REPO_ROOT / "app" / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
DAG_PATH = TASKS_DIR / "TASK_DAG.md"
WAVE_PLAN_PATH = TASKS_DIR / "WAVE_PLAN.md"
WAVE_STATE_PATH = TASKS_DIR / "WAVE_STATE.json"

MIN_WAVE_SIZE = 4
MAX_WAVE_SIZE = 7

GROUP_TITLES = {
    1: "Scaffold, 문서, Harness 확인",
    2: "Airbnb 스타일 공통 UI, 정적 데이터, Layout",
    3: "Supabase Auth, 6개 Table, 기본 RLS",
    4: "SCR-001 메인 Component와 Page Owner",
    5: "SCR-002 대표 소개 Component와 Page Owner",
    6: "SCR-003 여행 입력·외부 이동·동행글 입력 Component와 Page Owner",
    7: "SCR-004 동행 목록·상세·신청 Component와 Page Owner",
    8: "SCR-005 계정·내 활동·간단 관리자 Component와 Page Owner",
    9: "Unit·Playwright·접근성·CI",
    10: "Vercel Preview와 Release 확인",
}


def preferred_group(task_id: str) -> int:
    if task_id in ("GLOBAL-HEADER-FOOTER", "GLOBAL-TOAST", "GLOBAL-ERROR-PAGES"):
        return 2
    if task_id.startswith("DATA-"):
        return 2
    if task_id.startswith("DB-"):
        return 3
    if task_id == "API-AUTH":
        return 3
    if task_id == "API-MATE-WRITE":
        return 6
    if task_id in ("API-MATE-LIST", "API-MATE-APPLICATION", "API-REPORT-BLOCK"):
        return 7
    if task_id in ("API-MY-ACTIVITY", "API-ADMIN"):
        return 8
    if task_id.startswith("CMP-SCR001") or task_id == "PAGE-SCR001":
        return 4
    if task_id.startswith("CMP-SCR002") or task_id == "PAGE-SCR002":
        return 5
    if task_id.startswith("CMP-SCR003") or task_id == "PAGE-SCR003":
        return 6
    if task_id.startswith("CMP-SCR004") or task_id == "PAGE-SCR004":
        return 7
    if task_id.startswith("CMP-SCR005") or task_id == "PAGE-SCR005":
        return 8
    if task_id.startswith("UNIT-") or task_id.startswith("E2E-") or task_id in (
        "TEST-RLS-BASIC",
        "MANUAL-A11Y-CHECK",
        "CI-PIPELINE",
    ):
        return 9
    if task_id == "RELEASE-VERCEL-SUPABASE":
        return 10
    raise ValueError(f"no Wave Group mapping rule for Task ID '{task_id}'")


def load_manifest() -> list[dict]:
    with MANIFEST_PATH.open(encoding="utf-8", newline="") as f:
        rows = list(csv.DictReader(f))
    for row in rows:
        row["DependsOn"] = [d for d in row["DependsOn"].split(";") if d]
    return rows


def load_expected_files(task_id: str) -> list[str]:
    detail_path = DETAILS_DIR / f"TASK-{task_id}.md"
    if not detail_path.exists():
        return []
    text = detail_path.read_text(encoding="utf-8")
    match = re.search(r"## Expected Files\n(.*?)\n##", text, re.DOTALL)
    if not match:
        return []
    return re.findall(r"`([^`]+\.[a-zA-Z0-9]+)`", match.group(1))


def find_cycles(graph: dict[str, list[str]]) -> list[list[str]]:
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {k: WHITE for k in graph}
    cycles: list[list[str]] = []

    def dfs(u: str, stack: list[str]) -> None:
        color[u] = GRAY
        stack.append(u)
        for v in graph.get(u, []):
            if color.get(v, WHITE) == GRAY:
                cycles.append(stack[stack.index(v):] + [v])
            elif color.get(v, WHITE) == WHITE:
                dfs(v, stack)
        stack.pop()
        color[u] = BLACK

    for node in graph:
        if color[node] == WHITE:
            dfs(node, [])
    return cycles


def topological_order(graph: dict[str, list[str]]) -> list[str]:
    """graph[task] = list of dependency task ids. Returns dependencies-first order."""
    indegree = {k: 0 for k in graph}
    dependents = defaultdict(list)
    for task, deps in graph.items():
        for dep in deps:
            dependents[dep].append(task)
            indegree[task] += 1
    queue = deque(sorted(k for k, deg in indegree.items() if deg == 0))
    order: list[str] = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for nxt in sorted(dependents.get(node, [])):
            indegree[nxt] -= 1
            if indegree[nxt] == 0:
                queue.append(nxt)
    if len(order) != len(graph):
        remaining = sorted(set(graph) - set(order))
        raise RuntimeError(f"topological sort could not resolve (cycle involves): {remaining}")
    return order


def pull_forward_groups(graph: dict[str, list[str]], topo: list[str]) -> dict[str, int]:
    """A task's effective Wave Group can never be later than any of its dependents'
    (a dependency must never land in a later Wave than what depends on it — rule 2)."""
    dependents = defaultdict(list)
    for task, deps in graph.items():
        for dep in deps:
            dependents[dep].append(task)

    effective: dict[str, int] = {}
    for task in reversed(topo):  # sinks first, sources last
        candidates = [preferred_group(task)]
        candidates.extend(effective[d] for d in dependents.get(task, []))
        effective[task] = min(candidates)
    return effective


def chunk_balanced(items: list[str], min_size: int, max_size: int) -> list[list[str]]:
    n = len(items)
    if n == 0:
        return []
    if n <= max_size:
        return [items]
    import math

    num_chunks = math.ceil(n / max_size)
    base, rem = divmod(n, num_chunks)
    chunks = []
    idx = 0
    for i in range(num_chunks):
        size = base + (1 if i < rem else 0)
        chunks.append(items[idx : idx + size])
        idx += size
    return chunks


def split_file_conflicts(chunks: list[list[str]], expected_files: dict[str, list[str]]) -> list[list[str]]:
    """Push a task to the next chunk if it shares an Expected File with an earlier
    task already placed in the same chunk (rule 5). Simple greedy pass, not a full
    bin-packing solver — good enough for this manifest's near-zero real overlap.
    # ponytail: greedy single-pass split; revisit with real bin-packing if a future
    # manifest has heavy cross-task file overlap within one Wave Group.
    """
    result: list[list[str]] = [[] for _ in chunks]
    carry: list[str] = []
    for i, chunk in enumerate(chunks):
        pending = carry + chunk
        carry = []
        seen_files: set[str] = set()
        for task in pending:
            files = set(expected_files.get(task, []))
            if files & seen_files:
                carry.append(task)  # conflict -> defer to next chunk
            else:
                result[i].append(task)
                seen_files |= files
    if carry:
        result.append(carry)
    return [c for c in result if c]


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

    rows = load_manifest()
    task_ids = {r["TaskID"] for r in rows}
    graph = {r["TaskID"]: r["DependsOn"] for r in rows}
    row_by_id = {r["TaskID"]: r for r in rows}

    missing_deps = [
        (tid, dep) for tid, deps in graph.items() for dep in deps if dep not in task_ids
    ]
    if missing_deps:
        print("BUILD_WAVES_FAIL: DependsOn references unknown Task ID(s):")
        for tid, dep in missing_deps:
            print(f"  - {tid} -> {dep}")
        return 1

    cycles = find_cycles(graph)
    if cycles:
        print(f"BUILD_WAVES_FAIL: {len(cycles)} circular dependency(ies) found:")
        for c in cycles:
            print("  - " + " -> ".join(c))
        return 1

    topo = topological_order(graph)
    effective_group = pull_forward_groups(graph, topo)

    # rule 2 guard: a dependency's effective group must never exceed its dependent's.
    violations = [
        (tid, dep)
        for tid, deps in graph.items()
        for dep in deps
        if effective_group[dep] > effective_group[tid]
    ]
    if violations:
        print("BUILD_WAVES_FAIL: dependency scheduled after dependent:")
        for tid, dep in violations:
            print(f"  - {dep}(group {effective_group[dep]}) is a dependency of {tid}(group {effective_group[tid]})")
        return 1

    topo_rank = {tid: i for i, tid in enumerate(topo)}
    tasks_by_group: dict[int, list[str]] = defaultdict(list)
    for tid in topo:
        tasks_by_group[effective_group[tid]].append(tid)
    for g in tasks_by_group:
        tasks_by_group[g].sort(key=lambda t: topo_rank[t])

    expected_files = {tid: load_expected_files(tid) for tid in task_ids}

    waves: list[dict] = []
    for group in sorted(tasks_by_group):
        group_tasks = tasks_by_group[group]
        chunks = chunk_balanced(group_tasks, MIN_WAVE_SIZE, MAX_WAVE_SIZE)
        chunks = split_file_conflicts(chunks, expected_files)
        for chunk in chunks:
            waves.append({"group": group, "task_ids": sorted(chunk, key=lambda t: topo_rank[t])})

    for i, wave in enumerate(waves, start=1):
        wave["wave_id"] = f"W{i:02d}"
        wave["title"] = GROUP_TITLES[wave["group"]]
        wave["checkpoint_required"] = any(
            row_by_id[tid]["Category"] == "PAGE_OWNER" for tid in wave["task_ids"]
        )

    wave_id_of = {tid: w["wave_id"] for w in waves for tid in w["task_ids"]}

    # rule 4 guard: a Page Owner must be the last task (by dependency order) in its Wave.
    page_owner_positions = []
    for w in waves:
        ordered = sorted(w["task_ids"], key=lambda t: topo_rank[t])
        owners = [t for t in ordered if row_by_id[t]["Category"] == "PAGE_OWNER"]
        for owner in owners:
            is_last = ordered.index(owner) == len(ordered) - 1
            page_owner_positions.append((owner, w["wave_id"], is_last))

    # -- TASKS/TASK_DAG.md --
    dag_lines = [
        "# Task Dependency DAG — Free Traveler",
        "",
        "**생성:** `scripts/build_waves.py` (읽기 전용 입력: `TASK_MANIFEST.csv`, `TASK-*.md`, `SCREEN_ROUTE_CONTRACT.json`)",
        f"**순환 의존성:** {len(cycles)}건",
        "",
        "Task ID를 위상 정렬(Depends On이 항상 앞에 오는 순서)한 목록이다.",
        "",
        "| # | Task ID | Category | Depends On | Wave |",
        "|---:|---|---|---|---|",
    ]
    for i, tid in enumerate(topo, start=1):
        deps = ";".join(graph[tid]) or "(없음)"
        dag_lines.append(f"| {i} | {tid} | {row_by_id[tid]['Category']} | {deps} | {wave_id_of[tid]} |")
    DAG_PATH.write_text("\n".join(dag_lines) + "\n", encoding="utf-8")

    # -- TASKS/WAVE_PLAN.md --
    plan_lines = [
        "# Wave Plan — Free Traveler",
        "",
        "**생성:** `scripts/build_waves.py` — 이 문서와 `TASKS/WAVE_STATE.json`의 Wave ID가 이후 `/run-wave` 등 실행 단계의 정본이다.",
        "**재생성 시 주의:** 이 문서와 `TASKS/WAVE_STATE.json`은 `TASK_MANIFEST.csv`/`TASK-*.md`가 바뀔 때마다 `scripts/build_waves.py`를 다시 실행해 함께 갱신한다(수동 편집 금지).",
        "",
        "| 항목 | 값 |",
        "|---|---|",
        f"| 총 Wave 수 | {len(waves)} |",
        f"| 순환 의존성 | {len(cycles)}건 |",
        f"| Wave당 기본 크기 | {MIN_WAVE_SIZE}~{MAX_WAVE_SIZE}개(그룹이 이보다 작으면 그대로 1개 Wave) |",
        "",
        "---",
        "",
    ]
    for w in waves:
        plan_lines.append(f"## {w['wave_id']} — {w['title']}")
        plan_lines.append("")
        plan_lines.append(f"- **Task 수:** {len(w['task_ids'])}")
        plan_lines.append(f"- **Preview Checkpoint 필요:** {'예' if w['checkpoint_required'] else '아니오'}")
        plan_lines.append("- **Task 목록(Depends On 순서):**")
        for tid in sorted(w["task_ids"], key=lambda t: topo_rank[t]):
            r = row_by_id[tid]
            plan_lines.append(f"  - `{tid}` ({r['Category']}, Screen: {r['Screen'] or '해당 없음'})")
        plan_lines.append("")
    WAVE_PLAN_PATH.write_text("\n".join(plan_lines), encoding="utf-8")

    # -- TASKS/WAVE_STATE.json --
    state = {
        "schema_version": "traveler-wave-state-v1",
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "waves": [
            {
                "wave_id": w["wave_id"],
                "title": w["title"],
                "task_ids": sorted(w["task_ids"], key=lambda t: topo_rank[t]),
                "status": "pending",
                "checkpoint_required": w["checkpoint_required"],
                "checkpoint_result": None,
            }
            for w in waves
        ],
    }
    WAVE_STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # -- TASKS/TASK_MANIFEST.csv (rewrite with wave_id column) --
    with MANIFEST_PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f)
        header = ["Seq", "TaskID", "Category", "ImplementationStatus", "Screen", "Route",
                  "PageEntry", "DependsOn", "DetailFile", "DetailFileExists", "RequirementRef", "wave_id"]
        writer.writerow(header)
        for r in rows:
            writer.writerow([
                r["Seq"], r["TaskID"], r["Category"], r["ImplementationStatus"], r["Screen"],
                r["Route"], r["PageEntry"], ";".join(r["DependsOn"]), r["DetailFile"],
                r["DetailFileExists"], r["RequirementRef"], wave_id_of[r["TaskID"]],
            ])

    # -- Summary output --
    print(f"순환 의존성 수: {len(cycles)}")
    print(f"총 Wave 수: {len(waves)}")
    print("Wave별 Task 수:")
    for w in waves:
        print(f"  - {w['wave_id']} ({w['title']}): {len(w['task_ids'])}개")
    print("Page Owner 위치(Wave 내 마지막 Task 여부):")
    for owner, wid, is_last in page_owner_positions:
        print(f"  - {owner} -> {wid}, last={is_last}")
    if not all(is_last for _, _, is_last in page_owner_positions):
        print("BUILD_WAVES_FAIL: 규칙 4 위반 — Page Owner가 소속 Wave의 마지막 Task가 아님")
        return 1

    print("BUILD_WAVES_PASS")
    return 0


if __name__ == "__main__":
    sys.exit(main())
