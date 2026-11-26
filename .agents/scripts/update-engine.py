#!/usr/bin/env python3
"""
update-engine.py — Universal Agents Workflow Smart Update Engine
Cross-platform (macOS, Linux, Windows).

Usage:
  python3 update-engine.py --check          # Check for new version only (cached 24h)
  python3 update-engine.py --apply          # Apply update interactively
  python3 update-engine.py --apply --yes    # Apply update non-interactively (auto-keep conflicts)
"""

from __future__ import annotations

import argparse
import importlib.util
import subprocess
import fnmatch
import hashlib
import json
import os
import shutil
import sys
import tempfile
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

_state_spec = importlib.util.spec_from_file_location("update_state", Path(__file__).with_name("update-state.py"))
state = importlib.util.module_from_spec(_state_spec)
_state_spec.loader.exec_module(state)

# ── Constants ────────────────────────────────────────────────────────────────
REPO_URL = "https://github.com/ahauy/universal-agents-workflow.git"
VERSION_URL = "https://raw.githubusercontent.com/ahauy/universal-agents-workflow/main/version.json"
CACHE_HOURS = 24
WORKFLOW_SOURCE_PATH = ".agents/workflow-source.json"

# Default protected paths — always merged with user's workflow-source.json list
DEFAULT_PROTECTED: list[str] = [
    "CONTEXT.md",
    "PRODUCT_BACKLOG_ROADMAP.md",
    "CHANGELOG.md",
    "UPGRADE_NOTICE.md",
    "adr/",
    "docs/features/",
    "docs/user-guides/",
    "docs/architecture/",
    "docs/RUN_AND_TEST.md",
    ".specify/features/",
    "src/",
    ".env",
    ".env.*",
    "*.local",
    "*.local.md",
]

# Framework template exceptions inside protected dirs — can be updated
#
# These are the ONLY files we ship that live inside a protected directory.
# They are framework-owned, so they may be refreshed, but they still go through
# the 3-way hash check: if a user has edited one, it is treated as a conflict
# and the user is asked. Everything else under docs/ or adr/ is user-owned and
# is never modified.
PROTECTED_EXCEPTIONS: list[str] = [
    "adr/adr-template.md",
    "docs/architecture/LANGUAGE_PACK_SPEC.md",
    "docs/architecture/MODEL_AND_TOOLCALL_CONTRACT.md",
]

# What a fresh install ships. Deliberately narrower than the repository:
# optional-stack-skills/ is offered pack-by-pack through the installer's
# selector, and README/version.json are repo plumbing, not project content.
# The installer may extend this at runtime with the packs the user picked.
INSTALL_SHIP_LIST: list[str] = [
    ".agents",
    ".specify",
    "adr",
    "docs/architecture",
    "CONTEXT.md",
    "AGENTS.md",
    "GEMINI.md",
    "CLAUDE.md",
    ".cursorrules",
    ".windsurfrules",
    ".github/copilot-instructions.md",
]

# Files that must never be propagated from the source tree: VCS internals,
# editor/OS droppings, our own conflict artefacts, and per-project install
# state (overwriting a target's workflow-source.json would destroy its
# manifest and protectedPaths).
NOISE_DIRS = {".git", "__pycache__", "node_modules", ".venv", "venv"}
NOISE_FILES = {".DS_Store", "workflow-source.json"}
NOISE_SUFFIXES = (".pyc", ".pyo", ".bak", ".upstream", ".orig", ".rej", ".swp")


def is_noise(rel_path: str) -> bool:
    """True for paths that should never be copied into a user project."""
    if state.excluded(rel_path):
        return True
    parts = rel_path.replace("\\", "/").split("/")
    if any(p in NOISE_DIRS for p in parts[:-1]):
        return True
    name = parts[-1]
    if name in NOISE_FILES or name.startswith(".DS_Store"):
        return True
    return name.endswith(NOISE_SUFFIXES)

# ── Helpers ──────────────────────────────────────────────────────────────────

def sha256_file(path: Path) -> str:
    """Return the SHA-256 hex digest of a file."""
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def is_protected(rel_path: str, protected: list[str], exceptions: list[str]) -> bool:
    """Return True if rel_path is protected (and not an exception)."""
    # Check exceptions first
    for exc in exceptions:
        if fnmatch.fnmatch(rel_path, exc) or rel_path == exc:
            return False

    norm = rel_path.replace("\\", "/")
    for pattern in protected:
        p = pattern.replace("\\", "/")
        if p.endswith("/"):
            # Directory prefix match
            if norm == p.rstrip("/") or norm.startswith(p):
                return True
        elif "*" in p or "?" in p:
            if fnmatch.fnmatch(os.path.basename(norm), p) or fnmatch.fnmatch(norm, p):
                return True
        else:
            if norm == p:
                return True
    return False


