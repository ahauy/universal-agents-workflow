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
PROTECTED_EXCEPTIONS: list[str] = [
    "adr/adr-template.md",
]

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
    ws_path = target_dir / WORKFLOW_SOURCE_PATH
    if ws_path.exists():
        try:
            return json.loads(ws_path.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {}


def save_workflow_source(target_dir: Path, data: dict) -> None:
    ws_path = target_dir / WORKFLOW_SOURCE_PATH
    ws_path.parent.mkdir(parents=True, exist_ok=True)
    ws_path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


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

def collect_framework_files(source_dir: Path) -> dict[str, Path]:
    """Walk source_dir, return {rel_path: abs_path} for all files."""
    result: dict[str, Path] = {}
    for root, dirs, files in os.walk(source_dir):
        # Skip hidden git internals
        dirs[:] = [d for d in dirs if d != ".git"]
        for fname in files:
            abs_path = Path(root) / fname
            rel = abs_path.relative_to(source_dir).as_posix()
            result[rel] = abs_path
    return result


def sync_hooks(target_dir: Path) -> None:
    """Re-register harness hooks after framework files were updated.

    .agents/hooks.json is the single source of truth (Antigravity dialect).
    Claude Code needs the same hooks mirrored into .claude/settings.json, so
    any update that touched hooks.json or the hook scripts must regenerate it.
    Best-effort: a missing Node.js runtime must never fail the update.
    """
    installer = target_dir / ".agents" / "scripts" / "install-hooks.js"
    if not installer.is_file():
        return
    if shutil.which("node") is None:
        print("  ⚠️  Node.js not found - skipped hook re-registration.")
        print("     Run manually after installing Node: node .agents/scripts/install-hooks.js --target .")
        return

    import subprocess

    try:
        proc = subprocess.run(
            ["node", str(installer), "--target", str(target_dir), "--harness", "auto"],
            capture_output=True, text=True, timeout=60,
        )
        out = (proc.stdout or "").strip()
        if proc.returncode == 0:
            print(f"  🪝  Hooks: {out or 'in sync'}")
        else:
            err = (proc.stderr or out or "").strip().splitlines()
            print(f"  ⚠️  Hook re-registration failed: {err[-1] if err else proc.returncode}")
    except Exception as exc:  # pragma: no cover - defensive
        print(f"  ⚠️  Hook re-registration error: {exc}")


def cmd_apply(target_dir: Path, non_interactive: bool = False) -> int:
    """Apply update from a fresh clone of the remote repo."""
    ws_data = load_workflow_source(target_dir)
    current_version = ws_data.get("version", "unknown")
    manifest: dict[str, str] = ws_data.get("manifest", {})
    protected, exceptions = get_protected_paths(ws_data)

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

    if remote_version == current_version:
        print(f"  ✅ Already up-to-date at v{current_version}. Nothing to do.")
        return 0

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
        all_source_files = collect_framework_files(source_dir)

        # 3. Categorise & apply
        stats = {"updated": [], "protected": [], "user_custom": [], "conflicts": [], "skipped": []}

        for rel, src_abs in sorted(all_source_files.items()):
            # Skip .git internals
            if rel.startswith(".git/"):
                continue

            dest_abs = target_dir / rel

            # ── STEP 0: Protected? ──
            if is_protected(rel, protected, exceptions):
                if dest_abs.exists():
                    stats["protected"].append(rel)
                    continue
                # Doesn't exist yet — safe to copy
                dest_abs.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src_abs, dest_abs)
                stats["updated"].append(rel)
                continue

            # ── User custom? (exists in target but NOT in manifest) ──
            if dest_abs.exists() and rel not in manifest:
                stats["user_custom"].append(rel)
                continue

            # ── 3-Way Hash check ──
            new_hash = sha256_file(src_abs)
            installed_hash = manifest.get(rel, "")

            if not dest_abs.exists():
                # New file from upstream
                dest_abs.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(src_abs, dest_abs)
                stats["updated"].append(rel)
                continue

            current_hash = sha256_file(dest_abs)

            if current_hash == new_hash:
                # Already identical
                stats["skipped"].append(rel)
                continue

            if installed_hash and current_hash == installed_hash:
                # User has NOT modified — safe auto-update
                shutil.copy2(src_abs, dest_abs)
                stats["updated"].append(rel)
                continue

            # ── Conflict: user has modified this framework file ──
            if non_interactive:
                # Default: keep user version
                stats["conflicts"].append(f"{rel} → [K]ept")
                continue

            print(f"\n  ⚠️  CONFLICT: {rel}")
            print("     This framework file has been locally modified.")
            choice = ""
            while choice not in ("k", "o", "d"):
                try:
                    choice = input("     [K]eep your version / [O]verwrite (creates .bak) / [D]iff (.upstream): ").strip().lower()
                except EOFError:
                    choice = "k"

            if choice == "o":
                shutil.copy2(dest_abs, Path(str(dest_abs) + ".bak"))
                shutil.copy2(src_abs, dest_abs)
                stats["conflicts"].append(f"{rel} → [O]verwritten (.bak saved)")
            elif choice == "d":
                upstream_path = Path(str(dest_abs) + ".upstream")
                shutil.copy2(src_abs, upstream_path)
                stats["conflicts"].append(f"{rel} → [D]iff (.upstream saved)")
            else:
                stats["conflicts"].append(f"{rel} → [K]ept")

        # 4. Rebuild manifest from newly installed state
        new_manifest: dict[str, str] = {}
        for rel in all_source_files:
            dest_abs = target_dir / rel
            if dest_abs.exists() and not is_protected(rel, protected, exceptions):
                new_manifest[rel] = sha256_file(dest_abs)

        # 5. Update workflow-source.json
        ws_data.update({
            "version": remote_version,
            "lastCheckedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
            "manifest": new_manifest,
        })
        save_workflow_source(target_dir, ws_data)

        # 5.5 Re-register harness hooks (Claude Code mirror of .agents/hooks.json)
        sync_hooks(target_dir)

        # 6. Summary report
        print()
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print(f"  ✅ Updated:               {len(stats['updated'])} files")
        print(f"  🛡️  Protected (skipped):   {len(stats['protected'])} paths")
        print(f"  👤 User-Custom Retained:  {len(stats['user_custom'])} files")
        print(f"  ⚠️  Conflicts Resolved:    {len(stats['conflicts'])} files")
        if stats["conflicts"]:
            for c in stats["conflicts"]:
                print(f"       {c}")
        print(f"\n  🎉 Framework updated to v{remote_version}!")
        print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        return 0

    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


# ── CLI entry point ───────────────────────────────────────────────────────────

def main() -> int:
    parser = argparse.ArgumentParser(description="Universal Agents Workflow Update Engine")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--check", action="store_true", help="Check for new version (cached 24h)")
    group.add_argument("--apply", action="store_true", help="Apply update interactively")
    parser.add_argument("--yes", "-y", action="store_true", help="Non-interactive: auto-keep conflicts")
    parser.add_argument("--target", default=".", help="Target project directory (default: .)")
    args = parser.parse_args()

    target_dir = Path(args.target).resolve()
    if not target_dir.is_dir():
        print(f"❌ Target directory not found: {target_dir}", file=sys.stderr)
        return 1

    if args.check:
        return cmd_check(target_dir)
    else:
        return cmd_apply(target_dir, non_interactive=args.yes)


if __name__ == "__main__":
    sys.exit(main())
