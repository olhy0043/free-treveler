#!/usr/bin/env python3
"""Validate that the Traveler governance harness (CLAUDE.md + Skill + Commands +
design/screen contracts) is internally consistent and complete.

Read-only. Never modifies any file. Prints VALIDATE_HARNESS_PASS and exits 0
if all 13 checks hold; otherwise prints every missing file/rule and exits 1.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
APP_DIR = REPO_ROOT / "app"
DOCS_DIR = REPO_ROOT / "docs"
CLAUDE_MD_PATH = REPO_ROOT / "CLAUDE.md"
SKILL_PATH = REPO_ROOT / ".claude" / "skills" / "traveler-project-pipeline" / "SKILL.md"
COMMANDS_DIR = REPO_ROOT / ".claude" / "commands"
DESIGN_PATH = APP_DIR / "design-reference" / "D-001" / "DESIGN.md"
CONTRACT_PATH = APP_DIR / "design-reference" / "SCREEN_ROUTE_CONTRACT.json"
ARCHITECTURE_PATH = DOCS_DIR / "ARCHITECTURE.md"

EXPECTED_COMMANDS = [
    "gen-tasklist.md",
    "gen-task-details.md",
    "audit-tasks.md",
    "prepare-task.md",
    "implement-task.md",
    "run-wave.md",
    "release-check.md",
]

EXPECTED_SCHEMA_VERSION = "traveler-screen-route-v1"


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []

    def error(self, msg: str) -> None:
        self.errors.append(msg)

    def ok(self) -> bool:
        return not self.errors


def check_claude_md_exists(report: Report) -> str | None:
    """1. CLAUDE.md 존재"""
    if not CLAUDE_MD_PATH.exists():
        report.error(f"[1] missing {CLAUDE_MD_PATH.relative_to(REPO_ROOT)}")
        return None
    return CLAUDE_MD_PATH.read_text(encoding="utf-8")


def check_skill_exists(report: Report) -> None:
    """2. Claude Code Skill 파일 존재"""
    if not SKILL_PATH.exists():
        report.error(f"[2] missing {SKILL_PATH.relative_to(REPO_ROOT)}")


def check_commands_exist(report: Report) -> None:
    """3. 7개 Command 존재"""
    missing = [name for name in EXPECTED_COMMANDS if not (COMMANDS_DIR / name).exists()]
    if missing:
        report.error(
            f"[3] missing {len(missing)}/{len(EXPECTED_COMMANDS)} command file(s) "
            f"under {COMMANDS_DIR.relative_to(REPO_ROOT)}: {', '.join(missing)}"
        )
    if COMMANDS_DIR.exists():
        actual = sorted(p.name for p in COMMANDS_DIR.glob("*.md"))
        extra = [name for name in actual if name not in EXPECTED_COMMANDS]
        if extra:
            report.error(
                f"[3] unexpected command file(s) not in the required set of 7: "
                f"{', '.join(extra)}"
            )


def check_harness_marker(claude_md: str | None, report: Report) -> None:
    """4. traveler-screen-route-v1 Marker 존재"""
    if claude_md is None:
        report.error("[4] cannot check Harness Marker: CLAUDE.md missing")
        return
    if f"HARNESS_SCHEMA={EXPECTED_SCHEMA_VERSION}" not in claude_md:
        report.error(
            f"[4] CLAUDE.md does not contain 'HARNESS_SCHEMA={EXPECTED_SCHEMA_VERSION}'"
        )


def check_design_path(claude_md: str | None, report: Report) -> None:
    """5. D-001 DESIGN 경로 일치"""
    if claude_md is None:
        report.error("[5] cannot check DESIGN_PATH: CLAUDE.md missing")
        return
    match = re.search(r"^DESIGN_PATH=(\S+)$", claude_md, re.MULTILINE)
    if not match:
        report.error("[5] CLAUDE.md does not declare a DESIGN_PATH= marker")
        return
    declared = match.group(1)
    if declared != "design-reference/D-001/DESIGN.md":
        report.error(
            f"[5] DESIGN_PATH marker is '{declared}', expected "
            "'design-reference/D-001/DESIGN.md'"
        )
    if not DESIGN_PATH.exists():
        report.error(f"[5] declared design path does not exist: {DESIGN_PATH.relative_to(REPO_ROOT)}")


def check_screen_contract_path(claude_md: str | None, report: Report) -> dict | None:
    """6. Screen Contract 경로 일치"""
    if claude_md is not None:
        match = re.search(r"^SCREEN_CONTRACT=(\S+)$", claude_md, re.MULTILINE)
        if not match:
            report.error("[6] CLAUDE.md does not declare a SCREEN_CONTRACT= marker")
        else:
            declared = match.group(1)
            if declared != "design-reference/SCREEN_ROUTE_CONTRACT.json":
                report.error(
                    f"[6] SCREEN_CONTRACT marker is '{declared}', expected "
                    "'design-reference/SCREEN_ROUTE_CONTRACT.json'"
                )
    else:
        report.error("[6] cannot check SCREEN_CONTRACT: CLAUDE.md missing")

    if not CONTRACT_PATH.exists():
        report.error(f"[6] declared screen contract does not exist: {CONTRACT_PATH.relative_to(REPO_ROOT)}")
        return None
    try:
        data = json.loads(CONTRACT_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        report.error(f"[6] SCREEN_ROUTE_CONTRACT.json is not valid JSON: {exc}")
        return None
    if data.get("schema_version") != EXPECTED_SCHEMA_VERSION:
        report.error(
            f"[6] SCREEN_ROUTE_CONTRACT.json schema_version is "
            f"'{data.get('schema_version')}', expected '{EXPECTED_SCHEMA_VERSION}'"
        )
    return data


def check_page_owner_rule(claude_md: str | None, contract: dict | None, report: Report) -> None:
    """7. Page Owner 5개 규칙 존재"""
    if claude_md is not None and "Page Owner" not in claude_md:
        report.error("[7] CLAUDE.md does not mention a Page Owner rule")
    if contract is not None:
        owners = [s for s in contract.get("screens", []) if s.get("page_owner_task_required") is True]
        if len(owners) != 5:
            report.error(
                f"[7] SCREEN_ROUTE_CONTRACT.json has {len(owners)} "
                "page_owner_task_required=true screen(s), expected 5"
            )


def check_db_table_scope(report: Report) -> None:
    """8. DB Table 6개 기본 범위 존재"""
    if not ARCHITECTURE_PATH.exists():
        report.error(f"[8] missing {ARCHITECTURE_PATH.relative_to(REPO_ROOT)}")
        return
    text = ARCHITECTURE_PATH.read_text(encoding="utf-8")
    section_match = re.search(r"### 6-1\..*?\n(.*?)\n\n", text, re.DOTALL)
    if not section_match:
        report.error("[8] docs/ARCHITECTURE.md has no '### 6-1.' DB table-scope section")
        return
    table_rows = [
        line for line in section_match.group(1).splitlines()
        if line.strip().startswith("|") and "---" not in line and not line.strip().startswith("| 테이블")
    ]
    if len(table_rows) != 6:
        report.error(
            f"[8] docs/ARCHITECTURE.md §6-1 lists {len(table_rows)} table row(s), expected 6"
        )


def check_no_transmit_rule(claude_md: str | None, report: Report) -> None:
    """9. 외부 입력 비저장 규칙 존재"""
    if claude_md is None:
        report.error("[9] cannot check no-transmit rule: CLAUDE.md missing")
        return
    required_keywords = ["항공", "숙소", "서버", "URL", "로그"]
    missing = [kw for kw in required_keywords if kw not in claude_md]
    if missing:
        report.error(
            f"[9] CLAUDE.md is missing keyword(s) for the flight/hotel "
            f"no-transmit rule: {', '.join(missing)}"
        )


def check_playwright_rule(claude_md: str | None, report: Report) -> None:
    """10. Playwright Chromium Smoke 규칙 존재"""
    if claude_md is None:
        report.error("[10] cannot check Playwright rule: CLAUDE.md missing")
        return
    if "PLAYWRIGHT_SCOPE=chromium-smoke" not in claude_md:
        report.error("[10] CLAUDE.md Harness Marker is missing 'PLAYWRIGHT_SCOPE=chromium-smoke'")
    if "Chromium" not in claude_md or "Playwright" not in claude_md:
        report.error("[10] CLAUDE.md rules do not mention Playwright/Chromium Smoke scope")


def check_auto_merge_false(claude_md: str | None, report: Report) -> None:
    """11. AUTO_MERGE=false"""
    if claude_md is None:
        report.error("[11] cannot check AUTO_MERGE: CLAUDE.md missing")
        return
    if "AUTO_MERGE=false" not in claude_md:
        report.error("[11] CLAUDE.md Harness Marker is missing 'AUTO_MERGE=false'")


def check_aws_disabled(claude_md: str | None, report: Report) -> None:
    """12. AWS_ENABLED=false"""
    if claude_md is None:
        report.error("[12] cannot check AWS_ENABLED: CLAUDE.md missing")
        return
    if "AWS_ENABLED=false" not in claude_md:
        report.error("[12] CLAUDE.md Harness Marker is missing 'AWS_ENABLED=false'")


def check_excluded_protection_rule(claude_md: str | None, report: Report) -> None:
    """13. EXCLUDED 보호 규칙 존재"""
    if claude_md is None:
        report.error("[13] cannot check EXCLUDED protection rule: CLAUDE.md missing")
        return
    if "EXCLUDED" not in claude_md:
        report.error("[13] CLAUDE.md does not mention an EXCLUDED protection rule")


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

    report = Report()

    claude_md = check_claude_md_exists(report)
    check_skill_exists(report)
    check_commands_exist(report)
    check_harness_marker(claude_md, report)
    check_design_path(claude_md, report)
    contract = check_screen_contract_path(claude_md, report)
    check_page_owner_rule(claude_md, contract, report)
    check_db_table_scope(report)
    check_no_transmit_rule(claude_md, report)
    check_playwright_rule(claude_md, report)
    check_auto_merge_false(claude_md, report)
    check_aws_disabled(claude_md, report)
    check_excluded_protection_rule(claude_md, report)

    if report.ok():
        print("VALIDATE_HARNESS_PASS")
        return 0

    print(f"VALIDATE_HARNESS_FAIL: {len(report.errors)} violation(s) found:")
    for error in report.errors:
        print(f"  - {error}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