def fetch_json(url: str, timeout: int = 8) -> Optional[dict]:
    """Fetch a JSON URL, return None on any error (offline-safe)."""
    try:
        with urllib.request.urlopen(url, timeout=timeout) as resp:  # noqa: S310
            return json.loads(resp.read().decode())
    except Exception:
        return None


def load_workflow_source(target_dir: Path) -> dict:
    """Load .agents/workflow-source.json from target directory."""
    return state.load(target_dir)


def save_workflow_source(target_dir: Path, data: dict) -> None:
    state.save(target_dir, data)


def get_protected_paths(ws_data: dict) -> tuple[list[str], list[str]]:
    """Merge default + user-defined protected paths and exceptions."""
    user_protected = ws_data.get("protectedPaths", [])
    exceptions = list(PROTECTED_EXCEPTIONS)
    protected = list(DEFAULT_PROTECTED)

    for entry in user_protected:
        if entry.startswith("!"):
            exc = entry[1:].strip()
            if exc not in exceptions:
                exceptions.append(exc)
        elif entry not in protected:
            protected.append(entry)

    return protected, exceptions


# ── Check Mode ───────────────────────────────────────────────────────────────

def cmd_check(target_dir: Path) -> int:
    """Check for a newer version. Prints a notification if available."""
    ws_data = load_workflow_source(target_dir)
    current_version = ws_data.get("version", "unknown")

    last_checked = ws_data.get("lastCheckedAt")
    if last_checked:
        try:
            last_dt = datetime.fromisoformat(last_checked.replace("Z", "+00:00"))
            age_hours = (datetime.now(timezone.utc) - last_dt).total_seconds() / 3600
            if age_hours < CACHE_HOURS:
                # Still within cache window — silent
                return 0
        except Exception:
            pass

    remote = fetch_json(VERSION_URL)
    if remote is None:
        print("[OFFLINE - skipped version check]", file=sys.stderr)
        return 0

    remote_version = remote.get("version", "")
    ws_data["lastCheckedAt"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    save_workflow_source(target_dir, ws_data)

    if remote_version and remote_version != current_version:
        highlights = remote.get("highlights", "")
        changelog = remote.get("changelogUrl", "")
        print()
        print("╔══════════════════════════════════════════════════════════════╗")
        print(f"║  🆙 Universal Agents Workflow update available: v{remote_version:<13}║")
        if highlights:
            # Wrap at 58 chars
            words = highlights.split()
            line, lines_out = "", []
            for w in words:
                if len(line) + len(w) + 1 > 58:
                    lines_out.append(line)
                    line = w
                else:
                    line = (line + " " + w).strip()
            if line:
                lines_out.append(line)
            for ln in lines_out[:3]:
                print(f"║  {ln:<60}║")
        if changelog:
            print(f"║  {changelog:<60}║")
        print("║  Run: /update  or  install.sh --update                      ║")
        print("╚══════════════════════════════════════════════════════════════╝")
        print()
    return 0


# ── Apply Mode ───────────────────────────────────────────────────────────────

def _expand_ship_entry(source_dir: Path, entry: str) -> dict[str, tuple[Path, str]]:
    """Expand one ship entry into {dest_rel: (abs_src, src_rel)}.

    An entry is `src` or `src=dest`. Without `=`, dest equals src. A directory
    source is expanded recursively, preserving its sub-structure under dest.
    """
    src_part, sep, dest_part = entry.partition("=")
    src_part = src_part.strip()
    dest_part = dest_part.strip() if sep else src_part
    if not src_part:
        return {}

    state.relative(src_part)
    state.relative(dest_part)
    src = state.contained(source_dir, src_part)
    if not src.exists():
        return {}

    result: dict[str, tuple[Path, str]] = {}
    if src.is_file():
        src_rel = src.relative_to(source_dir).as_posix()
        if not is_noise(src_rel):
            result[dest_part] = (src, src_rel)
        return result

    for root, dirs, files in os.walk(src):
        for d in dirs:
            if (Path(root) / d).is_symlink():
                raise ValueError("Source symlink directory is not supported")
        dirs[:] = [d for d in dirs if d not in NOISE_DIRS]
        for fname in files:
            abs_path = state.contained(source_dir, (Path(root) / fname).relative_to(source_dir).as_posix())
            src_rel = abs_path.relative_to(source_dir).as_posix()
            if is_noise(src_rel):
                continue
            sub_rel = abs_path.relative_to(src).as_posix()
            result[f"{dest_part}/{sub_rel}"] = (abs_path, src_rel)
    return result


def collect_framework_files(
    source_dir: Path, only: Optional[list[str]] = None
) -> dict[str, tuple[Path, str]]:
    """Return {dest_rel: (abs_src, src_rel)} for every shippable file.

    Noise (VCS internals, .DS_Store, __pycache__, conflict artefacts, install
    state) is excluded: it must never land in a user's project.

    `only` restricts the result to the given ship entries (see
    _expand_ship_entry). This is what lets the installer share this engine while
    still shipping a curated subset — optional-stack-skills is NOT copied
    wholesale, only the packs the user selected, and those land in
    .agents/skill-library/ (the cold tier) rather than at their repo location,
    so installing a language pack does not inflate the always-on index.
    """
    if only is None:
        only = INSTALL_SHIP_LIST

    result: dict[str, tuple[Path, str]] = {}
    for entry in only:
        expanded = _expand_ship_entry(source_dir, entry)
        for dest, source in expanded.items():
            if dest in result and result[dest] != source:
                raise ValueError("Conflicting mapping: " + dest)
            result[dest] = source

    return result


# ── Interactive decision core ────────────────────────────────────────────────

def _read_line(prompt: str) -> str:
    """Read a line from the user, surviving `curl | bash`.

    Under piped execution stdin is the script itself, so input() would consume
    installer code as answers. /dev/tty is the real terminal when there is one.
    """
    try:
        with open("/dev/tty", "r+", encoding="utf-8") as tty:
            tty.write(prompt)
            tty.flush()
            value = tty.readline()
            return value.strip() if value else "k"
    except OSError:
        pass
    try:
        sys.stdout.write(prompt)
        sys.stdout.flush()
        value = sys.stdin.readline()
        return value.strip() if value else "k"
    except Exception:
        return "k"


def ask_overwrite(rel: str, reason: str, non_interactive: bool) -> str:
    """Ask the user what to do with a file we would otherwise overwrite.

    Returns 'keep', 'overwrite' or 'diff'. Never defaults to overwrite: when we
    cannot ask, we keep the user's file.
    """
    if non_interactive:
        return "keep"

    print(f"\n  \u26a0\ufe0f  CONFLICT: {rel}")
    print(f"     {reason}")
    choice = ""
    while choice not in ("k", "o", "d"):
        raw = _read_line("     [K]eep your version / [O]verwrite (.bak saved) / [D]iff (.upstream saved) [k]: ")
        choice = (raw or "k").strip().lower()[:1]
    return {"k": "keep", "o": "overwrite", "d": "diff"}[choice]


def copy_atomic(source: Path, destination: Path) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    temporary = None
    try:
        with tempfile.NamedTemporaryFile(dir=destination.parent, delete=False) as stream:
            temporary = Path(stream.name)
        shutil.copy2(source, temporary)
        os.replace(temporary, destination)
    finally:
        if temporary is not None and temporary.exists():
            temporary.unlink()


def apply_one(rel: str, src_abs: Path, dest_abs: Path, decision: str,
              stats: dict, manifest: dict) -> None:
    """Carry out a resolved decision for a single file."""
    if decision == "overwrite":
        if dest_abs.exists():
            copy_atomic(dest_abs, Path(str(dest_abs) + ".bak"))
        dest_abs.parent.mkdir(parents=True, exist_ok=True)
        copy_atomic(src_abs, dest_abs)
        manifest[rel] = sha256_file(dest_abs)
        stats["conflicts"].append(f"{rel} \u2192 [O]verwritten (.bak saved)")
    elif decision == "diff":
        copy_atomic(src_abs, Path(str(dest_abs) + ".upstream"))
        stats["conflicts"].append(f"{rel} \u2192 [D]iff (.upstream saved)")
        # Deliberately NOT recorded in the manifest: the user's file is still
        # in place and unbaselined, so this stays a conflict next run until
        # they resolve it. Recording it would silently authorise a future
        # overwrite of a file we never actually wrote.
    else:
        stats["conflicts"].append(f"{rel} \u2192 [K]ept")
        # Same reasoning: a kept user file must not become the baseline.


def sync_file(dest_rel: str, src_abs: Path, src_rel: str, target_dir: Path,
              manifest: dict, protected: list[str], exceptions: list[str],
              non_interactive: bool, stats: dict) -> None:
    dest_abs = target_dir / dest_rel
    key = src_rel if src_rel == dest_rel else src_rel + "=>" + dest_rel
    if is_protected(dest_rel, protected, exceptions):
        if dest_abs.exists():
            stats["protected"].append(dest_rel)
        else:
            copy_atomic(src_abs, dest_abs)
            stats["updated"].append(dest_rel)
        return
    if not dest_abs.exists():
        copy_atomic(src_abs, dest_abs)
        manifest[key] = sha256_file(dest_abs)
        stats["updated"].append(dest_rel)
        return
    current_hash = sha256_file(dest_abs)
    installed_hash = manifest.get(key)
    new_hash = sha256_file(src_abs)
    if current_hash == installed_hash:
        if current_hash == new_hash:
            stats["skipped"].append(dest_rel)
        else:
            copy_atomic(src_abs, dest_abs)
            manifest[key] = sha256_file(dest_abs)
            stats["updated"].append(dest_rel)
        return
    reason = ("This framework file has been locally modified." if installed_hash
              else "Existing file has no verified baseline; identical bytes do not grant ownership.")
    decision = ask_overwrite(dest_rel, reason, non_interactive)
    apply_one(key, src_abs, dest_abs, decision, stats, manifest)


def sync_tree(source_dir: Path, target_dir: Path, manifest: dict[str, str],
              protected: list[str], exceptions: list[str],
              non_interactive: bool, ship: Optional[list[str]] = None) -> dict:
    """Write only missing files or unchanged owned files; never adopt kept bytes."""
    stats = {key: [] for key in ("updated", "protected", "user_custom", "conflicts", "skipped")}
    files = collect_framework_files(source_dir, only=ship if ship is not None else INSTALL_SHIP_LIST)
    destinations = sorted(files)
    for index, dest_rel in enumerate(destinations):
        state.contained(target_dir, dest_rel)
        if index and dest_rel.startswith(destinations[index - 1] + "/"):
            raise ValueError("File/directory mapping collision: " + dest_rel)
    for dest_rel, (src_abs, src_rel) in sorted(files.items()):
        sync_file(dest_rel, src_abs, src_rel, target_dir, manifest, protected,
                  exceptions, non_interactive, stats)
    stats["total_source"] = len(files)
    return stats


def print_sync_summary(stats: dict, version: str) -> None:
    print()
    print("\u2501" * 62)
    print(f"  \u2705 Updated / installed:   {len(stats['updated'])} files")
    print(f"  \U0001f6e1  Protected (untouched):  {len(stats['protected'])} paths")
    print(f"  \u23ed  Already identical:      {len(stats['skipped'])} files")
    print(f"  \u26a0\ufe0f  Conflicts kept/reviewed:     {len(stats['conflicts'])} files")
    print(f"  Unavailable packs: {len(stats.get('unavailable', []))}")
    for c in stats["conflicts"]:
        print(f"       {c}")
    if version:
        print(f"\n  Framework source version: {version}")
    print("\u2501" * 62)



def run_derived(source_dir: Path, target_dir: Path) -> list[dict]:
    commands = [
        ("index", "build-skill-index.mjs", ["--root", str(target_dir), "--prune", "--quiet"]),
        ("adapters", "sync-harnesses.mjs", ["--target", str(target_dir), "--quiet"]),
        ("hooks", "install-hooks.js", ["--target", str(target_dir), "--harness", "auto"]),
    ]
    results = []
    for phase, name, args in commands:
        script = state.contained(source_dir, ".agents/scripts/" + name)
        if not script.is_file():
            results.append({"phase": phase, "status": "unavailable", "error": "Verified source generator missing; phase not run"})
            print("  " + phase + ": unavailable (source generator missing)")
            continue
        result = {"phase": phase, "status": "failed"}
        if not shutil.which("node"):
            result["error"] = "Node.js unavailable; phase not run"
        else:
            try:
                proc = subprocess.run(["node", str(script), *args], cwd=target_dir,
                                      capture_output=True, text=True, timeout=60)
                result.update(status="ok" if proc.returncode == 0 else "failed",
                              returncode=proc.returncode, stdout=proc.stdout, stderr=proc.stderr)
                for line in reversed(proc.stdout.splitlines()):
                    try:
                        detail = json.loads(line)
                    except ValueError:
                        continue
                    if isinstance(detail, dict) and detail.get("phase"):
                        result["detail"] = detail
                        if detail.get("status") == "partial": result["status"] = "partial"
                        break
            except (OSError, subprocess.TimeoutExpired) as exc:
                result["error"] = str(exc)
        print("  " + phase + ": " + result["status"])
        if result["status"] == "failed":
            print(result.get("error") or result.get("stderr") or result.get("stdout") or "Phase failed")
        results.append(result)
    return results


def preflight_derived(source_dir: Path, target_dir: Path, ship: list[str]) -> None:
    files = collect_framework_files(source_dir, ship)
    for rel in files:
        state.contained(target_dir, rel)
    commands = [("build-skill-index.mjs", "--root"),
                ("sync-harnesses.mjs", "--target"), ("install-hooks.js", "--target")]
    states = ["harness-manifest.json", "derived-state-index.json", "derived-state-hooks.json"]
    if not shutil.which("node"):
        if any(state.contained(target_dir, ".agents/" + name).exists() for name in states):
            raise ValueError("Node.js required to validate existing derived ownership before source writes")
        return
    for name, flag in commands:
        script = state.contained(source_dir, ".agents/scripts/" + name)
        if script.is_file():
            proc = subprocess.run(["node", str(script), flag, str(target_dir), "--validate-only"],
                                  cwd=target_dir, capture_output=True, text=True, timeout=60)
            if proc.returncode:
                raise ValueError("Derived preflight rejected " + name + ": " + proc.stderr.strip())


def cmd_sync(target_dir: Path, source_dir: Path, version: str,
             ship: Optional[list[str]] = None, non_interactive: bool = False,
             git_mode: str = "", detect_packs: bool = False, installer_paths: bool = False) -> int:
    """Install (or re-install) framework files from a local source tree.

    This is the fresh-install path, and it shares sync_tree() with --apply so a
    re-install over an existing project gets exactly the same protection: user
    data is never touched, and a locally modified framework file triggers a
    prompt instead of a silent overwrite.
    """
    if installer_paths:
        for rel in (".gitignore", ".git/info/exclude", "UPGRADE_NOTICE.md"):
            state.contained(target_dir, rel)
    ws_data = load_workflow_source(target_dir)
    manifest: dict[str, str] = dict(ws_data.get("fileHashes", ws_data.get("manifest", {})))
    packs, ship = state.selections(source_dir, target_dir, ws_data, ship,
                                   INSTALL_SHIP_LIST, detect_packs, non_interactive, _read_line)
    protected, exceptions = get_protected_paths(ws_data)

    print()
    print("\u2501" * 62)
    print("  Universal Agents Workflow \u2014 Safe Sync")
    print(f"  Source: {source_dir}")
    print(f"  Target: {target_dir}")
    print("\u2501" * 62)

    # Prefer the version shipped in the source tree over whatever the caller
    # passed, so the recorded version can never drift from the files installed.
    src_version = state.contained(source_dir, "version.json")
    if src_version.is_file():
        try:
            meta = json.loads(src_version.read_text(encoding="utf-8"))
        except (ValueError, OSError) as exc:
            raise ValueError("Invalid source version.json") from exc
        if not isinstance(meta, dict) or not isinstance(meta.get("version"), str) or not meta["version"]:
            raise ValueError("Invalid source version metadata")
        version = meta["version"]
    if ws_data and "selectedPacks" not in ws_data:
        print("  Legacy registry has no confirmed optional packs; reconfirm selections explicitly.")

    unavailable = [p["id"] for p in packs if not state.contained(source_dir, p["source_path"]).exists()]
    preflight_derived(source_dir, target_dir, ship)
    stats = sync_tree(source_dir, target_dir, manifest, protected, exceptions,
                      non_interactive, ship=ship)
    stats["unavailable"] = unavailable

    ws_data.update({
        "schemaVersion": 2,
        "selectedPacks": packs,
        "fileHashes": manifest,
        "sourceRepo": ws_data.get("sourceRepo", REPO_URL),
        "sourcePath": str(source_dir),
        "version": version,
        "gitMode": git_mode or ws_data.get("gitMode", "local"),
        "installedAt": ws_data.get("installedAt")
        or datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "lastCheckedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "protectedPaths": ws_data.get("protectedPaths") or DEFAULT_PROTECTED,
        "manifest": manifest,
    })
    save_workflow_source(target_dir, ws_data)

    phases = run_derived(source_dir, target_dir)
    ws_data["lastSync"] = {"files": stats, "phases": phases,
                           "status": "partial" if stats["conflicts"] or unavailable or any(p["status"] != "ok" for p in phases) else "ok"}
    save_workflow_source(target_dir, ws_data)
    print_sync_summary(stats, version)
    print("  Refresh status: " + ws_data["lastSync"]["status"])
    return int(any(p["status"] == "failed" for p in phases))


def cmd_apply(target_dir: Path, non_interactive: bool = False) -> int:
    """Apply update from a fresh clone of the remote repo."""
    ws_data = load_workflow_source(target_dir)
    current_version = ws_data.get("version", "unknown")
    print()
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print("  🔄 Universal Agents Workflow — Smart Update Engine")
    print(f"  Installed: v{current_version}    Target: {target_dir}")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    # 1. Fetch remote version info
    remote_meta = fetch_json(VERSION_URL)
    if remote_meta is None:
        print("[OFFLINE - cannot apply update without network access]")
        return 1

    remote_version = remote_meta.get("version", "?")
    print(f"\n  Remote version: v{remote_version}")

    # 2. Clone remote to temp dir
    print("\n  📥 Cloning latest framework...")
    tmp_dir = tempfile.mkdtemp(prefix="uaw-update-")
    try:
        import subprocess
        result = subprocess.run(
            ["git", "clone", "--depth=1", REPO_URL, tmp_dir],
            capture_output=True, text=True, timeout=120
        )
        if result.returncode != 0:
            print(f"  ❌ Git clone failed:\n{result.stderr}")
            return 1

        source_dir = Path(tmp_dir)
        return cmd_sync(target_dir, source_dir, remote_version,
                        non_interactive=non_interactive)

    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


# ── CLI entry point ───────────────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(description="Universal Agents Workflow Update Engine")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--check", action="store_true", help="Check for new version (cached 24h)")
    group.add_argument("--apply", action="store_true", help="Apply update interactively")
    group.add_argument("--sync", action="store_true",
                       help="Install/refresh framework files from a local --source tree")
    parser.add_argument("--yes", "-y", action="store_true", help="Non-interactive: auto-keep conflicts")
    parser.add_argument("--target", default=".", help="Target project directory (default: .)")
    parser.add_argument("--source", default="",
                        help="Source tree for --sync (required with --sync)")
    parser.add_argument("--version", default="",
                        help="Version recorded in workflow-source.json for --sync")
    parser.add_argument("--ship", default="",
                        help="Comma-separated relative paths REPLACING the default "
                             "install set (use only if you know what you are doing)")
    parser.add_argument("--extra-ship", default="",
                        help="Comma-separated entries ADDED to the default install "
                             "set, e.g. the language packs the user selected")
    parser.add_argument("--installer-paths", action="store_true", help="Preflight final installer ignore/notice paths")
    parser.add_argument("--detect-packs", action="store_true", help="Offer detected catalog packs before synchronization")
    parser.add_argument("--git-mode", default="",
                        help="Record this git mode in workflow-source.json")
    args = parser.parse_args()

    target_dir = Path(args.target).resolve()
    if not target_dir.is_dir():
        print(f"❌ Target directory not found: {target_dir}", file=sys.stderr)
        return 1

    if args.sync:
        if not args.source:
            print("❌ --sync requires --source", file=sys.stderr)
            return 2
        source_dir = Path(args.source).resolve()
        if not source_dir.is_dir():
            print(f"❌ Source directory not found: {source_dir}", file=sys.stderr)
            return 1
        if args.ship:
            ship: Optional[list[str]] = [s.strip() for s in args.ship.split(",") if s.strip()]
        elif args.extra_ship:
            extra = [s.strip() for s in args.extra_ship.split(",") if s.strip()]
            ship = list(INSTALL_SHIP_LIST) + extra
        else:
            ship = None
        return cmd_sync(target_dir, source_dir, args.version or "unknown",
                        ship=ship, non_interactive=args.yes, git_mode=args.git_mode, detect_packs=args.detect_packs, installer_paths=args.installer_paths)

    if args.check:
        return cmd_check(target_dir)
    else:
        return cmd_apply(target_dir, non_interactive=args.yes)


if __name__ == "__main__":
    try:
        sys.exit(main())
    except (ValueError, OSError) as exc:
        print("Safe update rejected: " + str(exc), file=sys.stderr)
        sys.exit(1)
