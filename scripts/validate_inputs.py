#!/usr/bin/env python3
"""Validate the input contracts for the Traveler Task Generation Pipeline.

Run before /gen-tasklist. Reads (read-only):
  - app/design-reference/SCREEN_ROUTE_CONTRACT.json
  - docs/UIUX_TRACEABILITY.md
  - docs/PROJECT_SCOPE.md
  - app/package.json
  - app/src/app (file tree, informational)

Exits 0 with a PASS summary if every check holds, exits 1 and prints every
violation otherwise. Never modifies any file.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
APP_DIR = REPO_ROOT / "app"
DESIGN_REF = APP_DIR / "design-reference"
CONTRACT_PATH = DESIGN_REF / "SCREEN_ROUTE_CONTRACT.json"
DOCS_DIR = REPO_ROOT / "docs"
TRACEABILITY_PATH = DOCS_DIR / "UIUX_TRACEABILITY.md"
PROJECT_SCOPE_PATH = DOCS_DIR / "PROJECT_SCOPE.md"
PACKAGE_JSON_PATH = APP_DIR / "package.json"
SRC_APP_DIR = APP_DIR / "src" / "app"

EXPECTED_SCHEMA_VERSION = "traveler-screen-route-v1"
EXPECTED_SCREEN_COUNT = 5
EXPECTED_CORE_COUNT = 4
EXPECTED_AUX_COUNT = 1
EXPECTED_FUNC_COUNT = 80
EXPECTED_NF_COUNT = 34
ALLOWED_STATUS_VALUES = {"NOT_IMPLEMENTED", "EXCLUDED"}
FORBIDDEN_STATUS_VALUES = {"IMPLEMENTED", "DONE", "COMPLETE", "COMPLETED"}

ROW_RE = re.compile(r"^\|\s*(REQ-(?:FUNC|NF)-\d{3})\s")


class Report:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, msg: str) -> None:
        self.errors.append(msg)

    def warn(self, msg: str) -> None:
        self.warnings.append(msg)

    def ok(self) -> bool:
        return not self.errors


def split_row(line: str) -> list[str]:
    return [cell.strip() for cell in line.strip().strip("|").split("|")]


def classify(status: str) -> str:
    if status.startswith("IMPLEMENT"):
        return "IMPLEMENT"
    if status.startswith("EXCLUDED"):
        return "EXCLUDED"
    return "UNKNOWN"


def load_text(path: Path, report: Report) -> str | None:
    if not path.exists():
        report.error(f"missing required input file: {path.relative_to(REPO_ROOT)}")
        return None
    return path.read_text(encoding="utf-8")


def validate_contract(report: Report) -> dict | None:
    text = load_text(CONTRACT_PATH, report)
    if text is None:
        return None
    try:
        data = json.loads(text)
    except json.JSONDecodeError as exc:
        report.error(f"SCREEN_ROUTE_CONTRACT.json is not valid JSON: {exc}")
        return None

    schema_version = data.get("schema_version")
    if schema_version != EXPECTED_SCHEMA_VERSION:
        report.error(
            f"schema_version must be '{EXPECTED_SCHEMA_VERSION}', found "
            f"'{schema_version}'"
        )

    screens = data.get("screens", [])
    if len(screens) != EXPECTED_SCREEN_COUNT:
        report.error(
            f"screens[] must contain exactly {EXPECTED_SCREEN_COUNT} entries, "
            f"found {len(screens)}"
        )

    routes = [s.get("route") for s in screens]
    entries = [s.get("page_entry") for s in screens]
    if len(set(routes)) != len(routes):
        report.error("duplicate route values found in screens[]")
    if len(set(entries)) != len(entries):
        report.error("duplicate page_entry values found in screens[]")

    tiers = [s.get("screen_tier") for s in screens]
    core_count = tiers.count("core")
    aux_count = tiers.count("auxiliary")
    if core_count != EXPECTED_CORE_COUNT or aux_count != EXPECTED_AUX_COUNT:
        report.error(
            f"screen_tier split must be {EXPECTED_CORE_COUNT} core + "
            f"{EXPECTED_AUX_COUNT} auxiliary, found {core_count} core + "
            f"{aux_count} auxiliary"
        )

    required_fields = [
        "screen_id",
        "route",
        "page_entry",
        "screen_tier",
        "mobile_variant",
        "page_owner_task_required",
        "preview_required",
    ]
    for screen in screens:
        for field in required_fields:
            if field not in screen:
                report.error(
                    f"screen {screen.get('screen_id', '?')} is missing "
                    f"required field '{field}'"
                )
        if screen.get("page_owner_task_required") is not True:
            report.error(
                f"screen {screen.get('screen_id')} must have "
                "page_owner_task_required=true"
            )
        if screen.get("preview_required") is not True:
            report.error(
                f"screen {screen.get('screen_id')} must have preview_required=true"
            )
        page_entry = screen.get("page_entry", "")
        if page_entry and not page_entry.startswith("src/app/"):
            report.error(
                f"screen {screen.get('screen_id')} page_entry '{page_entry}' "
                "must live under src/app/ (Next.js App Router)"
            )

    scr001 = next((s for s in screens if s.get("screen_id") == "SCR-001"), None)
    if scr001 is None:
        report.error("SCR-001 not found in screens[]")
    elif scr001.get("starter_template_forbidden") is not True:
        report.error("SCR-001 must have starter_template_forbidden=true")

    for other in screens:
        if other.get("screen_id") != "SCR-001" and other.get(
            "starter_template_forbidden"
        ):
            report.warn(
                f"{other.get('screen_id')} also sets starter_template_forbidden=true "
                "(only SCR-001 is required to)"
            )

    tech_routes = data.get("technical_routes", [])
    known_routes = set(routes)
    known_entries = set(entries)
    for tech in tech_routes:
        if tech.get("counted_as_screen") is not False:
            report.error(
                f"technical_route '{tech.get('name')}' must have "
                "counted_as_screen=false"
            )
        if tech.get("route") in known_routes:
            report.error(
                f"technical_route '{tech.get('name')}' route collides with a "
                "Screen route"
            )
        if tech.get("page_entry") and tech.get("page_entry") in known_entries:
            report.error(
                f"technical_route '{tech.get('name')}' page_entry collides "
                "with a Screen page_entry"
            )

    return data


def parse_requirement_table(text: str) -> list[list[str]]:
    return [split_row(line) for line in text.splitlines() if ROW_RE.match(line)]


def validate_traceability(report: Report) -> dict[str, dict] | None:
    text = load_text(TRACEABILITY_PATH, report)
    if text is None:
        return None

    rows = parse_requirement_table(text)
    by_id: dict[str, dict] = {}
    for cells in rows:
        if len(cells) < 8:
            report.error(f"traceability row has fewer than 8 columns: {cells}")
            continue
        req_id = cells[0].split()[0]
        if req_id in by_id:
            report.error(f"duplicate requirement row in traceability: {req_id}")
        by_id[req_id] = {
            "implementation_status": cells[1],
            "screen": cells[2],
            "route": cells[3],
            "page_entry": cells[4],
            "task": cells[5],
            "test": cells[6],
            "status": cells[7],
        }

    func_ids = {f"REQ-FUNC-{i:03d}" for i in range(1, EXPECTED_FUNC_COUNT + 1)}
    nf_ids = {f"REQ-NF-{i:03d}" for i in range(1, EXPECTED_NF_COUNT + 1)}
    expected_ids = func_ids | nf_ids

    missing = expected_ids - by_id.keys()
    extra = by_id.keys() - expected_ids
    if missing:
        report.error(
            f"traceability is missing {len(missing)} requirement(s): "
            f"{', '.join(sorted(missing))}"
        )
    if extra:
        report.error(
            f"traceability has {len(extra)} unexpected requirement id(s): "
            f"{', '.join(sorted(extra))}"
        )

    for req_id, row in by_id.items():
        status = row["status"]
        if status in FORBIDDEN_STATUS_VALUES:
            report.error(
                f"{req_id}: Status column falsely claims '{status}' — nothing "
                "in this project is implemented yet, use NOT_IMPLEMENTED or EXCLUDED"
            )
        elif status not in ALLOWED_STATUS_VALUES:
            report.error(
                f"{req_id}: Status '{status}' is not one of {sorted(ALLOWED_STATUS_VALUES)}"
            )

        impl_category = classify(row["implementation_status"])
        if impl_category == "UNKNOWN":
            report.error(
                f"{req_id}: Implementation Status '{row['implementation_status']}' "
                "must start with IMPLEMENT or EXCLUDED"
            )
        elif impl_category == "EXCLUDED" and status != "EXCLUDED":
            report.error(
                f"{req_id}: Implementation Status is EXCLUDED-family but Status "
                f"column says '{status}' (must be EXCLUDED)"
            )
        elif impl_category == "IMPLEMENT" and status != "NOT_IMPLEMENTED":
            report.error(
                f"{req_id}: Implementation Status is IMPLEMENT-family but Status "
                f"column says '{status}' (must be NOT_IMPLEMENTED until built)"
            )

    return by_id


def validate_project_scope(report: Report, traceability: dict[str, dict] | None) -> None:
    text = load_text(PROJECT_SCOPE_PATH, report)
    if text is None or traceability is None:
        return

    rows = parse_requirement_table(text)
    by_id: dict[str, str] = {}
    for cells in rows:
        if len(cells) < 3:
            continue
        req_id = cells[0].split()[0]
        by_id[req_id] = cells[2]

    for req_id, trace_row in traceability.items():
        scope_status = by_id.get(req_id)
        if scope_status is None:
            report.error(f"{req_id}: not found in PROJECT_SCOPE.md")
            continue
        scope_category = classify(scope_status)
        trace_category = classify(trace_row["implementation_status"])
        if scope_category != trace_category and scope_category != "UNKNOWN":
            report.error(
                f"{req_id}: PROJECT_SCOPE.md says '{scope_status}' "
                f"({scope_category}) but UIUX_TRACEABILITY.md says "
                f"'{trace_row['implementation_status']}' ({trace_category})"
            )


def validate_project_tree(report: Report) -> None:
    if not PACKAGE_JSON_PATH.exists():
        report.error(f"missing {PACKAGE_JSON_PATH.relative_to(REPO_ROOT)}")
        return
    try:
        pkg = json.loads(PACKAGE_JSON_PATH.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        report.error(f"app/package.json is not valid JSON: {exc}")
        return
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    if "next" not in deps:
        report.error("app/package.json does not declare a 'next' dependency")

    if not SRC_APP_DIR.exists():
        report.error(f"missing {SRC_APP_DIR.relative_to(REPO_ROOT)}")
        return

    existing = sorted(
        p.relative_to(REPO_ROOT).as_posix()
        for p in SRC_APP_DIR.rglob("*")
        if p.is_file()
    )
    report.warn(
        "current app/src/app file tree (Expected Files must be computed "
        f"against this, not assumed): {existing}"
    )


def main() -> int:
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except (AttributeError, ValueError):
        pass

    report = Report()
    validate_contract(report)
    traceability = validate_traceability(report)
    validate_project_scope(report, traceability)
    validate_project_tree(report)

    for warning in report.warnings:
        print(f"WARN: {warning}")

    if report.ok():
        print("PASS: input contracts are internally consistent.")
        return 0

    print(f"FAIL: {len(report.errors)} violation(s) found:")
    for error in report.errors:
        print(f"  - {error}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
