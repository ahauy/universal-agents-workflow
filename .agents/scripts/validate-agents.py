#!/usr/bin/env python3
"""Validate agent frontmatter and subagent-call hygiene.

This exists because two classes of defect silently break subagent dispatch on
weak tool-calling models, and neither is caught by any runtime until a session
fails:

  Layer B (discovery)  an agent declaring a model ID the current harness cannot
                       serve is dropped from the registry before the session
                       starts, so the orchestrator reports "unknown agent" for a
                       file that plainly exists.

  Layer A (tool-call)  a prompt that demonstrates a call as single-quoted
                       pseudo-JSON teaches the model to emit single-quoted
                       pseudo-JSON, which the parser rejects with "unmatched '".

Both are fixable at authoring time, which is what this script does.

Contract reference: docs/architecture/MODEL_AND_TOOLCALL_CONTRACT.md

Usage:
  python3 .agents/scripts/validate-agents.py [--root DIR] [--strict]

Exit codes:
  0  clean
  1  violations found (warnings only, unless --strict)
  2  usage / IO error
"""

from __future__ import annotations

import argparse
import re
import sys
from dataclasses import dataclass
from pathlib import Path

# --- Layer B: model availability -------------------------------------------

# `inherit` means "use the session model", which every supported harness can
# resolve. Anything else is a hardcoded ID that will not resolve elsewhere.
ALLOWED_MODEL_VALUES = {"inherit"}

# --- Layer A: tool-call serialization --------------------------------------

# Characters that make a `task` value hostile to re-serialization. A double
# quote closes the JSON string early; a backslash is an escape lead-in; braces
# invite nested-object parsing; backtick/$ are Markdown/shell noise that models
# copy verbatim into JSON where they have no meaning.
UNSAFE_IN_TASK = {
    '"': "double quote closes the JSON string early",
    "\\": "backslash starts a JSON escape sequence",
    "`": "Markdown code fence, not valid inside a JSON string value",
    "$": "shell/math expansion marker, models mis-escape it",
    "{": "opening brace may be parsed as a nested object",
    "}": "closing brace may be parsed as a nested object",
}

# A `task=` / "task": occurrence, capturing the delimiter that follows.
TASK_ASSIGN_RE = re.compile(
    r"""(?:\btask\s*=\s*|["']task["']\s*:\s*)(?P<q>['"`])""",
    re.X,
)

# A contract/spec document has to *show* the anti-pattern to explain it. Those
# lines opt out explicitly rather than relying on the file being outside the
# scan set. Inside a fenced block the marker suppresses the rest of that block,
# so one comment line covers a whole worked example.
SUPPRESS_MARKER = "validate-agents:ignore"

FENCE_RE = re.compile(r"^\s*(?:```|~~~)")

FRONTMATTER_RE = re.compile(r"\A---\s*\n(?P<body>.*?)\n---\s*(?:\n|\Z)", re.S)


@dataclass
class Finding:
    path: Path
    line: int
    rule: str
    message: str
    level: str = "error"

    def render(self, root: Path) -> str:
        try:
            shown = self.path.relative_to(root)
        except ValueError:
            shown = self.path
        return f"{shown}:{self.line}: [{self.rule}] {self.message}"


def parse_frontmatter(text: str) -> dict[str, str] | None:
    """Minimal YAML-ish frontmatter reader.

    Deliberately not using a YAML library: the files are flat single-line
    mappings, and a hard dependency would make this script unrunnable in a
    bare checkout.
    """
    match = FRONTMATTER_RE.match(text)
    if not match:
        return None
    fields: dict[str, str] = {}
    for raw in match.group("body").splitlines():
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        if ":" not in raw:
            continue
        key, _, value = raw.partition(":")
        key = key.strip()
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        fields[key] = value
    return fields


def split_frontmatter_span(text: str) -> int:
    """Return the number of lines occupied by frontmatter (0 if none)."""
    match = FRONTMATTER_RE.match(text)
    if not match:
        return 0
    return match.group(0).count("\n")


def check_frontmatter(path: Path, fields: dict[str, str] | None) -> list[Finding]:
    findings: list[Finding] = []

    if fields is None:
        findings.append(
            Finding(path, 1, "frontmatter-missing",
                    "no YAML frontmatter block found; the harness will not load this agent")
        )
        return findings

    # name must equal the filename stem, or subagent_type will not resolve.
    name = fields.get("name", "")
    if not name:
        findings.append(Finding(path, 1, "name-missing", "frontmatter has no `name`"))
    elif name != path.stem:
        findings.append(
            Finding(path, 1, "name-mismatch",
                    f"`name: {name}` does not match filename stem '{path.stem}'; "
                    f"calls using subagent_type '{path.stem}' will not resolve")
        )

    # Layer B guard.
    model = fields.get("model")
    if model is None:
        findings.append(
            Finding(path, 1, "model-missing",
                    "no `model` key; set `model: inherit` explicitly so the agent "
                    "survives on every harness", "warning")
        )
    elif model not in ALLOWED_MODEL_VALUES:
        findings.append(
            Finding(path, 1, "model-hardcoded",
                    f"`model: {model}` is a hardcoded ID. Harnesses that cannot serve "
                    "it drop this agent from the registry before the session starts, "
                    "producing 'unknown agent'. Use `model: inherit`.")
        )

    # description is regex-extracted by tooling and injected into hook context.
    description = fields.get("description", "")
    if description and "'" in description:
        findings.append(
            Finding(path, 1, "description-apostrophe",
                    "ASCII apostrophe in `description`; downstream quoting may truncate "
                    "it. Use a typographic apostrophe or rephrase.")
        )

    return findings


def check_call_hygiene(path: Path, text: str, fm_lines: int) -> list[Finding]:
    """Layer A guards, applied to the body only (frontmatter is not a call site)."""
    findings: list[Finding] = []
    lines = text.splitlines()

    in_fence = False
    fence_suppressed = False

    for index in range(fm_lines, len(lines)):
        line = lines[index]
        lineno = index + 1

        # Track fenced blocks so a single marker line can cover a whole worked
        # example. The marker is honoured both outside a block (suppresses that
        # line) and as the first line inside one (suppresses the block).
        if FENCE_RE.match(line):
            in_fence = not in_fence
            if in_fence:
                fence_suppressed = SUPPRESS_MARKER in line
            continue

        if SUPPRESS_MARKER in line:
            if in_fence:
                fence_suppressed = True
            continue

        if in_fence and fence_suppressed:
            continue

        for match in TASK_ASSIGN_RE.finditer(line):
            delimiter = match.group("q")
            value = line[match.end():]

            # task='...' is the exact shape that makes a model emit single-quoted
            # pseudo-JSON. Flag the delimiter itself.
            if delimiter == "'":
                findings.append(
                    Finding(path, lineno, "task-single-quoted",
                            "task value uses single quotes. Show the canonical JSON form: "
                            'agent({"task": "...", "subagent_type": "..."})')
                )

            # Scan up to the matching close delimiter for unsafe characters.
            close = value.find(delimiter)
            captured = value if close == -1 else value[:close]
            for char, reason in UNSAFE_IN_TASK.items():
                if char == delimiter:
                    continue
                if char in captured:
                    findings.append(
                        Finding(path, lineno, "task-unsafe-char",
                                f"'{char}' inside a task value: {reason}")
                    )

        # A call example that uses `key=value` with no braces is not a tool call.
        if re.search(r"\bagent\(\s*(?![{'\"])\w+\s*=", line):
            findings.append(
                Finding(path, lineno, "call-not-json",
                        "agent(...) example is a bare key=value list, not JSON; "
                        "wrap arguments in { } with double-quoted keys")
            )

    return findings


def collect_agent_files(root: Path) -> list[Path]:
    """Files whose frontmatter defines a dispatchable agent."""
    candidates: list[Path] = []
    for agents_dir in sorted(root.glob("**/agents")):
        if _is_noise(agents_dir):
            continue
        candidates.extend(sorted(agents_dir.glob("*.md")))
    return _dedupe(candidates)


def collect_instruction_files(root: Path) -> list[Path]:
    """Files that teach the model how to call agents.

    A bad example in a skill or in AGENTS.md is copied by the model into a real
    tool call, so these get the Layer A checks even though they have no agent
    frontmatter of their own. Architecture docs are included too: a contract
    that is itself inconsistent with the rules it states is worse than no
    contract, so anti-pattern illustrations there opt out per line with
    SUPPRESS_MARKER rather than by path.
    """
    candidates: list[Path] = []
    patterns = (
        "**/SKILL.md",
        "**/AGENTS.md",
        "AGENTS.md",
        "GEMINI.md",
        "CLAUDE.md",
        "docs/**/*.md",
    )
    for pattern in patterns:
        candidates.extend(sorted(root.glob(pattern)))
    return _dedupe(candidates)


def _is_noise(path: Path) -> bool:
    return any(part in {".git", "node_modules", "__pycache__"} for part in path.parts)


def _dedupe(paths: list[Path]) -> list[Path]:
    seen: set[Path] = set()
    unique: list[Path] = []
    for path in paths:
        resolved = path.resolve()
        if resolved not in seen:
            seen.add(resolved)
            unique.append(path)
    return unique


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--root", default=".", type=Path,
                        help="repository root to scan (default: current directory)")
    parser.add_argument("--strict", action="store_true",
                        help="treat warnings as failures")
    parser.add_argument("--quiet", action="store_true", help="only print findings and the summary")
    args = parser.parse_args(argv)

    root: Path = args.root
    if not root.is_dir():
        print(f"error: not a directory: {root}", file=sys.stderr)
        return 2

    agent_files = collect_agent_files(root)
    instruction_files = [p for p in collect_instruction_files(root) if p not in agent_files]
    if not agent_files and not instruction_files:
        print(f"error: no agent or instruction files found under {root}", file=sys.stderr)
        return 2

    all_findings: list[Finding] = []

    # Agent files carry both layers: their frontmatter drives discovery, and
    # their body teaches the orchestrator how to call them.
    for path in agent_files:
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError) as exc:
            all_findings.append(Finding(path, 1, "read-error", str(exc)))
            continue
        fields = parse_frontmatter(text)
        all_findings.extend(check_frontmatter(path, fields))
        all_findings.extend(check_call_hygiene(path, text, split_frontmatter_span(text)))

    # Skill/orchestrator files have no agent frontmatter, but a bad call example
    # in them is copied verbatim into a real tool call.
    for path in instruction_files:
        try:
            text = path.read_text(encoding="utf-8")
        except (OSError, UnicodeDecodeError) as exc:
            all_findings.append(Finding(path, 1, "read-error", str(exc)))
            continue
        all_findings.extend(check_call_hygiene(path, text, split_frontmatter_span(text)))

    errors = [f for f in all_findings if f.level == "error"]
    warnings = [f for f in all_findings if f.level != "error"]

    for finding in all_findings:
        print(finding.render(root))

    if not args.quiet:
        print()
        print(f"checked {len(agent_files)} agent file(s) and "
              f"{len(instruction_files)} instruction file(s): "
              f"{len(errors)} error(s), {len(warnings)} warning(s)")

    if errors or (args.strict and warnings):
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
